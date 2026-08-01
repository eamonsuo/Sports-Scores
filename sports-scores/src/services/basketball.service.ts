import {
  fetchBasketballLastMatches,
  fetchBasketballMatchDetails,
  fetchBasketballMatchesByCategoryDate,
  fetchBasketballMatchIncidents,
  fetchBasketballNextMatches,
  fetchBasketballStandings,
  fetchBasketballTeamLastMatches,
  fetchBasketballTeamNextMatches,
} from "@/endpoints/basketball.api"
import {
  BASKETBALL_CATEGORIES,
  BASKETBALL_LADDER_HEADINGS,
  BASKETBALL_LEAGUES,
  SCORE_BREAKDOWN_QUARTERS_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class BasketballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "basketball",
          "matches-last",
          fetchBasketballLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "basketball",
          "matches-next",
          fetchBasketballNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "basketball",
          "matches-by-date",
          fetchBasketballMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "basketball",
          "match-details",
          fetchBasketballMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "basketball",
          "match-incidents",
          fetchBasketballMatchIncidents,
        ),
        fetchEventLineups: async () => null,
        fetchStandingsTotal: withDevCache(
          "basketball",
          "standings",
          fetchBasketballStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "basketball",
          "team-matches-last",
          fetchBasketballTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "basketball",
          "team-matches-next",
          fetchBasketballTeamNextMatches,
        ),
      },
      SPORT.BASKETBALL,
      BASKETBALL_CATEGORIES,
      BASKETBALL_LEAGUES,
      BASKETBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    )
  }
}

export const basketballService = new BasketballService()
