import {
  fetchMotorsportDriverStandings,
  fetchMotorsportSubstages,
  fetchMotorsportTeamStandings,
} from "@/endpoints/motorsport.api"
import { withDevCache } from "@/lib/devCache"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { getSportConfigurations } from "@/lib/projUtils"
import {
  Brackets,
  CardVariant,
  LadderGroup,
  LadderGroupConfig,
  MatchDetail,
  Matches,
  SPORT,
  Standings,
} from "@/types/misc"
import { Sofascore_StageStandingRow } from "@/types/sofascore"
import {
  ladderConfigByLeagueBySeason,
  leaguesBySportByLeague,
  matchSummariesBySportByLeagueBySeason,
} from "./dataverse.service"
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
      CardVariant.SESSION,
    )
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const [dataverseMatches, leagues] = await Promise.all([
      matchSummariesBySportByLeagueBySeason(leagueId, seasonId, this.sport),
      leaguesBySportByLeague(this.sport, leagueId),
    ])

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null
    }

    const allMatches = dataverseMatches.map((match) =>
      this.eventMapperMatchSummary(match),
    )

    if (!allMatches) return null

    const { leagueConfig } = getSportConfigurations(leagues, leagueId, seasonId)
    const fixtures = await mapFixtureRounds(allMatches, leagueConfig)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches
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
    const [stageStandings, teamStandings, ladderConfig] = await Promise.all([
      this.apiEndpoints.fetchStageStandings(seasonId),
      this.apiEndpoints.fetchTeamStandings(seasonId),
      ladderConfigByLeagueBySeason(leagueId, seasonId),
    ])

    if (!stageStandings && !teamStandings) return null

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
}

export const motorsportService = new MotorsportService()
