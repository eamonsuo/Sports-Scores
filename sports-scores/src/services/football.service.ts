import {
  fetchFootballCupTrees,
  fetchFootballLastMatches,
  fetchFootballMatchDetails,
  fetchFootballMatchesByDate,
  fetchFootballMatchIncidents,
  fetchFootballNextMatches,
  fetchFootballStandings,
  fetchFootballTeamLastMatches,
  fetchFootballTeamNextMatches,
} from "@/endpoints/football.api";
import {
  FOOTBALL_LADDER_HEADINGS,
  FOOTBALL_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants";
import { SPORT } from "@/types/misc";
import { SofascoreSport } from "./sofascore.service";

class FootballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchFootballLastMatches,
        fetchNextEvents: fetchFootballNextMatches,
        fetchEventsByDate: fetchFootballMatchesByDate,
        fetchEventDetails: fetchFootballMatchDetails,
        fetchEventIncidents: fetchFootballMatchIncidents,
        fetchStandingsTotal: fetchFootballStandings,
        fetchCupTrees: fetchFootballCupTrees,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: fetchFootballTeamLastMatches,
        fetchTeamNextEvents: fetchFootballTeamNextMatches,
      },
      SPORT.FOOTBALL,
      FOOTBALL_LEAGUES,
      FOOTBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    );
  }
}

export const footballService = new FootballService();
