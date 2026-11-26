import {
  createDataverseMatchSummary,
  fetchDataverseCategories,
  fetchDataverseLadderConfigs,
  fetchDataverseLeagues,
  fetchDataverseMatchSummaries,
  fetchDataversePlayoffPictureConfigs,
  fetchDataverseSeasons,
  fetchDataverseSportEventSchedules,
  fetchDataverseSports,
  fetchDataverseTVConfigs,
  updateDataverseMatchSummary,
} from "@/endpoints/dataverse.api"
import { EVENT_TODAY_EXTENTION_HOURS, FALLBACK_TIMEZONE } from "@/lib/constants"
import {
  DataverseCategory,
  DataverseLadderConfig,
  DataverseLadderGroupConfig,
  DataverseLeague,
  DataverseMatchSummary,
  DataversePlayoffPictureConfig,
  DataverseSeason,
  DataverseSportEvent,
  DataverseTVConfig,
} from "@/types/dataverse"
import { SportEvent } from "@/types/event-calendar"
import {
  CardVariant,
  DeepPartial,
  DisplayTypes,
  FilterCondition,
  LadderConfig,
  LadderGroupConfig,
  LadderGroupFilter,
  LadderPlacingCategory,
  LeagueSeasonConfig,
  MatchStatus,
  MatchSummary,
  Season,
  SPORT,
  SportCategory,
  TeamScoreDetails,
  TVChannel,
  TVConfig,
  TVDetails,
} from "@/types/misc"
import {
  PlayoffPictureConfig,
  PlayoffPictureStructure,
  PlayoffPictureSystem,
} from "@/types/playoff-picture"
import { TZDate } from "@date-fns/tz"
import { addHours, endOfDay, isSameDay, startOfDay } from "date-fns"
import { cacheLife, cacheTag } from "next/cache"

// --- Utilities ---

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

function parseJSONArray<T>(value: string | null): T[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// --- MatchSummary Services ---
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
    competitorDetails: parseJSONArray<TeamScoreDetails>(r.ss_competitordetails),
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
    tv: parseJSONArray<TVDetails>(r.ss_tv),
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

export async function matchSummaries(
  filters?: string,
  select?: string,
  orderBy?: string,
) {
  const response = await fetchDataverseMatchSummaries(filters, select, orderBy)
  if (!response) return null
  return response.value.map(mapToMatchSummary)
}

export async function matchSummariesBySportByLeagueBySeason(
  leagueId: string,
  seasonId: string,
  sport: SPORT,
) {
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
) {
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
) {
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

export async function sportEventSchedules(
  filters?: string[],
  select?: string,
  orderBy?: string,
) {
  const response = await fetchDataverseSportEventSchedules(
    filters?.join(" and "),
    select,
    orderBy,
  )
  if (!response) return null
  return response.value.map(mapToSportEvent)
}

export async function sportEventSchedulesActive() {
  "use cache"
  cacheLife("weeks")
  cacheTag("sport-event-schedules")

  return sportEventSchedules([`statecode eq 0`])
}

// Fetches all sport events from Dataverse and filters to upcoming/current
export async function sportEventSchedulesUpcoming(fromDate: Date = new Date()) {
  const response = await sportEventSchedules()
  if (!response) return null

  return response.filter((event) => {
    const endDate = event.endDate ?? event.startDate
    return endDate >= fromDate
  })
}

// --- Sport Services ---

// --- Category Services ---
function mapToCategory(raw: DataverseCategory): SportCategory {
  return {
    id: raw.ss_slug ?? "",
    name: raw.ss_name ?? "",
    sport: (raw.ss_sport as SPORT) ?? "",
    excludeByDefault: raw.ss_excludefromtoday,
  }
}

export async function categories(
  filters?: string[],
  select?: string,
  orderBy?: string,
) {
  const response = await fetchDataverseCategories(
    filters?.join(" and "),
    select,
    orderBy,
  )
  if (!response) return []
  return response.value.map(mapToCategory)
}

// Fetches categories by their specific sport
export async function categoriesBySportByDate(sport: SPORT) {
  "use cache"
  cacheLife("max")
  cacheTag("categories")

  const dataverseSports = await fetchDataverseSports(
    `ss_slug eq '${sport}'`,
    "ss_sportid",
  )

  return categories([
    `_ss_sportid_value eq ${dataverseSports?.value?.[0]?.ss_sportid}`,
    `ss_excludefromtoday eq false`,
  ])
}

// --- League Services ---
function mapToLeague(raw: DataverseLeague): LeagueSeasonConfig {
  return {
    name: raw.ss_name ?? "",
    slug: raw.ss_slug ?? "",
    seasons: raw.ss_season_leagueid_ss_league?.map(mapToSeason) ?? [],
    display: (raw.ss_display as DisplayTypes) ?? DisplayTypes.ROUND,
    excludeFromToday: raw.ss_excludefromtoday,
    hidden: raw.ss_hidden,
    externalURL: raw.ss_externalurl ?? undefined,
    icon: raw.ss_icon ?? undefined,
    dataverseGUID: raw.ss_leagueid ?? "",
  }
}

export async function leagues(
  filters?: string[],
  select?: string,
  orderBy?: string,
  expand?: string,
) {
  const response = await fetchDataverseLeagues(
    filters?.join(" and "),
    select,
    orderBy,
    expand,
  )
  if (!response) return []
  return response.value.map(mapToLeague)
}

export async function leaguesBySport(sport: SPORT) {
  "use cache"
  cacheLife("weeks")
  cacheTag("leagues")

  return leagues([`ss_sport eq '${sport}'`])
}

export async function leaguesBySportByDate(sport: SPORT) {
  "use cache"
  cacheLife("weeks")
  cacheTag("leagues")

  return leagues([`ss_sport eq '${sport}'`, `ss_excludefromtoday eq false`])
}

export async function leaguesBySportByLeague(sport: SPORT, leagueSlug: string) {
  "use cache"
  cacheLife("weeks")
  cacheTag("leagues")

  return leagues([`ss_sport eq '${sport}'`, `ss_slug eq '${leagueSlug}'`])
}

export async function leaguesBySportToShow(sport: SPORT) {
  "use cache"
  cacheLife("weeks")
  cacheTag("leagues")

  return leagues([`ss_sport eq '${sport}'`, `ss_hidden eq false`])
}

// --- Season Services ---
function mapToSeason(raw: DataverseSeason): Season {
  return {
    name: raw.ss_name ?? "",
    slug: raw.ss_slug ?? "",
    externalURL: raw.ss_externalurl ?? undefined,
    byes: parseJSONArray<{ name: string; img: string }>(raw.ss_byes),
    ladderConfig: {
      dataverseGUID: raw._ss_ladderconfigid_value ?? "",
      headings: [],
      ladderGroup: [],
    },
    playoffPictureConfig: {
      dataverseGUID: raw._ss_playoffpictureconfigid_value ?? "",
      qualifyingPositions: 0,
      structure: PlayoffPictureStructure.Top8,
      rankingSystem: PlayoffPictureSystem.POINTS,
      totalSeasonGames: 0,
    },
    dataverseGUID: raw.ss_seasonid ?? "",
  }
}

export async function seasons(
  filters?: string[],
  select?: string,
  orderBy?: string,
) {
  const response = await fetchDataverseSeasons(
    filters?.join(" and "),
    select,
    orderBy,
  )
  if (!response) return null
  return response.value.map(mapToSeason)
}

export async function seasonsByLeague(leagueId: string) {
  return seasons([`_ss_leagueid_value eq ${leagueId}`])
}

export async function seasonsBySlugs(leagueId: string, seasonId: string) {
  "use cache"
  cacheLife("max")
  cacheTag("seasons")

  return seasons([
    `ss_leagueid/ss_slug eq '${leagueId}'`,
    `ss_slug eq '${seasonId}'`,
  ])
}

// --- Ladder Config Services ---
function mapToLadderConfig(raw: DataverseLadderConfig): LadderConfig {
  return {
    ladderGroup:
      raw.ss_laddergroupconfig_ladderconfigid_ss_ladderconfig?.map(
        mapToLadderGroupConfig,
      ) ?? [],
    headings: raw.ss_headings
      ? parseJSONArray<string>(raw.ss_headings)
      : undefined,
    dataverseGUID: raw.ss_ladderconfigid ?? "",
  }
}

export async function ladderConfigs(
  filters?: string[],
  select?: string,
  orderBy?: string,
) {
  const response = await fetchDataverseLadderConfigs(
    filters?.join(" and "),
    select,
    orderBy,
  )
  if (!response) return null
  return response.value.map(mapToLadderConfig)
}

export async function ladderConfigByLeagueBySeason(
  leagueId: string,
  seasonId: string,
) {
  "use cache"
  cacheLife("max")
  cacheTag("ladderConfigs")

  const response = await seasonsBySlugs(leagueId, seasonId)
  if (!response?.[0]?.ladderConfig?.dataverseGUID) return undefined

  const ladderConfig = await ladderConfigs([
    `ss_ladderconfigid eq ${response?.[0]?.ladderConfig?.dataverseGUID}`,
  ])

  return ladderConfig?.[0]
}

// --- Ladder Group Config Services ---
function mapToLadderGroupConfig(
  raw: DataverseLadderGroupConfig,
): LadderGroupConfig {
  return {
    label: raw.ss_label ?? "",
    headings: raw.ss_headings
      ? parseJSONArray<string>(raw.ss_headings)
      : undefined,
    placingCategories: parseJSONArray<LadderPlacingCategory>(
      raw.ss_placingcategories,
    ),
    filterCondition: (raw.ss_filtercondition as FilterCondition) ?? undefined,
    filters: parseJSONArray<LadderGroupFilter>(raw.ss_filters),
    dataverseGUID: raw.ss_laddergroupconfigid ?? "",
  }
}

// --- Playoff Picture Config Services ---
function mapToPlayoffPictureConfig(
  raw: DataversePlayoffPictureConfig,
): PlayoffPictureConfig {
  return {
    dataverseGUID: raw.ss_playoffpictureconfigid ?? "",
    rankingSystem: (raw.ss_rankingsystem as PlayoffPictureSystem) ?? undefined,
    totalSeasonGames: raw.ss_totalseasongames ?? 0,
    qualifyingPositions: raw.ss_qualifyingpositions ?? 0,
    pointsPerDraw: raw.ss_pointsperdraw ?? undefined,
    pointsPerWin: raw.ss_pointsperwin ?? undefined,
    structure: (raw.ss_structure as PlayoffPictureStructure) ?? undefined,
  }
}

export async function playoffPictureConfigs(
  filters?: string[],
  select?: string,
  orderBy?: string,
) {
  const response = await fetchDataversePlayoffPictureConfigs(
    filters?.join(" and "),
    select,
    orderBy,
  )
  if (!response) return null
  return response.value.map(mapToPlayoffPictureConfig)
}

export async function playoffPictureConfigByLeagueBySeason(
  leagueId: string,
  seasonId: string,
) {
  "use cache"
  cacheLife("max")
  cacheTag("playoffPictureConfigs")

  const response = await seasonsBySlugs(leagueId, seasonId)

  if (!response?.[0]?.playoffPictureConfig?.dataverseGUID) return undefined

  const playoffPictureConfig = await playoffPictureConfigs([
    `ss_playoffpictureconfigid eq ${response?.[0]?.playoffPictureConfig?.dataverseGUID}`,
  ])

  return playoffPictureConfig?.[0]
}

// --- TV Config Services ---
function mapToTVConfig(raw: DataverseTVConfig): TVConfig {
  return {
    dataverseGUID: raw.ss_tvconfigid ?? "",
    channels: parseJSONArray<TVChannel>(raw.ss_channels),
    matchLength: raw.ss_matchlength ?? 0,
  }
}

export async function tvConfigs(
  filters?: string[],
  select?: string,
  orderBy?: string,
) {
  const response = await fetchDataverseTVConfigs(
    filters?.join(" and "),
    select,
    orderBy,
  )
  if (!response) return null
  return response.value.map(mapToTVConfig)
}

export async function tvConfigByLeagueBySeason(
  leagueId: string,
  seasonId: string,
) {
  "use cache"
  cacheLife("max")
  cacheTag("tvConfigs")

  const response = await seasonsBySlugs(leagueId, seasonId)

  if (!response?.[0]?.tvGuide?.dataverseGUID) return undefined

  const tvConfig = await tvConfigs([
    `ss_tvconfigid eq ${response?.[0]?.tvGuide?.dataverseGUID}`,
  ])

  return tvConfig?.[0]
}
