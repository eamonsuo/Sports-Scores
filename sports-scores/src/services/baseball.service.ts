import {
  fetchBaseballLastMatches,
  fetchBaseballMatchDetails,
  fetchBaseballMatchesByCategoryDate,
  fetchBaseballMatchLineups,
  fetchBaseballNextMatches,
  fetchBaseballStandings,
  fetchBaseballTeamLastMatches,
  fetchBaseballTeamNextMatches,
} from "@/endpoints/baseball.api"
import {
  BASEBALL_CATEGORIES,
  BASEBALL_LADDER_HEADINGS,
  BASEBALL_LEAGUES,
  SCORE_BREAKDOWN_INNINGS_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class BaseballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "baseball",
          "matches-last",
          fetchBaseballLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "baseball",
          "matches-next",
          fetchBaseballNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "baseball",
          "matches-by-date",
          fetchBaseballMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "baseball",
          "match-details",
          fetchBaseballMatchDetails,
        ),
        fetchEventIncidents: async () => null,
        fetchEventLineups: withDevCache(
          "baseball",
          "match-lineups",
          fetchBaseballMatchLineups,
        ),
        fetchStandingsTotal: withDevCache(
          "baseball",
          "standings",
          fetchBaseballStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "baseball",
          "team-matches-last",
          fetchBaseballTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "baseball",
          "team-matches-next",
          fetchBaseballTeamNextMatches,
        ),
      },
      SPORT.BASEBALL,
      BASEBALL_CATEGORIES,
      BASEBALL_LEAGUES,
      BASEBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_INNINGS_CONFIG,
    )
  }
}

export const baseballService = new BaseballService()
