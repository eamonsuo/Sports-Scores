import {
  fetchBasketballLastMatches,
  fetchBasketballMatchDetails,
  fetchBasketballMatchesByDate,
  fetchBasketballMatchIncidents,
  fetchBasketballNextMatches,
  fetchBasketballStandings,
  fetchBasketballTeamLastMatches,
  fetchBasketballTeamNextMatches,
} from "@/endpoints/basketball.api";
import {
  BASKETBALL_LADDER_HEADINGS,
  BASKETBALL_LEAGUES,
  SCORE_BREAKDOWN_QUARTERS_CONFIG,
} from "@/lib/constants";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class BasketballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchBasketballLastMatches,
        fetchNextEvents: fetchBasketballNextMatches,
        fetchEventsByDate: fetchBasketballMatchesByDate,
        fetchEventDetails: fetchBasketballMatchDetails,
        fetchEventIncidents: fetchBasketballMatchIncidents,
        fetchStandingsTotal: fetchBasketballStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: fetchBasketballTeamLastMatches,
        fetchTeamNextEvents: fetchBasketballTeamNextMatches,
      },
      SPORT.BASKETBALL,
      SofascoreSportURL.BASKETBALL,
      BASKETBALL_LEAGUES,
      BASKETBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    );
  }
}

export const basketballService = new BasketballService();
