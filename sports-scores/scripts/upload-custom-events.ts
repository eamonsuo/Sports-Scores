/**
 * Uploads events from non-Sofascore sources to the Dataverse ss_matchsummary table.
 * Each sport (or sub-sport) has its own adapter that fetches and maps data to MatchSummary[].
 *
 * Run from the sports-scores directory:
 *   npx tsx scripts/upload-custom-events.ts <sport> <sub-sport> [...args]
 *
 * Examples:
 *   npx tsx scripts/upload-custom-events.ts motorsport f1 2025
 *   npx tsx scripts/upload-custom-events.ts motorsport supercars 2025
 */

import { fetchF1Events } from "@/endpoints/f1.api"
import { fetchGolfSchedule } from "@/endpoints/golf.api"
import { resolveSportImage } from "@/lib/imageMapping"
import { getCountryImageUrl } from "@/lib/projUtils"
import { mapToDataverseMatchSummary } from "@/services/dataverse.service"
import { DataverseMatchSummary } from "@/types/dataverse"
import { F1SessionType, Jolpica_Race } from "@/types/f1"
import { SlashGolf_Tournament } from "@/types/golf"
import { CountryFlagCode, MatchStatus, MatchSummary, SPORT } from "@/types/misc"
import { loadEnvConfig } from "@next/env"
import { addDays } from "date-fns/addDays"
import { addHours } from "date-fns/addHours"

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

const [, , sportArg, subSportArg, ...restArgs] = process.argv
const sport = sportArg as SPORT

if (!sportArg || !subSportArg) {
  console.error(
    "Usage: npx tsx scripts/upload-custom-events.ts <sport> <sub-sport> [...args]",
  )
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Adapter types
// ---------------------------------------------------------------------------

type EventAdapter = (args: string[]) => Promise<MatchSummary[]>
type SubAdapterMap = Record<string, EventAdapter>

// ---------------------------------------------------------------------------
// Motorsport adapters
// ---------------------------------------------------------------------------

function setSessionStatus(sessionDate: Date, sessionType: F1SessionType) {
  let currentDate = new Date()

  if (sessionDate > currentDate) {
    return MatchStatus.UPCOMING
  } else {
    switch (sessionType) {
      case F1SessionType.Practice1:
      case F1SessionType.Practice2:
      case F1SessionType.Practice3:
        return sessionDate > addHours(currentDate, -1)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
      case F1SessionType.Qualifying:
      case F1SessionType.SprintQualifying:
      case F1SessionType.Sprint:
        return sessionDate > addHours(currentDate, -2)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
      case F1SessionType.Race:
        return sessionDate > addHours(currentDate, -3)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
      default:
        return MatchStatus.COMPLETED
    }
  }
}

function mapSessionToMatchSummary(
  session: Jolpica_Race,
  sessionType: F1SessionType,
  startDate: Date,
): MatchSummary {
  const status = setSessionStatus(startDate, sessionType)

  return {
    id: session.season + session.round + sessionType,
    sport: SPORT.MOTORSPORT,
    summaryText: sessionType.replace("-", " "),
    startDate,
    status,
    leagueName: session.raceName,
    leagueImg: resolveSportImage(session.raceName),
    leagueSlug: `f1/${session.season}`,
    matchSlug: `f1/${session.season}/${session.round}/${sessionType}`,
    roundLabel: `Round ${session.round}`,
    timer:
      status === MatchStatus.UPCOMING
        ? startDate
        : status.charAt(0) + status.slice(1).toLowerCase(),
    timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
    competitorDetails: [],
    venue:
      session.Circuit.circuitName + ", " + session.Circuit.Location.locality,
    seasonId: session.season,
    leagueId: "f1",
  }
}

function mapRaceToMatchSummaries(session: Jolpica_Race): MatchSummary[] {
  const sessions: MatchSummary[] = []

  if (session.FirstPractice) {
    const startDate = new Date(
      session.FirstPractice.date + "T" + session.FirstPractice.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Practice1, startDate),
    )
  }
  if (session.SecondPractice) {
    const startDate = new Date(
      session.SecondPractice.date + "T" + session.SecondPractice.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Practice2, startDate),
    )
  }
  if (session.ThirdPractice) {
    const startDate = new Date(
      session.ThirdPractice.date + "T" + session.ThirdPractice.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Practice3, startDate),
    )
  }
  if (session.Qualifying) {
    const startDate = new Date(
      session.Qualifying.date + "T" + session.Qualifying.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Qualifying, startDate),
    )
  }
  if (session.Sprint) {
    const startDate = new Date(session.Sprint.date + "T" + session.Sprint.time)
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Sprint, startDate),
    )
  }
  if (session.SprintQualifying) {
    const startDate = new Date(
      session.SprintQualifying.date + "T" + session.SprintQualifying.time,
    )
    sessions.push(
      mapSessionToMatchSummary(
        session,
        F1SessionType.SprintQualifying,
        startDate,
      ),
    )
  }
  const raceStart = new Date(session.date + "T" + session.time)
  sessions.push(
    mapSessionToMatchSummary(session, F1SessionType.Race, raceStart),
  )

  return sessions
}

async function fetchF1Adapter(args: string[]): Promise<MatchSummary[]> {
  const [season] = args
  if (!season) {
    throw new Error("F1 adapter requires: <season> (e.g., 2025)")
  }

  const rawEvents = await fetchF1Events(season)
  if (!rawEvents) {
    console.log("No F1 races found.")
    return []
  }

  return rawEvents.flatMap((race) => mapRaceToMatchSummaries(race))
}

async function fetchSupercarsAdapter(args: string[]): Promise<MatchSummary[]> {
  const [season] = args
  if (!season) {
    throw new Error("Supercars adapter requires: <season> (e.g., 2026)")
  }

  const fs = await import("fs")
  const path = await import("path")
  const filePath = path.resolve(__dirname, `supercars-${season}-events.json`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Events file not found: ${filePath}`)
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Array<{
    id: string
    sport: string
    summaryText: string
    startDate: string
    endDate?: string
    status: string
    leagueName: string
    leagueSlug: string
    matchSlug: string
    roundLabel: string
    timer: string
    timerDisplayColour: string
    venue: string
    seasonId: string
    leagueId: string
    competitorDetails: { id: string; score: string; name: string }[]
  }>

  return raw.map((item) => ({
    id: item.id,
    sport: item.sport as SPORT,
    summaryText: item.summaryText,
    startDate: new Date(item.startDate),
    endDate: item.endDate ? new Date(item.endDate) : undefined,
    status: item.status as MatchStatus,
    leagueName: item.leagueName,
    leagueSlug: item.leagueSlug,
    matchSlug: item.matchSlug,
    roundLabel: item.roundLabel,
    timer: item.status === "UPCOMING" ? new Date(item.timer) : item.timer,
    timerDisplayColour: item.timerDisplayColour as "green" | "yellow" | "gray",
    venue: item.venue,
    seasonId: item.seasonId,
    leagueId: item.leagueId,
    competitorDetails: item.competitorDetails ?? [],
  }))
}

const motorsportAdapters: SubAdapterMap = {
  f1: fetchF1Adapter,
  supercars: fetchSupercarsAdapter,
}

// ---------------------------------------------------------------------------
// Golf adapters
// ---------------------------------------------------------------------------

/** Tournaments that do NOT award FedExCup points */
const PGA_OTHER_EVENTS = new Set([
  "Presidents Cup",
  "Hero World Challenge",
  "Grant Thornton Invitational",
])

/** FedExCup Fall events (post-TOUR Championship, award points toward next season) */
const PGA_FALL_EVENTS = new Set([
  "Biltmore Championship Asheville",
  "Bank of Utah Championship",
  "Baycurrent Classic",
  "Butterfield Bermuda Championship",
  "VidantaWorld Mexico Open",
  "World Wide Technology Championship",
  "Good Good Championship",
  "The RSM Classic",
])

function getPGARoundLabel(tournamentName: string): string {
  if (PGA_OTHER_EVENTS.has(tournamentName)) {
    return "Other"
  }
  if (PGA_FALL_EVENTS.has(tournamentName)) {
    return "FedexCup Fall"
  }
  return "FedexCup"
}

function mapGolfTournamentToMatchSummary(
  event: SlashGolf_Tournament,
  leagueId: string,
  seasonId: string,
): MatchSummary {
  let startDate = new Date(event.date.start + "Z")
  let endDate = new Date(event.date.end + "Z")
  const currentDate = new Date()

  // Some tournaments need a day offset (matching golf.service.ts logic)
  const noOffsetEvents = [
    "Genesis Scottish Open",
    "The Open Championship",
    "Baycurrent Classic",
    "LIV Golf Riyadh",
    "LIV Golf Adelaide",
    "LIV Golf Singapore",
    "LIV Golf Hong Kong",
    "LIV Golf South Africa",
    "LIV Golf Korea",
    "LIV Golf Andalucia",
    "LIV Golf UK",
  ]
  if (!noOffsetEvents.includes(event.name)) {
    startDate = addDays(startDate, 1)
    endDate = addDays(endDate, 1)
  }

  const tournamentImage = resolveSportImage(event.name)

  const status =
    startDate > currentDate
      ? MatchStatus.UPCOMING
      : endDate > currentDate
        ? MatchStatus.LIVE
        : MatchStatus.COMPLETED

  return {
    id: event.tournId,
    startDate,
    endDate,
    sport: SPORT.GOLF,
    status,
    summaryText: "Details",
    roundLabel: leagueId === "pga" ? getPGARoundLabel(event.name) : "Schedule",
    timer: status.charAt(0) + status.slice(1).toLowerCase(),
    timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
    matchSlug: `/sports/golf/${leagueId}/${seasonId}/match/${event.tournId}`,
    leagueName: event.name,
    leagueImg:
      tournamentImage === "/vercel.svg"
        ? getCountryImageUrl(CountryFlagCode.UnitedStates)
        : tournamentImage,
    competitorDetails: [],
    seasonId,
    leagueId,
  }
}

async function fetchPGAAdapter(args: string[]): Promise<MatchSummary[]> {
  const [season] = args
  if (!season) {
    throw new Error("PGA adapter requires: <season> (e.g., 2026)")
  }

  const rawSchedule = await fetchGolfSchedule("1", season)
  if (!rawSchedule || !rawSchedule.schedule) {
    console.log("No PGA schedule found.")
    return []
  }

  return rawSchedule.schedule.map((t) =>
    mapGolfTournamentToMatchSummary(t, "pga", season),
  )
}

async function fetchLIVAdapter(args: string[]): Promise<MatchSummary[]> {
  const [season] = args
  if (!season) {
    throw new Error("LIV adapter requires: <season> (e.g., 2026)")
  }

  const rawSchedule = await fetchGolfSchedule("2", season)
  if (!rawSchedule || !rawSchedule.schedule) {
    console.log("No LIV schedule found.")
    return []
  }

  return rawSchedule.schedule.map((t) =>
    mapGolfTournamentToMatchSummary(t, "liv", season),
  )
}

const golfAdapters: SubAdapterMap = {
  pga: fetchPGAAdapter,
  liv: fetchLIVAdapter,
}

// ---------------------------------------------------------------------------
// Adapter registry
// ---------------------------------------------------------------------------

const adapterRegistry: Partial<Record<SPORT, SubAdapterMap>> = {
  [SPORT.MOTORSPORT]: motorsportAdapters,
  [SPORT.GOLF]: golfAdapters,
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
// Fetch existing records from Dataverse (for dedup)
// ---------------------------------------------------------------------------

async function fetchExistingRecords(
  token: string,
  leagueId: string,
  seasonId: string,
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
  const sportAdapters = adapterRegistry[sport]
  if (!sportAdapters) {
    console.error(`No adapters registered for sport: ${sportArg}`)
    process.exit(1)
  }

  const adapter = sportAdapters[subSportArg]
  if (!adapter) {
    const available = Object.keys(sportAdapters).join(", ")
    console.error(
      `No adapter for sub-sport "${subSportArg}" under "${sportArg}". Available: ${available}`,
    )
    process.exit(1)
  }

  console.log(`\nFetching ${sportArg}/${subSportArg} events...`)
  const matches = await adapter(restArgs)
  console.log(`Fetched ${matches.length} matches.`)

  if (matches.length === 0) {
    console.log("Nothing to upload.")
    return
  }

  // Determine leagueId/seasonId from first match for dedup query
  const leagueId = matches[0].leagueId ?? subSportArg
  const seasonId = matches[0].seasonId ?? restArgs[0] ?? "unknown"

  const token = await getAccessToken()

  console.log("Checking for existing records in Dataverse...")
  const existingRecords = await fetchExistingRecords(token, leagueId, seasonId)
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
