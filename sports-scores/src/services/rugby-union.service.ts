import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
  fetchRugbyLeagueTeamLastMatches,
  fetchRugbyLeagueTeamNextMatches,
} from "@/endpoints/rugby-league.api";
import {
  RUGBY_UNION_LADDER_HEADINGS,
  RUGBY_UNION_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants";
import { withDevCache } from "@/lib/devCache";
import { SPORT } from "@/types/misc";
import { SofascoreSport } from "./sofascore.service";

class RugbyUnionService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchNextEvents: withDevCache(
          "rugby-union",
          "next-matches",
          fetchRugbyLeagueNextMatches,
        ),
        fetchLastEvents: withDevCache(
          "rugby-union",
          "last-matches",
          fetchRugbyLeagueLastMatches,
        ),
        fetchEventsByDate: withDevCache(
          "rugby-union",
          "matches-by-date",
          fetchRugbyLeagueMatchesByDate,
        ),
        fetchEventDetails: withDevCache(
          "rugby-union",
          "match-details",
          fetchRugbyLeagueMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "rugby-union",
          "match-incidents",
          fetchRugbyLeagueMatchIncidents,
        ),
        fetchStandingsTotal: withDevCache(
          "rugby-union",
          "standings",
          fetchRugbyLeagueStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "rugby-union",
          "team-last-matches",
          fetchRugbyLeagueTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "rugby-union",
          "team-next-matches",
          fetchRugbyLeagueTeamNextMatches,
        ),
      },
      SPORT.RUGBY_UNION,
      RUGBY_UNION_LEAGUES,
      RUGBY_UNION_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    );
  }
}

export const rugbyUnionService = new RugbyUnionService();
