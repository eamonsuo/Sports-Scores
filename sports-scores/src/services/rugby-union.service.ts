import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByCategoryDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueMatchLineups,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
  fetchRugbyLeagueTeamLastMatches,
  fetchRugbyLeagueTeamNextMatches,
} from "@/endpoints/rugby-league.api"
import {
  RUGBY_UNION_CATEGORIES,
  RUGBY_UNION_LADDER_HEADINGS,
  RUGBY_UNION_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class RugbyUnionService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchNextEvents: withDevCache(
          "rugby-union",
          "matches-next",
          fetchRugbyLeagueNextMatches,
        ),
        fetchLastEvents: withDevCache(
          "rugby-union",
          "matches-last",
          fetchRugbyLeagueLastMatches,
        ),
        fetchEventsByDate: withDevCache(
          "rugby-union",
          "matches-by-date",
          fetchRugbyLeagueMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "rugby-union",
          "match-details",
          fetchRugbyLeagueMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "rugby-union",
          "match-incidents",
          fetchRugbyLeagueMatchIncidents,
        ),
        fetchEventLineups: withDevCache(
          "rugby-union",
          "match-lineups",
          fetchRugbyLeagueMatchLineups,
        ),
        fetchStandingsTotal: withDevCache(
          "rugby-union",
          "standings",
          fetchRugbyLeagueStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "rugby-union",
          "team-matches-last",
          fetchRugbyLeagueTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "rugby-union",
          "team-matches-next",
          fetchRugbyLeagueTeamNextMatches,
        ),
      },
      SPORT.RUGBY_UNION,
      RUGBY_UNION_CATEGORIES,
      RUGBY_UNION_LEAGUES,
      RUGBY_UNION_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    )
  }
}

export const rugbyUnionService = new RugbyUnionService()
