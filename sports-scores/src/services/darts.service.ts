import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchScheduledEvents,
  fetchTeamLastMatches,
  fetchTeamNextMatches,
  fetchTournamentBrackets,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore-rapid-api.api"
import { DARTS_LEAGUES } from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { DeepPartial, MatchSummary, SPORT } from "@/types/misc"
import { Sofascore_Event } from "@/types/sofascore"
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
        fetchCupTrees: withDevCache(
          "darts",
          "tournament-brackets",
          fetchTournamentBrackets,
        ),
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
      ["Player", "P", "W", "L", "Pts"],
    )
  }

  override eventMapper(
    event: Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    const leagueTournament = [2066, 592, 11565].includes(
      event.tournament.uniqueTournament.id,
    )

    return super.eventMapper(event, {
      ...options,
      venue: "",
      roundLabel: leagueTournament
        ? event.tournament.name
        : (event.roundInfo?.name ?? `Round ${event.roundInfo?.round ?? "x"}`),
      leagueName: leagueTournament ? event.roundInfo?.name : undefined,
    })
  }
}

export const dartsService = new DartsService()
