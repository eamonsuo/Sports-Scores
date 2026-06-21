import {
  fetchMotorsportDriverStandings,
  fetchMotorsportSubstages,
  fetchMotorsportTeamStandings,
} from "@/endpoints/motorsport.api"
import { MOTORSPORT_CATEGORIES } from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { getSportConfigurations } from "@/lib/projUtils"
import {
  Brackets,
  CardVariant,
  DisplayTypes,
  LadderGroup,
  LadderGroupConfig,
  MatchDetail,
  Matches,
  SPORT,
  Standings,
} from "@/types/misc"
import { Sofascore_StageStandingRow } from "@/types/sofascore"
import {
  matchSummariesBySportAndDay,
  matchSummariesByTournament,
} from "./dataverse.service"
import { f1Service } from "./f1.service"
import { SofascoreStageSport } from "./sofascore.service"

class MotorsportService extends SofascoreStageSport {
  constructor() {
    super(
      {
        fetchStageRaces: withDevCache(
          "motorsport",
          "stage-races",
          fetchMotorsportSubstages,
        ),
        fetchStageStandings: withDevCache(
          "motorsport",
          "stage-standings",
          fetchMotorsportDriverStandings,
        ),
        fetchTeamStandings: withDevCache(
          "motorsport",
          "team-standings",
          fetchMotorsportTeamStandings,
        ),
      },
      SPORT.MOTORSPORT,
      MOTORSPORT_CATEGORIES,
      CardVariant.SESSION,
    )
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    if (leagueId === "f1") {
      return await f1Service.matchesByLeagueSeason(leagueId, seasonId)
    }

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
      .map((match) => this.matchSummaryMapper(match))

    if (!allMatches) return null

    const { leagueConfig } = getSportConfigurations(
      this.leagues,
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
      .map((match) => this.matchSummaryMapper(match))

    const fixtures = await mapFixtureRounds(allMatches, this.leagues)

    return {
      fixtures: fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    return null
  }

  async matchDetails(
    matchId: string,
    leagueId: string,
    seasonId: string,
  ): Promise<MatchDetail | null> {
    return await super.matchDetails(matchId, leagueId, seasonId)
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    if (leagueId === "f1") {
      return await f1Service.standings(leagueId, seasonId)
    }

    const stageStandings = await this.apiEndpoints.fetchStageStandings(seasonId)
    const teamStandings = await this.apiEndpoints.fetchTeamStandings(seasonId)

    if (!stageStandings && !teamStandings) return null

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      leagueId,
      seasonId,
    )

    const athleteConfig = ladderConfig?.ladderGroup[0]

    const teamConfig = ladderConfig?.ladderGroup[1]

    const athleteStandings = stageStandings
      ? this.standingsMapper(stageStandings.standings, athleteConfig)
      : null

    const teamStandingsMapped = teamStandings
      ? this.standingsMapper(teamStandings.standings, teamConfig)
      : null

    return {
      standings: [athleteStandings, teamStandingsMapped].filter(
        (item) => item !== null,
      ),
    }
  }

  async brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    return null
  }

  protected standingsMapper(
    table: Sofascore_StageStandingRow[],
    config?: LadderGroupConfig,
    label?: string,
  ): LadderGroup {
    const standings = super.standingsMapper(table, config, label)

    standings.tables = standings.tables.map((mappedTable) => {
      return {
        ...mappedTable,
        data: mappedTable.data.map((item, idx) => {
          return {
            ...item,
            teamColour: table[idx].parentTeam
              ? table[idx].parentTeam.teamColors?.primary
              : table[idx].team?.teamColors?.primary,
            "+/-": this.setPlacesGained(
              Number(table[idx].position),
              Number(table[idx].gridPosition),
            ),
          }
        }),
      }
    })

    return standings
  }

  private setPlacesGained(currentPosition?: number, previousPosition?: number) {
    if (!currentPosition || !previousPosition) {
      return ""
    }
    const difference = previousPosition - currentPosition
    if (difference > 0) {
      return `↑${difference}`
    } else if (difference < 0) {
      return `↓${Math.abs(difference)}`
    } else {
      return "0"
    }
  }

  async matchesFromAPI(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    return super.matchesByLeagueSeason(leagueId, seasonId)
  }
}

export const motorsportService = new MotorsportService()
