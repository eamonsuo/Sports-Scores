import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import { SPORT, SportCategory } from "@/types/misc"
import {
  Sofascore_Events_Response,
  Sofascore_TournamentCupTrees_Response,
} from "@/types/sofascore"
import {
  Tennis_TennisApi_EventsByDate_Response,
  Tennis_TennisApi_FixturePage_Response,
  Tennis_TennisApi_MatchDetails_Response,
  Tennis_TennisApi_MatchStatistics_Response,
  Tennis_TennisApi_Rankings_Response,
  Tennis_TennisApi_TournamentRoundMatch_Response,
  Tennis_TennisApi_TournamentRounds_Response,
  Tennis_TennisApi_TournamentStandings_Response,
} from "@/types/tennis"

async function fetchTennisApi<T>(endpoint: string) {
  return fetchRapidApi<T>(process.env.TENNIS_BASEURL, endpoint, SPORT.TENNIS)
}

export async function fetchTennisTournamentRounds(
  tournamentId: string,
  seasonId: string,
) {
  return fetchTennisApi<Tennis_TennisApi_TournamentRounds_Response>(
    `/tennis/tournament/${tournamentId}/season/${seasonId}/rounds`,
  )
}

export async function fetchTennisTournamentRoundMatches(
  tournamentId: string,
  seasonId: string,
  roundId: string,
  roundSlug: string,
) {
  return fetchTennisApi<Tennis_TennisApi_TournamentRoundMatch_Response>(
    `/tennis/tournament/${tournamentId}/season/${seasonId}/events/round/${roundId}/slug/${roundSlug}`,
  )
}

export async function fetchTennisTournamentLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchTennisApi<Tennis_TennisApi_FixturePage_Response>(
    `/tennis/tournament/${tournamentId}/season/${seasonId}/events/last/${pageNumber}`,
  )
}

export async function fetchTennisTournamentNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchTennisApi<Tennis_TennisApi_FixturePage_Response>(
    `/tennis/tournament/${tournamentId}/season/${seasonId}/events/next/${pageNumber}`,
  )
}

export async function fetchTennisBracket(
  tournamentId: string,
  seasonId: string,
) {
  return fetchTennisApi<Sofascore_TournamentCupTrees_Response>(
    `/tennis/tournament/${tournamentId}/season/${seasonId}/cup-trees/old`,
  )
}

export async function fetchTennisTournamentStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchTennisApi<Tennis_TennisApi_TournamentStandings_Response>(
    `/tennis/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )
}

export async function fetchTennisMatchDetails(matchId: string) {
  return fetchTennisApi<Tennis_TennisApi_MatchDetails_Response>(
    `/tennis/event/${matchId}/`,
  )
}

export async function fetchTennisMatchStatistics(matchId: string) {
  return fetchTennisApi<Tennis_TennisApi_MatchStatistics_Response>(
    `/tennis/match/${matchId}/statistics`,
  )
}

export async function fetchTennisMatchesByDate(date: Date) {
  return fetchTennisApi<Tennis_TennisApi_EventsByDate_Response>(
    `/tennis/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )
}

export async function fetchTennisPlayerLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchTennisApi<Tennis_TennisApi_FixturePage_Response>(
    `/tennis/team/${teamId}/events/previous/${pageNumber}`,
  )
}

export async function fetchTennisPlayerNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchTennisApi<Tennis_TennisApi_FixturePage_Response>(
    `/tennis/team/${teamId}/events/next/${pageNumber}`,
  )
}

export async function fetchTennisWTARankings() {
  return fetchTennisApi<Tennis_TennisApi_Rankings_Response>(
    `/tennis/rankings/wta`,
  )
}

export async function fetchTennisATPRankings() {
  return fetchTennisApi<Tennis_TennisApi_Rankings_Response>(
    `/tennis/rankings/atp`,
  )
}

export async function fetchTennisMatchesByCategoryDate(
  category: SportCategory[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchTennisApi,
    "/tennis/category/",
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    category,
  )
}
