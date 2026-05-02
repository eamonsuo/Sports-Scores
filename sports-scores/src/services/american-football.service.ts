import {
  fetchAmericanFootballLastMatches,
  fetchAmericanFootballMatchDetails,
  fetchAmericanFootballCurrentMatches as fetchAmericanFootballMatchesByDate,
  fetchAmericanFootballMatchIncidents,
  fetchAmericanFootballNextMatches,
  fetchAmericanFootballStandings,
  fetchAmericanFootballTeamLastMatches,
  fetchAmericanFootballTeamNextMatches,
} from "@/endpoints/american-football.api";
import {
  AMERICAN_FOOTBALL_LADDER_HEADINGS,
  AMERICAN_FOOTBALL_LEAGUES,
  SCORE_BREAKDOWN_QUARTERS_CONFIG,
} from "@/lib/constants";
import { AmericanFootball_Sofascore_Event } from "@/types/american-football";
import { DeepPartial, MatchSummary, SPORT } from "@/types/misc";
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
        fetchTeamLastEvents: fetchAmericanFootballTeamLastMatches,
        fetchTeamNextEvents: fetchAmericanFootballTeamNextMatches,
      },
      SPORT.AMERICAN_FOOTBALL,
      AMERICAN_FOOTBALL_LEAGUES,
      AMERICAN_FOOTBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    );
  }

  override matchesByLeagueSeason(leagueId: string, seasonId: string) {
    return super.matchesByLeagueSeason(leagueId, seasonId, "Week");
  }

  eventMapper(
    event: AmericanFootball_Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    return super.eventMapper(event, {
      ...options,
      homeDetails: {
        ...options?.homeDetails,
        winDrawLoss: `${event.homeTeamSeasonHistoricalForm.wins ?? 0}-${event.homeTeamSeasonHistoricalForm.losses ?? 0}${event.homeTeamSeasonHistoricalForm.draws ? "-" + event.homeTeamSeasonHistoricalForm.draws : ""}`,
      },
      awayDetails: {
        ...options?.awayDetails,
        winDrawLoss: `${event.awayTeamSeasonHistoricalForm.wins ?? 0}-${event.awayTeamSeasonHistoricalForm.losses ?? 0}${event.awayTeamSeasonHistoricalForm.draws ? "-" + event.awayTeamSeasonHistoricalForm.draws : ""}`,
      },
    });
  }
}

export const americanFootballService = new AmericanFootballService();
