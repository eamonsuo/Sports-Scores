import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import { SPORT, SportCategory } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventLineups_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

async function fetchBaseballApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.BASEBALL_BASEURL,
    endpoint,
    SPORT.BASEBALL,
  )
}

export async function fetchBaseballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchBaseballApi<Sofascore_EventPage_Response>(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )
}

export async function fetchBaseballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchBaseballApi<Sofascore_EventPage_Response>(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )
}

export async function fetchBaseballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchBaseballApi<Sofascore_EventPage_Response>(
    `/baseball/team/${teamId}/matches/previous/${pageNumber}`,
  )
}

export async function fetchBaseballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchBaseballApi<Sofascore_EventPage_Response>(
    `/baseball/team/${teamId}/matches/next/${pageNumber}`,
  )
}

export async function fetchBaseballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchBaseballApi<Sofascore_TotalStandings_Response>(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )
}

export async function fetchBaseballMatchDetails(matchId: string) {
  return fetchBaseballApi<Sofascore_Event_Response>(
    `/baseball/match/${matchId}`,
  )
}

// export async function fetchBaseballMatchIncidents(matchId: number) {
//   return (await fetchBaseballApi(
//     `/match/${matchId}/incidents`,
//   )) as Baseball_BaseballApi_MatchIncidents_Response;
// }

export async function fetchBaseballMatchLineups(matchId: string) {
  return fetchBaseballApi<Sofascore_EventLineups_Response>(
    `/baseball/match/${matchId}/lineups`,
  )
}

export async function fetchBaseballMatchesByDate(date: Date) {
  return fetchBaseballApi<Sofascore_Events_Response>(
    `/baseball/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )
}

export async function fetchBaseballMatchesByCategoryDate(
  category: SportCategory[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchBaseballApi,
    "/baseball/category/",
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    category,
  )
}
