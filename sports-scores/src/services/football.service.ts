import {
  fetchFootballCupTrees,
  fetchFootballLastMatches,
  fetchFootballMatchDetails,
  fetchFootballMatchesByCategoryDate,
  fetchFootballMatchIncidents,
  fetchFootballNextMatches,
  fetchFootballStandings,
  fetchFootballTeamLastMatches,
  fetchFootballTeamNextMatches,
} from "@/endpoints/football.api"
import {
  FOOTBALL_CATEGORIES,
  FOOTBALL_LADDER_HEADINGS,
  FOOTBALL_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class FootballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "football",
          "last-matches",
          fetchFootballLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "football",
          "next-matches",
          fetchFootballNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "football",
          "matches-by-date",
          fetchFootballMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "football",
          "match-details",
          fetchFootballMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "football",
          "match-incidents",
          fetchFootballMatchIncidents,
        ),
        fetchStandingsTotal: withDevCache(
          "football",
          "standings",
          fetchFootballStandings,
        ),
        fetchCupTrees: withDevCache(
          "football",
          "cup-trees",
          fetchFootballCupTrees,
        ),
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "football",
          "team-last-matches",
          fetchFootballTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "football",
          "team-next-matches",
          fetchFootballTeamNextMatches,
        ),
      },
      SPORT.FOOTBALL,
      FOOTBALL_CATEGORIES,
      FOOTBALL_LEAGUES,
      FOOTBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    )
  }
}

export const footballService = new FootballService()
