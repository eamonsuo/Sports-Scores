import {
  fetchBaseballLastMatches,
  fetchBaseballMatchDetails,
  fetchBaseballMatchesByDate,
  fetchBaseballNextMatches,
  fetchBaseballStandings,
} from "@/endpoints/baseball.api";
import {
  BASEBALL_LADDER_HEADINGS,
  BASEBALL_LEAGUES,
  SCORE_BREAKDOWN_INNINGS_CONFIG,
} from "@/lib/constants";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class BaseballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchBaseballLastMatches,
        fetchNextEvents: fetchBaseballNextMatches,
        fetchEventsByDate: fetchBaseballMatchesByDate,
        fetchEventDetails: fetchBaseballMatchDetails,
        fetchEventIncidents: async () => null,
        fetchStandingsTotal: fetchBaseballStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: async () => null,
        fetchTeamNextEvents: async () => null,
      },
      SPORT.BASEBALL,
      SofascoreSportURL.BASEBALL,
      BASEBALL_LEAGUES,
      BASEBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_INNINGS_CONFIG,
    );
  }
}

// Custom sort: division < conference < MLB
function tableOrder(name: string): number {
  if (name === "MLB") return 2;
  if (name.split(" ").length == 2) return 1;
  return 0; // Division tables
}

export const baseballService = new BaseballService();
