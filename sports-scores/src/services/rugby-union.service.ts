import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
} from "@/endpoints/rugby-league.api";
import {
  RUGBY_UNION_LADDER_HEADINGS,
  RUGBY_UNION_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class RugbyUnionService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchNextEvents: fetchRugbyLeagueNextMatches,
        fetchLastEvents: fetchRugbyLeagueLastMatches,
        fetchEventsByDate: fetchRugbyLeagueMatchesByDate,
        fetchEventDetails: fetchRugbyLeagueMatchDetails,
        fetchEventIncidents: fetchRugbyLeagueMatchIncidents,
        fetchStandingsTotal: fetchRugbyLeagueStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: async () => null,
        fetchTeamNextEvents: async () => null,
      },
      SPORT.RUGBY_UNION,
      SofascoreSportURL.RUGBY,
      RUGBY_UNION_LEAGUES,
      RUGBY_UNION_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    );
  }
}

export const rugbyUnionService = new RugbyUnionService();
