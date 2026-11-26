import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { resolveSportImage } from "@/lib/imageMapping"
import { getSportConfigurations } from "@/lib/projUtils"
import {
  Brackets,
  CardVariant,
  DeepPartial,
  DisplayTypes,
  FixtureRound,
  MatchDetail,
  Matches,
  MatchStatus,
  MatchSummary,
  RoundLabel,
  SPORT,
  SportService,
  Standings,
  TVConfig,
  UpcomingMatches,
} from "@/types/misc"
import { TZDate } from "@date-fns/tz/date"
import { addHours } from "date-fns"
import {
  leaguesBySportByDate,
  leaguesBySportByLeague,
  matchSummariesBySportAndDay,
  matchSummariesBySportByLeagueBySeason,
  matchSummariesBySportUpcoming,
} from "./dataverse.service"

class SurfingService implements SportService {
  protected sport: SPORT
  protected cardVariant?: CardVariant

  constructor() {
    this.sport = SPORT.SURFING
    this.cardVariant = CardVariant.SESSION
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const [dataverseMatches, tours] = await Promise.all([
      matchSummariesBySportByLeagueBySeason(leagueId, seasonId, this.sport),
      leaguesBySportByLeague(this.sport, leagueId),
    ])

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null
    }

    const allMatches = dataverseMatches
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .map((event) => this.eventMapper(event))

    const { leagueConfig } = getSportConfigurations(tours, leagueId, seasonId)

    const fixtures = await mapFixtureRounds(allMatches, leagueConfig)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const [dataverseMatches, tours] = await Promise.all([
      matchSummariesBySportAndDay(this.sport, date),
      leaguesBySportByDate(this.sport),
    ])

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null
    }

    const allMatches = dataverseMatches.map((event) => this.eventMapper(event))

    const fixtures = await mapFixtureRounds(allMatches, tours)

    const live: FixtureRound = {
      matches: allMatches.filter((match) => match.status === MatchStatus.LIVE),
      roundLabel: RoundLabel.LIVE,
    }

    return {
      fixtures: [live, ...fixtures],
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }

  matchesByTeam(teamId: string): Promise<Matches | null> {
    throw new Error("Method not implemented.")
  }

  matchDetails(matchId: string): Promise<MatchDetail | null> {
    throw new Error("Method not implemented.")
  }

  async matchesUpcoming(fromDate: TZDate): Promise<UpcomingMatches | null> {
    const [dataverseMatches, tours] = await Promise.all([
      matchSummariesBySportUpcoming(this.sport, fromDate),
      leaguesBySportByDate(this.sport),
    ])

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null
    }

    const fixtures = await mapFixtureRounds(
      dataverseMatches.map((event) => this.eventMapper(event)),
      tours,
    )

    return {
      fixtures: fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
      nextEventDate: fixtures[0]?.matches?.[0]?.startDate,
    }
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    return null
  }

  brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    throw new Error("Method not implemented.")
  }

  eventMapper(
    event: MatchSummary,
    options?: DeepPartial<MatchSummary>,
    tvConfig?: TVConfig,
  ): MatchSummary {
    let currentDate = new Date()

    const status =
      event.startDate > currentDate
        ? MatchStatus.UPCOMING
        : event.endDate && event?.endDate > currentDate
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED

    const tournamentImage = resolveSportImage(
      event.venue?.split(",").at(-1)?.trimStart(),
    )

    // Strip out competitorDetails and tv from options to avoid type errors
    const { competitorDetails, tv, ...otherOptions } = options || {}

    return {
      ...event,
      status,
      leagueImg: tournamentImage,
      timer: status.charAt(0) + status.slice(1).toLowerCase(),
      timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
      cardVariant: event.cardVariant ?? CardVariant.SESSION,
      tv:
        event.tv?.length === 0
          ? tvConfig?.channels.map((channel) => ({
              channel: channel,
              startTime: options?.startDate ?? event.startDate,
              endTime:
                options?.endDate ??
                event?.endDate ??
                addHours(event.startDate, tvConfig.matchLength),
            }))
          : event.tv,
      ...otherOptions,
    }
  }
}

export const surfingService = new SurfingService()
