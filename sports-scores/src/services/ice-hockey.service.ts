import {
  fetchIceHockeyLastMatches,
  fetchIceHockeyMatchDetails,
  fetchIceHockeyMatchesByDate,
  fetchIceHockeyMatchIncidents,
  fetchIceHockeyNextMatches,
  fetchIceHockeyStandings,
  fetchIceHockeyTeamLastMatches,
  fetchIceHockeyTeamNextMatches,
} from "@/endpoints/ice-hockey.api";
import {
  ICE_HOCKEY_LADDER_HEADINGS,
  ICE_HOCKEY_LEAGUES,
  SCORE_BREAKDOWN_PERIODS_CONFIG,
} from "@/lib/constants";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class IceHockeyService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchIceHockeyLastMatches,
        fetchNextEvents: fetchIceHockeyNextMatches,
        fetchEventsByDate: fetchIceHockeyMatchesByDate,
        fetchEventDetails: fetchIceHockeyMatchDetails,
        fetchEventIncidents: fetchIceHockeyMatchIncidents,
        fetchStandingsTotal: fetchIceHockeyStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: fetchIceHockeyTeamLastMatches,
        fetchTeamNextEvents: fetchIceHockeyTeamNextMatches,
      },
      SPORT.ICE_HOCKEY,
      SofascoreSportURL.ICE_HOCKEY,
      ICE_HOCKEY_LEAGUES,
      ICE_HOCKEY_LADDER_HEADINGS,
      SCORE_BREAKDOWN_PERIODS_CONFIG,
    );
  }
}

export const iceHockeyService = new IceHockeyService();
