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
import { setMatchSummary } from "@/lib/projUtils"
import { DeepPartial, MatchSummary, SPORT } from "@/types/misc"
import { Sofascore_Event } from "@/types/sofascore"
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

  override eventMapper(
    event: Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    return super.eventMapper(event, {
      ...options,
      competitorDetails: [
        {
          ...options?.competitorDetails?.[0],
          score: `${event.homeScore.display}${event.homeScore.penalties ? ` (${event.homeScore.penalties})` : ""}`,
        },
        {
          ...options?.competitorDetails?.[1],
          score: `${event.awayScore.display}${event.awayScore.penalties ? ` (${event.awayScore.penalties})` : ""}`,
        },
      ],
      summaryText: setMatchSummary(
        event.status.description === "AP" && event.status.type === "finished"
          ? "penalties"
          : event.status.type,
        event.homeTeam.name,
        event.homeScore.current,
        event.awayTeam.name,
        event.awayScore.current,
      ),
    })
  }
}

export const footballService = new FootballService()
