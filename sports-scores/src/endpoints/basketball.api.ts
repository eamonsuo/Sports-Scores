import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import { SPORT, SportCategory } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventLineups_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

async function fetchBasketballApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.BASKETBALL_BASEURL,
    endpoint,
    SPORT.BASKETBALL,
  )
}

export async function fetchBasketballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchBasketballApi<Sofascore_EventPage_Response>(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )
}

export async function fetchBasketballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchBasketballApi<Sofascore_EventPage_Response>(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )
}

export async function fetchBasketballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchBasketballApi<Sofascore_EventPage_Response>(
    `/basketball/team/${teamId}/matches/previous/${pageNumber}`,
  )
}

export async function fetchBasketballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchBasketballApi<Sofascore_EventPage_Response>(
    `/basketball/team/${teamId}/matches/next/${pageNumber}`,
  )
}

export async function fetchBasketballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchBasketballApi<Sofascore_TotalStandings_Response>(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )
}

export async function fetchBasketballMatchDetails(matchId: string) {
  return fetchBasketballApi<Sofascore_Event_Response>(
    `/basketball/match/${matchId}`,
  )
}

export async function fetchBasketballMatchIncidents(matchId: string) {
  return fetchBasketballApi<Sofascore_EventIncidents_Response>(
    `/basketball/match/${matchId}/incidents`,
  )
}

export async function fetchBasketballMatchLineups(matchId: string) {
  return fetchBasketballApi<Sofascore_EventLineups_Response>(
    `/basketball/match/${matchId}/lineups`,
  )
}

export async function fetchBasketballMatchesByDate(date: Date) {
  return fetchBasketballApi<Sofascore_Events_Response>(
    `/basketball/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )
}

export async function fetchBasketballMatchesByCategoryDate(
  category: SportCategory[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchBasketballApi,
    "/basketball/category/",
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    category,
  )
}
