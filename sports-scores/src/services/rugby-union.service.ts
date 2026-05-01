import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
  fetchRugbyLeagueTeamLastMatches,
  fetchRugbyLeagueTeamNextMatches,
} from "@/endpoints/rugby-league.api";
import {
  RUGBY_UNION_LADDER_HEADINGS,
  RUGBY_UNION_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants";
import { SPORT } from "@/types/misc";
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
        fetchTeamLastEvents: fetchRugbyLeagueTeamLastMatches,
        fetchTeamNextEvents: fetchRugbyLeagueTeamNextMatches,
      },
      SPORT.RUGBY_UNION,
      RUGBY_UNION_LEAGUES,
      RUGBY_UNION_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    );
  }
}

export const rugbyUnionService = new RugbyUnionService();
