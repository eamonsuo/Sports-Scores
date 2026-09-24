import {
  createDataverseMatchSummary,
  fetchDataverseMatchSummaries,
  fetchDataverseSportEventSchedules,
  updateDataverseMatchSummary,
} from "@/endpoints/dataverse.api"
import { EVENT_TODAY_EXTENTION_HOURS, FALLBACK_TIMEZONE } from "@/lib/constants"
import { DataverseMatchSummary, DataverseSportEvent } from "@/types/dataverse"
import { SportEvent } from "@/types/event-calendar"
import {
  CardVariant,
  DeepPartial,
  MatchStatus,
  MatchSummary,
  SPORT,
  TeamScoreDetails,
  TVChannel,
  TVDetails,
} from "@/types/misc"
import { TZDate } from "@date-fns/tz"
import { addHours, endOfDay, isSameDay, startOfDay } from "date-fns"

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

function parseCompetitorDetails(value: string | null): TeamScoreDetails[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseTVDetails(value: string | null): TVDetails[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function mapToMatchSummary(r: DataverseMatchSummary): MatchSummary {
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
    tv: parseTVDetails(r.ss_tv),
  }
}

// --- Sport Event Schedule Utilities ---

function mapToSportEvent(raw: DataverseSportEvent): SportEvent {
  let tags: string[] | undefined
  if (raw.ss_tags) {
    try {
      tags = JSON.parse(raw.ss_tags)
    } catch {
      tags = undefined
    }
  }

  let tv: TVChannel[] | undefined
  if (raw.ss_tv) {
    try {
      tv = JSON.parse(raw.ss_tv)
    } catch {
      tv = undefined
    }
  }

  return {
    id: raw.ss_sporteventscheduleid,
    name: raw.ss_name ?? "",
    sport: raw.ss_sport ?? "",
    type: raw.ss_event_type === 100000001 ? "regular-season" : "major",
    startDate: new Date(raw.ss_start_date!),
    endDate: raw.ss_end_date ? new Date(raw.ss_end_date) : undefined,
    dateDisplay: raw.ss_date_display ?? undefined,
    imageUrl: raw.ss_image_url ?? undefined,
    link: raw.ss_link ?? undefined,
    location: raw.ss_location ?? undefined,
    tags,
    tv,
    notes: raw.ss_notes ?? undefined,
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
    ss_tv: m.tv && m.tv.length > 0 ? JSON.stringify(m.tv) : null,
  }
}

// --- MatchSummary Services ---

export async function matchSummaries(
  filters?: string,
  select?: string,
  orderBy?: string,
): Promise<MatchSummary[] | null> {
  const response = await fetchDataverseMatchSummaries(filters, select, orderBy)
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
  return matchSummaries(filters.join(" and "))
}

export async function matchSummariesBySportAndDay(
  sport: SPORT,
  date: Date | TZDate,
): Promise<MatchSummary[] | null> {
  const dayStart = addHours(
    new Date(startOfDay(date).getTime()),
    -EVENT_TODAY_EXTENTION_HOURS,
  ).toISOString()
  const dayEnd = addHours(
    new Date(endOfDay(date).getTime()),
    EVENT_TODAY_EXTENTION_HOURS,
  ).toISOString()

  const filters = [
    `ss_sport eq '${sport}'`,
    `statecode eq 0`, // Only active records
    `((ss_startdate le '${dayEnd}' and ss_enddate ge '${dayStart}') or (ss_enddate eq null and ss_startdate ge '${dayStart}' and ss_startdate le '${dayEnd}'))`,
  ]
  return matchSummaries(filters.join(" and "))
}

export async function matchSummariesBySportUpcoming(
  sport: SPORT,
  fromDate: Date = new Date(),
): Promise<MatchSummary[] | null> {
  const dayStart = new Date(fromDate).toISOString()
  const timezone =
    fromDate instanceof TZDate ? fromDate.timeZone : FALLBACK_TIMEZONE

  const filters = [
    `ss_sport eq '${sport}'`,
    `statecode eq 0`, // Only active records
    `ss_startdate ge '${dayStart}'`,
  ]

  const matches = await matchSummaries(filters.join(" and "))
  const nextDate =
    matches && matches.length > 0
      ? new TZDate(matches[0].startDate, timezone)
      : null
  return nextDate
    ? (matches?.filter((match) =>
        isSameDay(new TZDate(match.startDate, timezone), nextDate),
      ) ?? null)
    : null
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

// --- Sport Event Schedule Services ---

export async function sportEventSchedules(
  filters?: string[],
  select?: string,
  orderBy?: string,
): Promise<SportEvent[] | null> {
  const response = await fetchDataverseSportEventSchedules(
    filters?.join(" and "),
    select,
    orderBy,
  )
  if (!response) return null
  return response.value.map(mapToSportEvent)
}

export async function sportEventSchedulesActive(): Promise<
  SportEvent[] | null
> {
  return sportEventSchedules([`statecode eq 0`])
}

// Fetches all sport events from Dataverse and filters to upcoming/current
export async function sportEventSchedulesUpcoming(
  fromDate: Date = new Date(),
): Promise<SportEvent[] | null> {
  const response = await sportEventSchedules()
  if (!response) return null

  return response.filter((event) => {
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(event.startDate)
    return endDate >= fromDate
  })
}
