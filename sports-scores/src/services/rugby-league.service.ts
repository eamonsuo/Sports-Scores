import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByCategoryDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
  fetchRugbyLeagueTeamLastMatches,
  fetchRugbyLeagueTeamNextMatches,
} from "@/endpoints/rugby-league.api"
import {
  RUGBY_LEAGUE_CATEGORIES,
  RUGBY_LEAGUE_LADDER_HEADINGS,
  RUGBY_LEAGUE_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT, Standings } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class RugbyLeagueService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchNextEvents: withDevCache(
          "rugby-league",
          "next-matches",
          fetchRugbyLeagueNextMatches,
        ),
        // fetchNextEvents: async () => null,
        fetchLastEvents: withDevCache(
          "rugby-league",
          "last-matches",
          fetchRugbyLeagueLastMatches,
        ),
        fetchEventsByDate: withDevCache(
          "rugby-league",
          "matches-by-date",
          fetchRugbyLeagueMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "rugby-league",
          "match-details",
          fetchRugbyLeagueMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "rugby-league",
          "match-incidents",
          fetchRugbyLeagueMatchIncidents,
        ),
        fetchStandingsTotal: withDevCache(
          "rugby-league",
          "standings",
          fetchRugbyLeagueStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "rugby-league",
          "team-last-matches",
          fetchRugbyLeagueTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "rugby-league",
          "team-next-matches",
          fetchRugbyLeagueTeamNextMatches,
        ),
      },
      SPORT.RUGBY_LEAGUE,
      RUGBY_LEAGUE_CATEGORIES,
      RUGBY_LEAGUE_LEAGUES,
      RUGBY_LEAGUE_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    )
  }

  override async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    const standings = await super.standings(leagueId, seasonId)

    if (!standings) {
      return null
    }

    const remappedStandings = standings.standings.map((group) => ({
      ...group,
      tables: group.tables.map((table) => ({
        ...table,
        data: table.data
          .map((row) => ({
            ...row,
            Pts: Number(row?.W ?? 0) * 2 + Number(row?.D ?? 0),
            Diff: Number(row?.F ?? 0) - Number(row?.A ?? 0),
          }))
          .sort((a, b) => b.Pts! - a.Pts! || (b.Diff ?? 0) - (a.Diff ?? 0))
          .map((row, index) => ({ ...row, position: index + 1 })),
      })),
    }))

    return {
      standings: remappedStandings,
      playoffPicture: standings.playoffPicture,
    }
  }
}

export const rugbyLeagueService = new RugbyLeagueService()
