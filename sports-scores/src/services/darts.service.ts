import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchScheduledEvents,
  fetchTeamLastMatches,
  fetchTeamNextMatches,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore-rapid-api.api"
import { DARTS_LEAGUES } from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class DartsService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "darts",
          "last-matches",
          fetchTournamentLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "darts",
          "next-matches",
          fetchTournamentNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "darts",
          "matches-by-date",
          (date: Date) => fetchScheduledEvents("104", date),
        ),
        fetchEventDetails: withDevCache(
          "darts",
          "match-details",
          fetchMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "darts",
          "match-incidents",
          fetchMatchIncidents,
        ),
        fetchStandingsTotal: withDevCache(
          "darts",
          "standings",
          fetchTournamentStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "darts",
          "team-last-matches",
          fetchTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "darts",
          "team-next-matches",
          fetchTeamNextMatches,
        ),
      },
      SPORT.DARTS,
      DARTS_LEAGUES,
      [],
    )
  }
}

export const dartsService = new DartsService()
