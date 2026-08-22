import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchMatchLineups,
  fetchScheduledEvents,
  fetchTeamLastMatches,
  fetchTeamNextMatches,
  fetchTournamentBrackets,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore-rapid-api.api"
import {
  AUSSIE_RULES_CATEGORIES,
  AUSSIE_RULES_LADDER_HEADINGS,
  AUSSIE_RULES_LEAGUES,
  SCORE_BREAKDOWN_QUARTERS_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { SPORT } from "@/types/misc"
import { SofascoreSport } from "./sofascore.service"

class AussieRulesService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "aussie-rules",
          "matches-last",
          fetchTournamentLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "aussie-rules",
          "matches-next",
          fetchTournamentNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "aussie-rules",
          "matches-by-date",
          fetchScheduledEvents,
        ),
        fetchEventDetails: withDevCache(
          "aussie-rules",
          "match-details",
          fetchMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "aussie-rules",
          "match-incidents",
          fetchMatchIncidents,
        ),
        fetchEventLineups: withDevCache(
          "aussie-rules",
          "match-lineups",
          fetchMatchLineups,
        ),
        fetchStandingsTotal: withDevCache(
          "aussie-rules",
          "standings",
          fetchTournamentStandings,
        ),
        fetchCupTrees: withDevCache(
          "aussie-rules",
          "tournament-brackets",
          fetchTournamentBrackets,
        ),
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "aussie-rules",
          "team-matches-last",
          fetchTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "aussie-rules",
          "team-matches-next",
          fetchTeamNextMatches,
        ),
      },
      SPORT.AUSSIE_RULES,
      AUSSIE_RULES_CATEGORIES,
      AUSSIE_RULES_LEAGUES,
      AUSSIE_RULES_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    )
  }
}

export const aussieRulesService = new AussieRulesService()
