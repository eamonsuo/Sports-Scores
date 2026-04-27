import {
  fetchAmericanFootballLastMatches,
  fetchAmericanFootballMatchDetails,
  fetchAmericanFootballCurrentMatches as fetchAmericanFootballMatchesByDate,
  fetchAmericanFootballMatchIncidents,
  fetchAmericanFootballNextMatches,
  fetchAmericanFootballStandings,
} from "@/endpoints/american-football.api";
import {
  AMERICAN_FOOTBALL_LADDER_HEADINGS,
  AMERICAN_FOOTBALL_LEAGUES,
  SCORE_BREAKDOWN_QUARTERS_CONFIG,
} from "@/lib/constants";
import { mapMatchSummary } from "@/lib/eventMapping";
import { AmericanFootball_Sofascore_Event } from "@/types/american-football";
import { API_EVENT_TYPES, MatchSummary, SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class AmericanFootballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchAmericanFootballLastMatches,
        fetchNextEvents: fetchAmericanFootballNextMatches,
        fetchEventsByDate: fetchAmericanFootballMatchesByDate,
        fetchEventDetails: fetchAmericanFootballMatchDetails,
        fetchEventIncidents: fetchAmericanFootballMatchIncidents,
        fetchStandingsTotal: fetchAmericanFootballStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: async () => null,
        fetchTeamNextEvents: async () => null,
      },
      SPORT.AMERICAN_FOOTBALL,
      SofascoreSportURL.AMERICAN_FOOTBALL,
      AMERICAN_FOOTBALL_LEAGUES,
      AMERICAN_FOOTBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    );
  }

  override matchesAll(tournamentId: number, seasonId: number) {
    return super.matchesAll(tournamentId, seasonId, "Week");
  }

  override eventMapper(
    match: AmericanFootball_Sofascore_Event,
    roundLabel: string,
  ): MatchSummary {
    return mapMatchSummary(
      API_EVENT_TYPES.SOFASCORE,
      SPORT.AMERICAN_FOOTBALL,
      match,
      {
        roundLabel,
        homeDetails: {
          winDrawLoss: match.homeTeamSeasonHistoricalForm
            ? `${match.homeTeamSeasonHistoricalForm.wins ?? 0}-${match.homeTeamSeasonHistoricalForm.losses ?? 0}${match.homeTeamSeasonHistoricalForm.draws ? "-" + match.homeTeamSeasonHistoricalForm.draws : ""}`
            : undefined,
        },
        awayDetails: {
          winDrawLoss: match.awayTeamSeasonHistoricalForm
            ? `${match.awayTeamSeasonHistoricalForm.wins ?? 0}-${match.awayTeamSeasonHistoricalForm.losses ?? 0}${match.awayTeamSeasonHistoricalForm.draws ? "-" + match.awayTeamSeasonHistoricalForm.draws : ""}`
            : undefined,
        },
      },
    );
  }
}

export const americanFootballService = new AmericanFootballService();
