import { MOTORSPORT_CATEGORIES } from "@/lib/constants"
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
import { addHours } from "date-fns"
import {
  matchSummariesBySportAndDay,
  matchSummariesByTournament,
} from "./dataverse.service"
import { f1Service } from "./f1.service"

class MotorsportService implements SportService {
  protected sport: SPORT
  protected categories: LeagueSeasonConfig[]
  protected cardVariant?: CardVariant

  constructor() {
    this.sport = SPORT.MOTORSPORT
    this.categories = MOTORSPORT_CATEGORIES
    this.cardVariant = CardVariant.SESSION
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    switch (leagueId) {
      case "f1":
      // return await f1Service.matchesByLeagueSeason(leagueId, seasonId);

      default:
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
          this.categories,
          leagueId,
          seasonId,
        )

        const fixtures = await mapFixtureRounds(
          allMatches,
          leagueConfig,
          this.cardVariant,
        )

        return {
          fixtures,
          currentRound: getCurrentRound(fixtures, leagueConfig?.display),
        } as Matches
    }
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
      .map(this.eventMapper)

    const fixtures = await mapFixtureRounds(
      allMatches,
      this.categories,
      this.cardVariant,
    )

    return {
      fixtures: fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    return null
  }
  async matchDetails(matchId: string): Promise<MatchDetail | null> {
    return null
  }
  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings<readonly string[]> | null> {
    return null
  }

  async brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    return null
  }

  eventMapper(event: MatchSummary): MatchSummary {
    let currentDate = new Date()

    const status =
      event.startDate > currentDate
        ? MatchStatus.UPCOMING
        : event.startDate > addHours(currentDate, -2)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
    return {
      ...event,
      status,
      leagueImg: resolveSportImage(event.leagueName ?? ""),
      timer:
        status === MatchStatus.UPCOMING
          ? event.startDate
          : status.charAt(0) + status.slice(1).toLowerCase(),
    }
  }
}

export { f1Service }

export const motorsportService = new MotorsportService()
