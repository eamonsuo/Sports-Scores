import { SURFING_TOURS } from "@/lib/constants"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { resolveSportImage } from "@/lib/imageMapping"
import { getSportConfigurations } from "@/lib/projUtils"
import {
  Brackets,
  CardVariant,
  DisplayTypes,
  LeagueSeasonConfig,
  MatchDetail,
  Matches,
  MatchStatus,
  MatchSummary,
  SPORT,
  SportService,
  Standings,
} from "@/types/misc"
import {
  matchSummariesBySportAndDay,
  matchSummariesByTournament,
} from "./dataverse.service"

class SurfingService implements SportService {
  protected sport: SPORT
  protected tours: LeagueSeasonConfig[]
  protected cardVariant?: CardVariant

  constructor() {
    this.sport = SPORT.SURFING
    this.tours = SURFING_TOURS
    this.cardVariant = CardVariant.SESSION
  }
  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const dataverseMatches = await matchSummariesByTournament(
      leagueId,
      seasonId,
      this.sport,
    )

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null
    }

    const allMatches = dataverseMatches
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .map(this.eventMapper)

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
      .map((event) => this.eventMapper(event))

    const fixtures = await mapFixtureRounds(allMatches, this.tours)

    return {
      fixtures: fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }
  matchesByTeam(teamId: string): Promise<Matches | null> {
    throw new Error("Method not implemented.")
  }
  matchDetails(matchId: string): Promise<MatchDetail | null> {
    throw new Error("Method not implemented.")
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

  eventMapper(event: MatchSummary): MatchSummary {
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

    const { tvConfig } = getSportConfigurations(
      this.tours,
      event.leagueId,
      event.seasonId,
    )

    return {
      ...event,
      status,
      leagueImg: tournamentImage,
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
                endTime: event?.endDate
                  ? event.endDate
                  : channel.endTime
                    ? channel.endTime(event.startDate)
                    : undefined,
              }))
          : event.tv,
    }
  }
}

export const surfingService = new SurfingService()
