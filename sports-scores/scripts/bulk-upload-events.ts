/**
 * Fetches all matches for a given tournament/season from the Sofascore API
 * and bulk-uploads them to the Dataverse ss_matchsummary table.
 *
 * Run from the sports-scores directory:
 *   npx tsx scripts/bulk-upload-events.ts <leagueId> <seasonId> <sport> [displayType] [allEventsMode]
 *
 * Example (NRL 2025):
 *   npx tsx scripts/bulk-upload-events.ts 294 69277 rugby-league round false
 */

import {
  fetchAmericanFootballLastMatches,
  fetchAmericanFootballNextMatches,
} from "@/endpoints/american-football.api"
import {
  fetchBaseballLastMatches,
  fetchBaseballNextMatches,
} from "@/endpoints/baseball.api"
import {
  fetchBasketballLastMatches,
  fetchBasketballNextMatches,
} from "@/endpoints/basketball.api"
import {
  fetchFootballLastMatches,
  fetchFootballNextMatches,
} from "@/endpoints/football.api"
import {
  fetchIceHockeyLastMatches,
  fetchIceHockeyNextMatches,
} from "@/endpoints/ice-hockey.api"
import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueNextMatches,
} from "@/endpoints/rugby-league.api"
import {
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
} from "@/endpoints/sofascore-rapid-api.api"
import { fetchLastEvents, fetchNextEvents } from "@/endpoints/sofascore.api"
import {
  fetchTennisTournamentLastMatches,
  fetchTennisTournamentNextMatches,
} from "@/endpoints/tennis.api"
import { resolveSportImage } from "@/lib/imageMapping"
import {
  setMatchSummary,
  setSeriesInfo,
  setTimer,
  shortenTeamNames,
} from "@/lib/projUtils"
import { mapToDataverseMatchSummary } from "@/services/dataverse.service"
import { AmericanFootball_Sofascore_Event } from "@/types/american-football"
import { DataverseMatchSummary } from "@/types/dataverse"
import {
  DeepPartial,
  DisplayTypes,
  MatchStatus,
  MatchSummary,
  SPORT,
} from "@/types/misc"
import { Sofascore_Event } from "@/types/sofascore"
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

const ENVIRONMENT_URL = process.env.DATAVERSE_ENVIRONMENT_URL ?? ""
const TENANT_ID = process.env.DATAVERSE_TENANT_ID ?? ""
const CLIENT_ID = process.env.DATAVERSE_CLIENT_ID ?? ""
const CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET ?? ""

const TABLE = "ss_matchsummaries"
const CHUNK_SIZE = 100

const [
  ,
  ,
  leagueIdArg,
  seasonIdArg,
  sportArg,
  displayTypeArg,
  allEventsArg,
  useSportApiArg,
] = process.argv
const allEventsMode = allEventsArg === "false" ? false : true
const useSportApi = useSportApiArg === "true"
const leagueId = leagueIdArg
const seasonId = seasonIdArg
const sport = sportArg as SPORT
const displayType = (displayTypeArg as DisplayTypes) ?? DisplayTypes.ROUND

const sportFetchLastEventsMap: Partial<Record<SPORT, typeof fetchLastEvents>> =
  {
    [SPORT.AMERICAN_FOOTBALL]: fetchAmericanFootballLastMatches,
    [SPORT.AUSSIE_RULES]: fetchTournamentLastMatches,
    [SPORT.BASEBALL]: fetchBaseballLastMatches,
    [SPORT.BASKETBALL]: fetchBasketballLastMatches,
    [SPORT.FOOTBALL]: fetchFootballLastMatches,
    [SPORT.ICE_HOCKEY]: fetchIceHockeyLastMatches,
    [SPORT.RUGBY_LEAGUE]: fetchRugbyLeagueLastMatches,
    [SPORT.TENNIS]: fetchTennisTournamentLastMatches,
  }

const sportFetchNextEventsMap: Partial<Record<SPORT, typeof fetchNextEvents>> =
  {
    [SPORT.AMERICAN_FOOTBALL]: fetchAmericanFootballNextMatches,
    [SPORT.AUSSIE_RULES]: fetchTournamentNextMatches,
    [SPORT.BASEBALL]: fetchBaseballNextMatches,
    [SPORT.BASKETBALL]: fetchBasketballNextMatches,
    [SPORT.FOOTBALL]: fetchFootballNextMatches,
    [SPORT.ICE_HOCKEY]: fetchIceHockeyNextMatches,
    [SPORT.RUGBY_LEAGUE]: fetchRugbyLeagueNextMatches,
    [SPORT.TENNIS]: fetchTennisTournamentNextMatches,
  }

if (!leagueId || !seasonId || !sport) {
  console.error(
    "Usage: npx tsx scripts/bulk-upload-events.ts <leagueId> <seasonId> <sport> <displayType?> <allEventsMode?> <useSportApi?>",
  )
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

async function getAccessToken() {
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: `${ENVIRONMENT_URL}/.default`,
      }),
    },
  )
  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  return data.access_token as string
}

// ---------------------------------------------------------------------------
// Fetch records from API
// ---------------------------------------------------------------------------

async function fetchAllPages(label: string, fn: typeof fetchLastEvents) {
  const events: Sofascore_Event[] = []
  let page = 0
  while (true) {
    console.log(`Fetching ${label} events page ${page}...`)
    const data = await fn(leagueId, seasonId, page)
    if (!data || data.events.length === 0) break
    events.push(...data.events)
    if (!data.hasNextPage) break
    page++
  }
  console.log(`Fetched ${events.length} ${label} events in ${page + 1} pages.`)
  return events
}

async function fetchAllRecords() {
  const lastFn = useSportApi
    ? (sportFetchLastEventsMap[sport] ?? fetchLastEvents)
    : fetchLastEvents
  const nextFn = useSportApi
    ? (sportFetchNextEventsMap[sport] ?? fetchNextEvents)
    : fetchNextEvents

  const [lastEvents, nextEvents] = await Promise.all([
    fetchAllPages("last", lastFn),
    fetchAllPages("next", nextFn),
  ])

  return [...lastEvents, ...nextEvents]
}

async function fetchLatestEvents() {
  const events: Sofascore_Event[] = []
  const fetchFn = sportFetchLastEventsMap[sport] ?? fetchLastEvents
  console.log(`Fetching latest events `)
  const data = await fetchFn(leagueId, seasonId)
  if (!data || data.events.length === 0) return events
  events.push(...data.events)
  console.log(`Fetched ${events.length} latest events.`)
  return events
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

function eventMapper(
  event: AmericanFootball_Sofascore_Event,
  options?: DeepPartial<MatchSummary>,
): MatchSummary {
  const startDate = new Date(0)
  startDate.setUTCSeconds(event.startTimestamp)

  const status =
    event.status.type === "inprogress" || event.status.type === "interrupted"
      ? MatchStatus.LIVE
      : event.status.type === "notstarted"
        ? MatchStatus.UPCOMING
        : MatchStatus.COMPLETED

  return {
    id: options?.id ?? event.id.toString(),
    startDate: options?.startDate ?? startDate,
    endDate: options?.endDate,
    sport: sport,
    status: options?.status ?? status,
    roundLabel: options?.roundLabel ?? `Round ${event.roundInfo?.round}`,
    summaryText:
      options?.summaryText ??
      setMatchSummary(
        event.status.type,
        event.homeTeam.name,
        event.homeScore.current,
        event.awayTeam.name,
        event.awayScore.current,
      ),
    timer:
      options?.timer ??
      setTimer(
        event.status.type,
        event.status.description,
        options?.startDate ?? startDate,
        event.time?.played ?? 0,
        event.time?.periodLength ?? 0,
      ),
    timerDisplayColour:
      options?.timerDisplayColour ??
      (event.status.type === "inprogress" || event.status.type === "interrupted"
        ? "green"
        : "gray"),
    otherDetail:
      options?.otherDetail ??
      setSeriesInfo(
        event.homeTeam.nameCode,
        event.homeScore.series,
        event.awayTeam.nameCode,
        event.awayScore.series,
      ),
    venue:
      options?.venue ??
      (event?.venue?.name &&
        `${event?.venue?.name}, ${event?.venue?.city.name}`),
    matchSlug:
      options?.matchSlug ??
      `/sports/${sport}/${event.tournament.uniqueTournament.id}/${event.season.id}/match/${event.id}`,
    seasonId: options?.seasonId ?? event.season.id.toString(),
    leagueId:
      options?.leagueId ?? event.tournament.uniqueTournament.id.toString(),
    leagueName: options?.leagueName,
    leagueSlug: options?.leagueSlug,
    leagueImg: options?.leagueImg ?? resolveSportImage(""),
    competitorDetails: [
      {
        id: options?.competitorDetails?.[0]?.id ?? event.homeTeam.id.toString(),
        name:
          options?.competitorDetails?.[0]?.name ??
          `${event.homeTeamSeed ? `${event.homeTeamSeed} ` : ""}${shortenTeamNames(event.homeTeam.name)}`,
        score:
          options?.competitorDetails?.[0]?.score ??
          event.homeScore.current?.toString() ??
          "0",
        img:
          options?.competitorDetails?.[0]?.img ??
          resolveSportImage(event.homeTeam.name),
        winDrawLoss:
          event.homeTeamSeasonHistoricalForm &&
          `${event.homeTeamSeasonHistoricalForm.wins ?? 0}-${event.homeTeamSeasonHistoricalForm.losses ?? 0}${event.homeTeamSeasonHistoricalForm.draws ? "-" + event.homeTeamSeasonHistoricalForm.draws : ""}`,
        slug:
          options?.competitorDetails?.[0]?.slug ??
          `/sports/${sport}/team/${event.homeTeam.id}`,
      },
      {
        id: options?.competitorDetails?.[1]?.id ?? event.awayTeam.id.toString(),
        name:
          options?.competitorDetails?.[1]?.name ??
          `${event.awayTeamSeed ? `${event.awayTeamSeed} ` : ""}${shortenTeamNames(event.awayTeam.name)}`,
        score:
          options?.competitorDetails?.[1]?.score ??
          event.awayScore.current?.toString() ??
          "0",
        img:
          options?.competitorDetails?.[1]?.img ??
          resolveSportImage(event.awayTeam.name),
        winDrawLoss:
          event.awayTeamSeasonHistoricalForm &&
          `${event.awayTeamSeasonHistoricalForm.wins ?? 0}-${event.awayTeamSeasonHistoricalForm.losses ?? 0}${event.awayTeamSeasonHistoricalForm.draws ? "-" + event.awayTeamSeasonHistoricalForm.draws : ""}`,
        slug:
          options?.competitorDetails?.[1]?.slug ??
          `/sports/${sport}/team/${event.awayTeam.id}`,
      },
    ],
    winner:
      options?.winner ??
      (event.winnerCode !== 1 && event.winnerCode !== 2
        ? undefined
        : event.winnerCode),
  }
}

function mapEventToRecord(
  event: Sofascore_Event,
): Omit<DataverseMatchSummary, "ss_matchsummaryid"> {
  const matchSummary = eventMapper(event)

  return mapToDataverseMatchSummary(matchSummary)
}

// ---------------------------------------------------------------------------
// $batch upload
// ---------------------------------------------------------------------------

type BatchOperation =
  | { method: "POST"; record: Omit<DataverseMatchSummary, "ss_matchsummaryid"> }
  | {
      method: "PATCH"
      dvId: string
      record: Omit<DataverseMatchSummary, "ss_matchsummaryid">
    }

function buildBatchBody(operations: BatchOperation[], boundary: string) {
  const baseUrl = `${ENVIRONMENT_URL}/api/data/v9.2/${TABLE}`
  const parts = operations.map((op) => {
    const body = JSON.stringify(op.record)
    const contentLength = Buffer.byteLength(body, "utf8")
    const requestLine =
      op.method === "POST"
        ? `POST ${baseUrl} HTTP/1.1`
        : `PATCH ${baseUrl}(${op.dvId}) HTTP/1.1`
    return [
      `--${boundary}`,
      "Content-Type: application/http",
      "Content-Transfer-Encoding: binary",
      "",
      requestLine,
      "Content-Type: application/json;odata.metadata=minimal",
      `Content-Length: ${contentLength}`,
      "Accept: application/json",
      "OData-MaxVersion: 4.0",
      "OData-Version: 4.0",
      "Prefer: return=minimal",
      ...(op.method === "PATCH" ? ["If-Match: *"] : []),
      "",
      body,
    ].join("\r\n")
  })
  return parts.join("\r\n") + `\r\n--${boundary}--`
}

async function uploadBatch(token: string, operations: BatchOperation[]) {
  const boundary = `batch_${Date.now()}`
  const body = buildBatchBody(operations, boundary)

  const res = await fetch(`${ENVIRONMENT_URL}/api/data/v9.2/$batch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/mixed; boundary=${boundary}`,
      Accept: "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
    },
    body,
  })

  const text = await res.text()
  if (!res.ok) {
    console.error(`Batch request failed: ${res.status}`, text)
    return 0
  }

  return (text.match(/HTTP\/1\.1 204 No Content/g) ?? []).length
}

// ---------------------------------------------------------------------------
// Fetch existing match IDs from Dataverse
// ---------------------------------------------------------------------------

// Returns Map<ss_matchid, ss_matchsummaryid (Dataverse GUID)>
async function fetchExistingRecords(
  token: string,
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  let url: string | null =
    `${ENVIRONMENT_URL}/api/data/v9.2/${TABLE}` +
    `?$select=ss_matchid,ss_matchsummaryid` +
    `&$filter=ss_leagueid eq '${leagueId}' and ss_seasonid eq '${seasonId}' and ss_sport eq '${sport}'` +
    `&$top=5000`

  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        Prefer: "odata.maxpagesize=5000",
      },
    })
    if (!res.ok) {
      throw new Error(
        `Failed to fetch existing records: ${res.status} ${await res.text()}`,
      )
    }
    const data = (await res.json()) as {
      value: { ss_matchid: string; ss_matchsummaryid: string }[]
      "@odata.nextLink"?: string
    }
    for (const row of data.value) {
      map.set(row.ss_matchid, row.ss_matchsummaryid)
    }
    url = data["@odata.nextLink"] ?? null
  }

  return map
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    `\nBulk uploading ${sport} matches — league ${leagueId}, season ${seasonId}`,
  )

  const token = await getAccessToken()

  console.log("Checking for existing records in Dataverse...")
  const existingRecords = await fetchExistingRecords(token)
  console.log(`Found ${existingRecords.size} existing matches in Dataverse.`)

  const events = await (allEventsMode ? fetchAllRecords() : fetchLatestEvents())
  console.log(`Fetched ${events.length} matches from API.`)

  const operations: BatchOperation[] = events.map((e) => {
    const record = mapEventToRecord(e)
    const dvId = existingRecords.get(e.id.toString())
    return dvId ? { method: "PATCH", dvId, record } : { method: "POST", record }
  })

  const createCount = operations.filter((o) => o.method === "POST").length
  const updateCount = operations.filter((o) => o.method === "PATCH").length
  console.log(`${createCount} to create, ${updateCount} to update.`)

  if (operations.length === 0) {
    console.log("Nothing to upload.")
    return
  }

  const totalChunks = Math.ceil(operations.length / CHUNK_SIZE)
  let totalSuccess = 0
  let totalFailed = 0

  for (let i = 0; i < operations.length; i += CHUNK_SIZE) {
    const chunk = operations.slice(i, i + CHUNK_SIZE)
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1
    console.log(
      `\nUploading chunk ${chunkNum}/${totalChunks} (${chunk.length} operations)...`,
    )

    const successes = await uploadBatch(token, chunk)
    const failures = chunk.length - successes
    console.log(`  ✓ ${successes} succeeded, ✗ ${failures} failed`)

    totalSuccess += successes
    totalFailed += failures
  }

  console.log(
    `\nDone. Total: ${totalSuccess} succeeded, ${totalFailed} failed.`,
  )

  if (totalFailed > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
