/**
 * Fetches matches for a given tournament/season and bulk-uploads them to
 * the Dataverse ss_matchsummary table.
 *
 * Supports both Sofascore-based leagues and custom adapters (F1, Golf,
 * Motorsport substages, file-based) via a unified adapter registry.
 *
 * Run from the sports-scores directory:
 *   npx tsx scripts/bulk-upload-events.ts <leagueId> <seasonId> <sport> [displayType] [allEventsMode] [useSportApi]
 *
 * Examples:
 *   npx tsx scripts/bulk-upload-events.ts 294 86317 rugby-league round false true
 *   npx tsx scripts/bulk-upload-events.ts f1 2026 motorsport
 *   npx tsx scripts/bulk-upload-events.ts pga 2026 golf
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
import { fetchF1Events } from "@/endpoints/f1.api"
import {
  fetchFootballLastMatches,
  fetchFootballNextMatches,
} from "@/endpoints/football.api"
import { fetchGolfSchedule } from "@/endpoints/golf.api"
import {
  fetchIceHockeyLastMatches,
  fetchIceHockeyNextMatches,
} from "@/endpoints/ice-hockey.api"
import { fetchMotorsportSubstages } from "@/endpoints/motorsport.api"
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
import { americanFootballService } from "@/services/american-football.service"
import { aussieRulesService } from "@/services/aussie-rules.service"
import { baseballService } from "@/services/baseball.service"
import { basketballService } from "@/services/basketball.service"
import { mapToDataverseMatchSummary } from "@/services/dataverse.service"
import { mapRaceToMatchSummaries } from "@/services/f1.service"
import { footballService } from "@/services/football.service"
import { mapTournamentToMatchSummary } from "@/services/golf.service"
import { iceHockeyService } from "@/services/ice-hockey.service"
import { motorsportSofascoreService } from "@/services/motorsport-sofascore.service"
import { rugbyLeagueService } from "@/services/rugby-league.service"
import { tennisService } from "@/services/tennis.service"
import { DataverseMatchSummary } from "@/types/dataverse"
import {
  CardVariant,
  DisplayTypes,
  MatchStatus,
  MatchSummary,
  SPORT,
} from "@/types/misc"
import { Sofascore_Event } from "@/types/sofascore"
import { loadEnvConfig } from "@next/env"
import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

loadEnvConfig(process.cwd())

const ENVIRONMENT_URL = process.env.DATAVERSE_ENVIRONMENT_URL ?? ""
const TENANT_ID = process.env.DATAVERSE_TENANT_ID ?? ""
const CLIENT_ID = process.env.DATAVERSE_CLIENT_ID ?? ""
const CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET ?? ""

const TABLE = "ss_matchsummaries"
const CHUNK_SIZE = 100

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

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

if (!leagueId || !seasonId || !sport) {
  console.error(
    "Usage: npx tsx scripts/bulk-upload-events.ts <leagueId> <seasonId> <sport> [displayType] [allEventsMode] [useSportApi]",
  )
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Unified Adapter Interface
// ---------------------------------------------------------------------------

type LeagueAdapter = {
  fetchMatches: (
    leagueId: string,
    seasonId: string,
    allEvents: boolean,
  ) => Promise<MatchSummary[]>
}

// ---------------------------------------------------------------------------
// Sofascore adapter factory
// ---------------------------------------------------------------------------

function createSofascoreAdapter(
  fetchLast: typeof fetchLastEvents,
  fetchNext: typeof fetchNextEvents,
  mapper: (event: Sofascore_Event) => MatchSummary,
): LeagueAdapter {
  return {
    async fetchMatches(leagueId, seasonId, allEvents) {
      if (allEvents) {
        const [lastEvents, nextEvents] = await Promise.all([
          fetchAllPages("last", fetchLast, leagueId, seasonId),
          fetchAllPages("next", fetchNext, leagueId, seasonId),
        ])
        return [...lastEvents, ...nextEvents].map(mapper)
      } else {
        console.log("Fetching latest events...")
        const data = await fetchLast(leagueId, seasonId)
        if (!data || data.events.length === 0) return []
        console.log(`Fetched ${data.events.length} latest events.`)
        return data.events.map(mapper)
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Custom adapter: file-based
// ---------------------------------------------------------------------------

function createFileAdapter(adapterLeagueId: string): LeagueAdapter {
  return {
    async fetchMatches(_leagueId, seasonId) {
      const filePath = resolve(
        __dirname,
        `${adapterLeagueId}-${seasonId}-events.json`,
      )

      if (!existsSync(filePath)) {
        throw new Error(`Events file not found: ${filePath}`)
      }

      const raw = JSON.parse(readFileSync(filePath, "utf-8")) as Array<{
        id: string
        sport: string
        summaryText: string
        startDate: string
        endDate?: string
        status: string
        leagueName: string
        leagueImg?: string
        leagueSlug: string
        matchSlug: string
        roundLabel: string
        timer: string
        timerDisplayColour: string
        venue: string
        seasonId: string
        leagueId: string
        competitorDetails: { id: string; score: string; name: string }[]
        cardVariant: string
      }>

      return raw.map((item) => ({
        id: item.id,
        sport: item.sport as SPORT,
        summaryText: item.summaryText,
        startDate: new Date(item.startDate),
        endDate: item.endDate ? new Date(item.endDate) : undefined,
        status: item.status as MatchStatus,
        leagueName: item.leagueName,
        leagueImg: item.leagueImg,
        leagueSlug: item.leagueSlug,
        matchSlug: item.matchSlug,
        roundLabel: item.roundLabel,
        timer: item.status === "UPCOMING" ? new Date(item.timer) : item.timer,
        timerDisplayColour: item.timerDisplayColour as
          | "green"
          | "yellow"
          | "gray",
        venue: item.venue,
        seasonId: item.seasonId,
        leagueId: item.leagueId,
        competitorDetails: item.competitorDetails ?? [],
        cardVariant: (item.cardVariant as CardVariant) ?? CardVariant.DEFAULT,
      }))
    },
  }
}

// ---------------------------------------------------------------------------
// Adapter registry
// ---------------------------------------------------------------------------

type AdapterMap = Record<string, LeagueAdapter> & { default?: LeagueAdapter }

const adapters: Partial<Record<SPORT, AdapterMap>> = {
  // --- Sofascore-based sports (sport-specific endpoints) ---
  [SPORT.AMERICAN_FOOTBALL]: {
    default: createSofascoreAdapter(
      fetchAmericanFootballLastMatches,
      fetchAmericanFootballNextMatches,
      americanFootballService.eventMapper.bind(americanFootballService),
    ),
  },
  [SPORT.AUSSIE_RULES]: {
    default: createSofascoreAdapter(
      fetchTournamentLastMatches,
      fetchTournamentNextMatches,
      aussieRulesService.eventMapper.bind(aussieRulesService),
    ),
  },
  [SPORT.BASEBALL]: {
    default: createSofascoreAdapter(
      fetchBaseballLastMatches,
      fetchBaseballNextMatches,
      baseballService.eventMapper.bind(baseballService),
    ),
  },
  [SPORT.BASKETBALL]: {
    default: createSofascoreAdapter(
      fetchBasketballLastMatches,
      fetchBasketballNextMatches,
      basketballService.eventMapper.bind(basketballService),
    ),
  },
  [SPORT.FOOTBALL]: {
    default: createSofascoreAdapter(
      fetchFootballLastMatches,
      fetchFootballNextMatches,
      footballService.eventMapper.bind(footballService),
    ),
  },
  [SPORT.ICE_HOCKEY]: {
    default: createSofascoreAdapter(
      fetchIceHockeyLastMatches,
      fetchIceHockeyNextMatches,
      iceHockeyService.eventMapper.bind(iceHockeyService),
    ),
  },
  [SPORT.RUGBY_LEAGUE]: {
    default: createSofascoreAdapter(
      fetchRugbyLeagueLastMatches,
      fetchRugbyLeagueNextMatches,
      rugbyLeagueService.eventMapper.bind(rugbyLeagueService),
    ),
  },
  [SPORT.TENNIS]: {
    default: createSofascoreAdapter(
      fetchTennisTournamentLastMatches,
      fetchTennisTournamentNextMatches,
      tennisService.eventMapper.bind(tennisService),
    ),
  },

  // --- Motorsport (custom adapters per league) ---
  [SPORT.MOTORSPORT]: {
    f1: {
      async fetchMatches(_leagueId, seasonId) {
        const rawEvents = await fetchF1Events(seasonId)
        if (!rawEvents) {
          console.log("No F1 races found.")
          return []
        }
        return rawEvents.flatMap((race) => mapRaceToMatchSummaries(race))
      },
    },
    supercars: createFileAdapter("supercars"),
    "17": {
      async fetchMatches(_leagueId, seasonId) {
        const rawEvents = await fetchMotorsportSubstages(seasonId)
        if (!rawEvents) {
          console.log("No MotoGP races found.")
          return []
        }

        const allSessions: MatchSummary[] = []
        let i = 1
        for (const { id, name } of rawEvents.stages) {
          if (name.includes("Test")) continue

          const gpSessions = await fetchMotorsportSubstages(id.toString())

          allSessions.push(
            ...(gpSessions?.stages ?? []).flatMap((stage) =>
              motorsportSofascoreService.eventMapper(stage, {
                seasonId,
                roundLabel: `Round ${i}`,
                matchSlug: `/sports/motorsport/${leagueId}/${seasonId}/match/${stage.id}`,
                leagueName: name,
              }),
            ),
          )
          i++
        }

        return allSessions
      },
    },
  },

  // --- Golf (custom adapters per league) ---
  [SPORT.GOLF]: {
    pga: {
      async fetchMatches(_leagueId, seasonId) {
        const rawSchedule = await fetchGolfSchedule("1", seasonId)
        if (!rawSchedule || !rawSchedule.schedule) {
          console.log("No PGA schedule found.")
          return []
        }
        return rawSchedule.schedule.map((t) =>
          mapTournamentToMatchSummary(t, {
            matchSlug: `/sports/golf/pga/${seasonId}/match/${t.tournId}`,
            seasonId,
            leagueId: "pga",
          }),
        )
      },
    },
    liv: {
      async fetchMatches(_leagueId, seasonId) {
        const rawSchedule = await fetchGolfSchedule("2", seasonId)
        if (!rawSchedule || !rawSchedule.schedule) {
          console.log("No LIV schedule found.")
          return []
        }
        return rawSchedule.schedule.map((t) =>
          mapTournamentToMatchSummary(t, {
            matchSlug: `/sports/golf/liv/${seasonId}/match/${t.tournId}`,
            seasonId,
            leagueId: "liv",
          }),
        )
      },
    },
    australasia: createFileAdapter("australasia"),
    tgl: createFileAdapter("tgl"),
  },
}

// Generic Sofascore fallback (no sport-specific endpoints)
const genericSofascoreAdapter = createSofascoreAdapter(
  fetchLastEvents,
  fetchNextEvents,
  (event: Sofascore_Event) => event as unknown as MatchSummary,
)

// ---------------------------------------------------------------------------
// Adapter resolution
// ---------------------------------------------------------------------------

function resolveAdapter(): LeagueAdapter {
  const sportAdapters = adapters[sport]

  // 1. League-specific adapter (custom or override)
  if (sportAdapters?.[leagueId]) {
    return sportAdapters[leagueId]
  }

  // 2. Sport-specific Sofascore adapter (when useSportApi is true)
  if (useSportApi && sportAdapters?.default) {
    return sportAdapters.default
  }

  // 3. Generic Sofascore fallback
  return genericSofascoreAdapter
}

// ---------------------------------------------------------------------------
// Paginated fetch helper (used by Sofascore adapters)
// ---------------------------------------------------------------------------

async function fetchAllPages(
  label: string,
  fn: typeof fetchLastEvents,
  leagueId: string,
  seasonId: string,
) {
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
// Fetch existing match IDs from Dataverse (dedup)
// ---------------------------------------------------------------------------

async function fetchExistingRecords(
  token: string,
  leagueId: string,
  seasonId: string,
  sport: string,
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
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    `\nBulk uploading ${sport} matches — league ${leagueId}, season ${seasonId}`,
  )

  const adapter = resolveAdapter()
  const matches = await adapter.fetchMatches(leagueId, seasonId, allEventsMode)
  console.log(`Fetched ${matches.length} matches.`)

  if (matches.length === 0) {
    console.log("Nothing to upload.")
    return
  }

  const token = await getAccessToken()

  console.log("Checking for existing records in Dataverse...")
  const existingRecords = await fetchExistingRecords(
    token,
    leagueId,
    seasonId,
    sport,
  )
  console.log(`Found ${existingRecords.size} existing matches in Dataverse.`)

  const operations: BatchOperation[] = matches.map((m) => {
    const record = mapToDataverseMatchSummary(m)
    const dvId = existingRecords.get(m.id.toString())
    return dvId ? { method: "PATCH", dvId, record } : { method: "POST", record }
  })

  const createCount = operations.filter((o) => o.method === "POST").length
  const updateCount = operations.filter((o) => o.method === "PATCH").length
  console.log(`${createCount} to create, ${updateCount} to update.`)

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
