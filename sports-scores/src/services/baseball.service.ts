import {
  fetchBaseballLastMatches,
  fetchBaseballMatchDetails,
  fetchBaseballMatchesByDate,
  fetchBaseballNextMatches,
  fetchBaseballStandings,
  fetchBaseballTeamLastMatches,
  fetchBaseballTeamNextMatches,
} from "@/endpoints/baseball.api"
import {
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
          "last-matches",
          fetchBaseballLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "baseball",
          "next-matches",
          fetchBaseballNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "baseball",
          "matches-by-date",
          fetchBaseballMatchesByDate,
        ),
        fetchEventDetails: withDevCache(
          "baseball",
          "match-details",
          fetchBaseballMatchDetails,
        ),
        fetchEventIncidents: async () => null,
        fetchStandingsTotal: withDevCache(
          "baseball",
          "standings",
          fetchBaseballStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "baseball",
          "team-last-matches",
          fetchBaseballTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "baseball",
          "team-next-matches",
          fetchBaseballTeamNextMatches,
        ),
      },
      SPORT.BASEBALL,
      BASEBALL_LEAGUES,
      BASEBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_INNINGS_CONFIG,
    )
  }
}

export const baseballService = new BaseballService()
