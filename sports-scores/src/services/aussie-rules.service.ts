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
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class AussieRulesService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchTournamentLastMatches,
        fetchNextEvents: fetchTournamentNextMatches,
        fetchEventsByDate: (date: Date) => fetchScheduledEvents(87, date),
        fetchEventDetails: fetchMatchDetails,
        fetchEventIncidents: fetchMatchIncidents,
        fetchStandingsTotal: fetchTournamentStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: fetchTeamLastMatches,
        fetchTeamNextEvents: fetchTeamNextMatches,
      },
      SPORT.AUSSIE_RULES,
      SofascoreSportURL.AUSSIE_RULES,
      AUSSIE_RULES_LEAGUES,
      AUSSIE_RULES_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    );
  }
}

export const aussieRulesService = new AussieRulesService();
