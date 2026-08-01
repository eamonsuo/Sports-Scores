import {
  fetchIceHockeyLastMatches,
  fetchIceHockeyMatchDetails,
  fetchIceHockeyMatchesByCategoryDate,
  fetchIceHockeyMatchIncidents,
  fetchIceHockeyNextMatches,
  fetchIceHockeyStandings,
  fetchIceHockeyTeamLastMatches,
  fetchIceHockeyTeamNextMatches,
} from "@/endpoints/ice-hockey.api"
import {
  ICE_HOCKEY_CATEGORIES,
  ICE_HOCKEY_LADDER_HEADINGS,
  ICE_HOCKEY_LEAGUES,
  SCORE_BREAKDOWN_PERIODS_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class IceHockeyService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "ice-hockey",
          "matches-last",
          fetchIceHockeyLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "ice-hockey",
          "matches-next",
          fetchIceHockeyNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "ice-hockey",
          "matches-by-date",
          fetchIceHockeyMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "ice-hockey",
          "match-details",
          fetchIceHockeyMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "ice-hockey",
          "match-incidents",
          fetchIceHockeyMatchIncidents,
        ),
        fetchEventLineups: async () => null,
        fetchStandingsTotal: withDevCache(
          "ice-hockey",
          "standings",
          fetchIceHockeyStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "ice-hockey",
          "team-matches-last",
          fetchIceHockeyTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "ice-hockey",
          "team-matches-next",
          fetchIceHockeyTeamNextMatches,
        ),
      },
      SPORT.ICE_HOCKEY,
      ICE_HOCKEY_CATEGORIES,
      ICE_HOCKEY_LEAGUES,
      ICE_HOCKEY_LADDER_HEADINGS,
      SCORE_BREAKDOWN_PERIODS_CONFIG,
    )
  }
}

export const iceHockeyService = new IceHockeyService()
