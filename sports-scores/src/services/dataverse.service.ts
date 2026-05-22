import {
  createDataverseMatchSummary,
  fetchDataverseMatchSummaries,
  updateDataverseMatchSummary,
} from "@/endpoints/dataverse.api"
import { DataverseMatchSummary } from "@/types/dataverse"
import {
  CardVariant,
  DeepPartial,
  MatchStatus,
  MatchSummary,
  SPORT,
  TeamScoreDetails,
} from "@/types/misc"
import { TZDate } from "@date-fns/tz"
import { endOfDay, startOfDay } from "date-fns"

// --- MatchSummary Utilities ---

const STATUS_MAP: Record<0 | 1 | 2, MatchStatus> = {
  0: MatchStatus.LIVE,
  1: MatchStatus.UPCOMING,
  2: MatchStatus.COMPLETED,
}

const COLOUR_MAP: Record<0 | 1 | 2, "green" | "yellow" | "gray"> = {
  0: "green",
  1: "yellow",
  2: "gray",
}

const STATUS_REVERSE: Record<MatchStatus, 0 | 1 | 2> = {
  [MatchStatus.LIVE]: 0,
  [MatchStatus.UPCOMING]: 1,
  [MatchStatus.COMPLETED]: 2,
}

const COLOUR_REVERSE: Record<"green" | "yellow" | "gray", 0 | 1 | 2> = {
  green: 0,
  yellow: 1,
  gray: 2,
}

function stringifyField(value: string | string[] | undefined): string | null {
  if (value === undefined || value === null) return null
  return Array.isArray(value) ? JSON.stringify(value) : value
}

function parseJsonField(value: string | null): string | string[] {
  if (!value) return ""
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : String(parsed)
  } catch {
    return value
  }
}

function parseCompetitorDetails(value: string | null): TeamScoreDetails[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function mapToMatchSummary(r: DataverseMatchSummary): MatchSummary {
  return {
    id: r.ss_matchid ?? "",
    startDate: new Date(r.ss_startdate ?? ""),
    endDate: r.ss_enddate ? new Date(r.ss_enddate) : undefined,
    sport: r.ss_sport ?? "",
    venue: r.ss_venue ?? undefined,
    status:
      r.ss_status != null ? STATUS_MAP[r.ss_status] : MatchStatus.UPCOMING,
    summaryText: r.ss_summarytext,
    otherDetail: r.ss_otherdetail ?? undefined,
    competitorDetails: parseCompetitorDetails(r.ss_competitordetails),
    roundLabel: r.ss_roundlabel ?? undefined,
    timer:
      r.ss_status === 1
        ? new Date(r.ss_timer ?? "")
        : (r.ss_timer ?? undefined),
    timerDisplayColour:
      r.ss_timerdisplaycolour != null
        ? COLOUR_MAP[r.ss_timerdisplaycolour]
        : undefined,
    leagueName: r.ss_leaguename ?? undefined,
    leagueImg: r.ss_leagueimg ?? undefined,
    leagueSlug: r.ss_leagueslug ?? undefined,
    matchSlug: r.ss_matchslug ?? undefined,
    winner: r.ss_winner ?? undefined,
    leagueId: r.ss_leagueid ?? undefined,
    seasonId: r.ss_seasonid ?? undefined,
    dataverseGUID: r.ss_matchsummaryid,
    cardVariant: (r.ss_cardvariant as CardVariant) ?? CardVariant.DEFAULT,
  }
}

export function mapToDataverseMatchSummary(
  m: MatchSummary,
): Omit<DataverseMatchSummary, "ss_matchsummaryid"> {
  return {
    ss_summarytext: m.summaryText,
    ss_matchid: m.id.toString(),
    ss_startdate: m.startDate.toISOString(),
    ss_enddate: m.endDate?.toISOString() ?? null,
    ss_sport: m.sport,
    ss_venue: m.venue ?? null,
    ss_status: STATUS_REVERSE[m.status],
    ss_otherdetail: m.otherDetail ?? null,
    ss_competitordetails:
      m.competitorDetails.length > 0
        ? JSON.stringify(m.competitorDetails)
        : null,
    ss_roundlabel: m.roundLabel ?? null,
    ss_timer:
      m.timer instanceof Date ? m.timer.toISOString() : (m.timer ?? null),
    ss_timerdisplaycolour:
      m.timerDisplayColour != null
        ? COLOUR_REVERSE[m.timerDisplayColour]
        : null,
    ss_leaguename: m.leagueName ?? null,
    ss_leagueimg: m.leagueImg ?? null,
    ss_leagueslug: m.leagueSlug ?? null,
    ss_matchslug: m.matchSlug ?? null,
    ss_winner: m.winner ?? null,
    ss_leagueid: m.leagueId ?? null,
    ss_seasonid: m.seasonId ?? null,
    ss_cardvariant: m.cardVariant ?? null,
  }
}

// --- MatchSummary Services ---

export async function matchSummariesAll(): Promise<MatchSummary[] | null> {
  const response = await fetchDataverseMatchSummaries()
  if (!response) return null
  return response.value.map(mapToMatchSummary)
}

export async function matchSummariesByTournament(
  leagueId: string,
  seasonId: string,
  sport: SPORT,
): Promise<MatchSummary[] | null> {
  const filters = [
    `ss_leagueid eq '${leagueId}'`,
    `ss_seasonid eq '${seasonId}'`,
    `ss_sport eq '${sport}'`,
  ]
  const response = await fetchDataverseMatchSummaries(filters.join(" and "))
  if (!response) return null
  return response.value.map(mapToMatchSummary)
}

export async function matchSummariesBySportAndDay(
  sport: SPORT,
  date: Date | TZDate,
): Promise<MatchSummary[] | null> {
  const dayStart = new Date(startOfDay(date).getTime()).toISOString()
  const dayEnd = new Date(endOfDay(date).getTime()).toISOString()

  const filters = [
    `ss_sport eq '${sport}'`,
    `((ss_startdate le '${dayEnd}' and ss_enddate ge '${dayStart}') or (ss_enddate eq null and ss_startdate ge '${dayStart}' and ss_startdate le '${dayEnd}'))`,
  ]
  const response = await fetchDataverseMatchSummaries(filters.join(" and "))
  if (!response) return null
  return response.value.map(mapToMatchSummary)
}

export async function matchSummaryCreate(record: MatchSummary) {
  return createDataverseMatchSummary(mapToDataverseMatchSummary(record))
}

export async function matchSummaryUpdate(
  id: string,
  record: DeepPartial<MatchSummary>,
) {
  const mapped = mapToDataverseMatchSummary(record as MatchSummary)
  const partial = Object.fromEntries(
    Object.entries(mapped).filter(([, v]) => v !== null),
  ) as Partial<Omit<DataverseMatchSummary, "ss_matchsummaryid">>
  return updateDataverseMatchSummary(id, partial)
}
