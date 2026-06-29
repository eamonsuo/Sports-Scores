import {
  fetchGolfLeaderboard,
  fetchGolfRankings,
  fetchGolfSchedule,
} from "@/endpoints/golf.api"
import {
  FALLBACK_IMAGE,
  GOLF_FEDEX_HEADINGS,
  GOLF_LEADERBOARD_HEADINGS,
  GOLF_TOURS,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { resolveSportImage } from "@/lib/imageMapping"
import { getCountryImageUrl, getSportConfigurations } from "@/lib/projUtils"
import {
  Golf_SlashGolfAPI_Leaderboard,
  SlashGolf_PlayerRanking,
  SlashGolf_Tournament,
} from "@/types/golf"
import {
  Brackets,
  CardVariant,
  CountryFlagCode,
  DeepPartial,
  DisplayTypes,
  LadderGroup,
  LeagueSeasonConfig,
  MatchDetail,
  Matches,
  MatchStatus,
  MatchSummary,
  SPORT,
  SportService,
  Standings,
} from "@/types/misc"
import { addDays, addHours } from "date-fns"
import {
  matchSummariesBySportAndDay,
  matchSummariesByTournament,
} from "./dataverse.service"

class GolfService implements SportService {
  protected sport: SPORT
  protected tours: LeagueSeasonConfig[]
  protected cardVariant?: CardVariant

  constructor() {
    this.sport = SPORT.GOLF
    this.tours = GOLF_TOURS
    this.cardVariant = CardVariant.SESSION
  }
  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    //TODO: Make generic for all tours
    // const rawSchedule = await cachedFetchSchedule(
    //   leagueId === "pga" ? "1" : "2",
    //   seasonId,
    // );

    const dataverseMatches = await matchSummariesByTournament(
      leagueId,
      seasonId,
      this.sport,
    )

    // if (!rawSchedule) {
    //   return null;
    // }

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null
    }

    // const allMatches = rawSchedule.schedule.map((item) =>
    //   mapTournamentToMatchSummary(item, {
    //     matchSlug: `/sports/${this.sport}/${leagueId}/${seasonId}/match/${item.tournId}`,
    //     roundLabel: leagueId === "pga" ? "FedexCup" : "Schedule",
    //   }),
    // );

    const allMatches = dataverseMatches
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .map((event) => this.eventMapper(event))

    const { leagueConfig } = getSportConfigurations(
      this.tours,
      leagueId,
      seasonId,
    )

    const fixtures = await mapFixtureRounds(allMatches, leagueConfig)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const [dataverseMatches] = await Promise.all([
      matchSummariesBySportAndDay(this.sport, date),
    ])

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null
    }

    const allMatches = (dataverseMatches ?? [])
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .map((event) =>
        this.eventMapper(event, {
          leagueImg: this.tours.find((l) => l.slug === event.leagueId)?.icon,
        }),
      )

    const fixtures = await mapFixtureRounds(allMatches, this.tours)

    return {
      fixtures: fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }

  matchesByTeam(teamId: string): Promise<Matches | null> {
    throw new Error("Method not implemented.")
  }

  async matchDetails(
    matchId: string,
    leagueId: string,
    seasonId: string,
  ): Promise<MatchDetail | null> {
    const orgId = leagueId === "pga" ? "1" : "2"

    var rawLeaderboard = await cachedFetchLeaderboard(orgId, matchId, seasonId)
    if (!rawLeaderboard || !rawLeaderboard.leaderboardRows) return null
    return { standings: this.leaderboardMapper(rawLeaderboard) }
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    const rawRanking = await cachedFetchRankings(
      leagueId === "pga" ? "02671" : "186",
      seasonId,
    )

    if (!rawRanking) {
      return null
    }

    const { ladderConfig } = getSportConfigurations(
      GOLF_TOURS,
      leagueId,
      seasonId,
    )

    return {
      standings: [
        {
          tables: [
            {
              headings:
                ladderConfig?.ladderGroup[0]?.headings ?? GOLF_FEDEX_HEADINGS,
              data: (rawRanking.rankings as SlashGolf_PlayerRanking[]).map(
                (item) => {
                  let playerName = item.firstName + " " + item.lastName
                  return {
                    position: item.rank,
                    teamId: item.playerId,
                    teamName: playerName,
                    teamLogo: resolveSportImage(playerName),
                    Total: item.totalPoints?.toString() ?? "",
                    Behind: item.pointsBehind?.toString() ?? "",
                    Prev: item.previousRank?.toString() ?? "",
                  }
                },
              ),
              placingCategories:
                ladderConfig?.ladderGroup[0]?.placingCategories,
            },
          ],
        },
      ],
    }
  }

  brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    throw new Error("Method not implemented.")
  }

  eventMapper(
    event: MatchSummary,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    let currentDate = new Date()

    const status =
      event.startDate > currentDate
        ? MatchStatus.UPCOMING
        : event.endDate && event?.endDate > currentDate
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED

    const tournamentImage =
      options?.leagueImg ??
      event.leagueImg ??
      resolveSportImage(event.leagueName)

    const { tvConfig } = getSportConfigurations(
      GOLF_TOURS,
      event.leagueId,
      event.seasonId,
    )

    // Strip out competitorDetails and tv from options to avoid type errors
    const { competitorDetails, tv, ...otherOptions } = options || {}

    return {
      ...event,
      ...otherOptions,
      status,
      leagueImg:
        tournamentImage === FALLBACK_IMAGE
          ? getCountryImageUrl(CountryFlagCode.UnitedStates)
          : tournamentImage,
      timer: status.charAt(0) + status.slice(1).toLowerCase(),
      timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
      cardVariant: event.cardVariant ?? CardVariant.SESSION,
      tv:
        event.tv?.length === 0
          ? tvConfig?.channels
              .filter((channel) =>
                channel.tvFilter
                  ? channel.tvFilter(event.startDate, event)
                  : true,
              )
              .map((channel) => ({
                channel: channel.channel,
                startTime: channel.startTime
                  ? channel.startTime(event.startDate)
                  : event.startDate,
                endTime: event.endDate
                  ? event.endDate
                  : channel.endTime
                    ? channel.endTime(event.startDate)
                    : undefined,
              }))
          : event.tv,
    }
  }

  leaderboardMapper(data: Golf_SlashGolfAPI_Leaderboard): LadderGroup[] {
    // Construct Player rankings
    const playerTable: LadderGroup = {
      label: "Players",
      tables: [
        {
          headings: GOLF_LEADERBOARD_HEADINGS,
          data: data.leaderboardRows.map((item) => {
            const playerName =
              item.players === undefined
                ? `${item.firstName} ${item.lastName}${item.isAmateur ? " (A)" : ""}`
                : item.players
                    .map(
                      (item) =>
                        `${item.firstName} ${item.lastName}${item.isAmateur ? " (A)" : ""}`,
                    )
                    .join(", ")
            return {
              position: item.position,
              teamId: item.playerId + playerName,
              teamName: playerName,
              teamLogo: resolveSportImage(playerName),
              Total: item.total,
              Thru: item.thru,
              Rnd:
                Number(item.currentRoundScore) > 0 &&
                item.currentRoundScore[0] !== "+"
                  ? "+" + item.currentRoundScore
                  : item.currentRoundScore,
            }
          }),
        },
      ],
    }

    // Construct Team rankings if applicable
    if (data.teams) {
      const teamTable: LadderGroup = {
        label: "Teams",
        tables: [
          {
            headings: GOLF_LEADERBOARD_HEADINGS,
            data: data.teams.map((item, idx) => {
              return {
                position: (idx + 1).toString(),
                teamId: item.teamId + item.name,
                teamName: item.name,
                teamLogo: resolveSportImage(item.name),
                Total: item.totalScore,
              }
            }),
          },
        ],
      }
      return [playerTable, teamTable]
    }
    return [playerTable]
  }
}

export const golfService = new GolfService()

const cachedFetchSchedule = withDevCache("golf", "schedule", fetchGolfSchedule)
const cachedFetchRankings = withDevCache("golf", "rankings", fetchGolfRankings)
const cachedFetchLeaderboard = withDevCache(
  "golf",
  "leaderboard",
  fetchGolfLeaderboard,
)

// Hidden in leagueseasonmatches for now
export function mapTournamentToMatchSummary(
  event: SlashGolf_Tournament,
  options?: DeepPartial<MatchSummary>,
): MatchSummary {
  let startDate = new Date(event.date.start + "Z")
  let endDate = new Date(event.date.end + "Z")
  const currentDate = new Date()

  switch (event.name) {
    case "Genesis Scottish Open":
    case "The Open Championship":
    case "Baycurrent Classic":
    case "LIV Golf Riyadh":
    case "LIV Golf Adelaide":
    case "LIV Golf Singapore":
    case "LIV Golf Hong Kong":
    case "LIV Golf South Africa":
    case "LIV Golf Korea":
    case "LIV Golf Andalucia":
    case "LIV Golf UK":
      break
    default:
      startDate = addHours(addDays(startDate, 1), -10)
      endDate = addDays(endDate, 1)
  }

  const tournamentImage = resolveSportImage(event.name)

  const status =
    startDate > currentDate
      ? MatchStatus.UPCOMING
      : endDate > currentDate
        ? MatchStatus.LIVE
        : MatchStatus.COMPLETED

  const { tvConfig } = getSportConfigurations(
    GOLF_TOURS,
    options?.leagueId,
    options?.seasonId,
  )

  // Strip out competitorDetails and tv from options to avoid type errors
  const { competitorDetails, tv, ...otherOptions } = options || {}

  return {
    id: event.tournId,
    startDate: startDate,
    endDate: endDate,
    sport: SPORT.GOLF,
    status: status,
    roundLabel: getRoundLabel(event.name, options?.leagueId),
    summaryText: "Details",
    timer: status.charAt(0) + status.slice(1).toLowerCase(),
    timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
    // otherDetail: options?.otherDetail,
    // venue: options?.venue,
    // matchSlug: options?.matchSlug,
    // seasonId: options?.seasonId,
    // leagueId: options?.leagueId,
    leagueName: event.name,
    // leagueSlug: options?.leagueSlug,
    leagueImg:
      tournamentImage === "/vercel.svg"
        ? getCountryImageUrl(CountryFlagCode.UnitedStates)
        : tournamentImage,
    competitorDetails: [],
    // winner: options?.winner,
    cardVariant: CardVariant.SESSION,
    tv:
      status !== MatchStatus.COMPLETED
        ? tvConfig?.channels
            .filter((channel) =>
              channel.tvFilter
                ? channel.tvFilter(options?.startDate ?? startDate, event)
                : true,
            )
            .map((channel) => ({
              channel: channel.channel,
              startTime: channel.startTime
                ? channel.startTime(options?.startDate ?? startDate)
                : (options?.startDate ?? startDate),
              endTime:
                options?.endDate ??
                (event?.date.end
                  ? endDate
                  : channel.endTime
                    ? channel.endTime(options?.startDate ?? startDate)
                    : undefined),
            }))
        : undefined,
    ...otherOptions,
  }
}

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

function getRoundLabel(tournamentName: string, leagueId?: string): string {
  if (PGA_OTHER_EVENTS.has(tournamentName)) {
    return "Other"
  }
  if (PGA_FALL_EVENTS.has(tournamentName)) {
    return "FedExCup Fall"
  }
  return leagueId === "pga" ? `FedExCup` : "Schedule"
}
