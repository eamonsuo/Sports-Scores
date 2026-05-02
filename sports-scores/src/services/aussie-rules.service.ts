import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchScheduledEvents,
  fetchTeamLastMatches,
  fetchTeamNextMatches,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore-rapid-api.api";
import {
  AUSSIE_RULES_LADDER_HEADINGS,
  AUSSIE_RULES_LEAGUES,
  SCORE_BREAKDOWN_QUARTERS_CONFIG,
} from "@/lib/constants";
import { withDevCache } from "@/lib/devCache";
import { SPORT } from "@/types/misc";
import { SofascoreSport } from "./sofascore.service";

class AussieRulesService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "aussie-rules",
          "last-matches",
          fetchTournamentLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "aussie-rules",
          "next-matches",
          fetchTournamentNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "aussie-rules",
          "matches-by-date",
          (date: Date) => fetchScheduledEvents("87", date),
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
        fetchStandingsTotal: withDevCache(
          "aussie-rules",
          "standings",
          fetchTournamentStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "aussie-rules",
          "team-last-matches",
          fetchTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "aussie-rules",
          "team-next-matches",
          fetchTeamNextMatches,
        ),
      },
      SPORT.AUSSIE_RULES,
      AUSSIE_RULES_LEAGUES,
      AUSSIE_RULES_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    );
  }
}

export const aussieRulesService = new AussieRulesService();
