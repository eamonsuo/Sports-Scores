import {
  fetchAmericanFootballLastMatches,
  fetchAmericanFootballMatchDetails,
  fetchAmericanFootballCurrentMatches as fetchAmericanFootballMatchesByDate,
  fetchAmericanFootballMatchIncidents,
  fetchAmericanFootballNextMatches,
  fetchAmericanFootballStandings,
  fetchAmericanFootballTeamLastMatches,
  fetchAmericanFootballTeamNextMatches,
} from "@/endpoints/american-football.api"
import {
  AMERICAN_FOOTBALL_LADDER_HEADINGS,
  AMERICAN_FOOTBALL_LEAGUES,
  SCORE_BREAKDOWN_QUARTERS_CONFIG,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { AmericanFootball_Sofascore_Event } from "@/types/american-football"
import { DeepPartial, MatchSummary, SPORT } from "@/types/misc"
import { Sofascore_Standing } from "@/types/sofascore"
import { SofascoreSport } from "./sofascore.service"

class AmericanFootballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "american-football",
          "last-matches",
          fetchAmericanFootballLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "american-football",
          "next-matches",
          fetchAmericanFootballNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "american-football",
          "matches-by-date",
          fetchAmericanFootballMatchesByDate,
        ),
        fetchEventDetails: withDevCache(
          "american-football",
          "match-details",
          fetchAmericanFootballMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "american-football",
          "match-incidents",
          fetchAmericanFootballMatchIncidents,
        ),
        fetchStandingsTotal: withDevCache(
          "american-football",
          "standings",
          fetchAmericanFootballStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "american-football",
          "team-last-matches",
          fetchAmericanFootballTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "american-football",
          "team-next-matches",
          fetchAmericanFootballTeamNextMatches,
        ),
      },
      SPORT.AMERICAN_FOOTBALL,
      AMERICAN_FOOTBALL_LEAGUES,
      AMERICAN_FOOTBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_QUARTERS_CONFIG,
    )
  }

  override matchesByLeagueSeason(leagueId: string, seasonId: string) {
    return super.matchesByLeagueSeason(leagueId, seasonId)
  }

  override eventMapper(
    event: AmericanFootball_Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    return super.eventMapper(event, {
      ...options,
      roundLabel: event.roundInfo?.name ?? `Week ${event.roundInfo?.round}`,
      homeDetails: {
        ...options?.homeDetails,
        winDrawLoss:
          event.homeTeamSeasonHistoricalForm &&
          `${event.homeTeamSeasonHistoricalForm.wins ?? 0}-${event.homeTeamSeasonHistoricalForm.losses ?? 0}${event.homeTeamSeasonHistoricalForm.draws ? "-" + event.homeTeamSeasonHistoricalForm.draws : ""}`,
      },
      awayDetails: {
        ...options?.awayDetails,
        winDrawLoss:
          event.awayTeamSeasonHistoricalForm &&
          `${event.awayTeamSeasonHistoricalForm.wins ?? 0}-${event.awayTeamSeasonHistoricalForm.losses ?? 0}${event.awayTeamSeasonHistoricalForm.draws ? "-" + event.awayTeamSeasonHistoricalForm.draws : ""}`,
      },
    })
  }

  //TODO: How to organise standings?
  override standingsSorter(
    a: Sofascore_Standing,
    b: Sofascore_Standing,
  ): number {
    return 0
  }
}

export const americanFootballService = new AmericanFootballService()
