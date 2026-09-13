import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import { SPORT, SportCategory } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventLineups_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
  Sofascore_TournamentCupTrees_Response,
} from "@/types/sofascore"

async function fetchFootballApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.FOOTBALL_BASEURL,
    endpoint,
    SPORT.FOOTBALL,
  )
}

export async function fetchFootballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchFootballApi<Sofascore_EventPage_Response>(
    `/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )
}

export async function fetchFootballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchFootballApi<Sofascore_EventPage_Response>(
    `/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )
}

export async function fetchFootballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchFootballApi<Sofascore_TotalStandings_Response>(
    `/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )
}

export async function fetchFootballMatchDetails(matchId: string) {
  return fetchFootballApi<Sofascore_Event_Response>(`/match/${matchId}`)
}

export async function fetchFootballMatchIncidents(matchId: string) {
  return fetchFootballApi<Sofascore_EventIncidents_Response>(
    `/match/${matchId}/incidents`,
  )
}

export async function fetchFootballMatchLineups(matchId: string) {
  return fetchFootballApi<Sofascore_EventLineups_Response>(
    `/match/${matchId}/lineups`,
  )
}

// All matches
// export async function fetchFootballMatchesByDate(date: Date) {
//   return (await fetchFootballApi(
//     `/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
//   )) as Sofascore_Events_Response
// }

// Top League matches
export async function fetchFootballMatchesByDate(date: Date) {
  return fetchFootballApi<Sofascore_Events_Response>(
    `/matches/top/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )
}

export async function fetchFootballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchFootballApi<Sofascore_EventPage_Response>(
    `/team/${teamId}/matches/previous/${pageNumber}`,
  )
}

export async function fetchFootballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchFootballApi<Sofascore_EventPage_Response>(
    `/team/${teamId}/matches/next/${pageNumber}`,
  )
}

export async function fetchFootballCupTrees(
  tournamentId: string,
  seasonId: string,
) {
  return fetchFootballApi<Sofascore_TournamentCupTrees_Response>(
    `/tournament/${tournamentId}/season/${seasonId}/cuptrees`,
  )
}

export async function fetchFootballMatchesByCategoryDate(
  category: SportCategory[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchFootballApi,
    "/category/",
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    category,
    // 4,
  )
}
