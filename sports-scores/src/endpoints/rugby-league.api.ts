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

async function fetchRugbyLeagueApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.RUGBY_LEAGUE_BASEURL,
    endpoint,
    SPORT.RUGBY_LEAGUE,
  )
}

export async function fetchRugbyLeagueLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return await fetchRugbyLeagueApi<Sofascore_EventPage_Response>(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )
}

export async function fetchRugbyLeagueNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchRugbyLeagueApi<Sofascore_EventPage_Response>(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )
}

export async function fetchRugbyLeagueTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchRugbyLeagueApi<Sofascore_EventPage_Response>(
    `/rugby/team/${teamId}/matches/previous/${pageNumber}`,
  )
}

export async function fetchRugbyLeagueTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchRugbyLeagueApi<Sofascore_EventPage_Response>(
    `/rugby/team/${teamId}/matches/next/${pageNumber}`,
  )
}

export async function fetchRugbyLeagueStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchRugbyLeagueApi<Sofascore_TotalStandings_Response>(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )
}

export async function fetchRugbyLeagueMatchDetails(matchId: string) {
  return fetchRugbyLeagueApi<Sofascore_Event_Response>(
    `/rugby/match/${matchId}`,
  )
}

export async function fetchRugbyLeagueMatchIncidents(matchId: string) {
  return fetchRugbyLeagueApi<Sofascore_EventIncidents_Response>(
    `/rugby/match/${matchId}/incidents`,
  )
}

export async function fetchRugbyLeagueMatchLineups(matchId: string) {
  return fetchRugbyLeagueApi<Sofascore_EventLineups_Response>(
    `/rugby/match/${matchId}/lineups`,
  )
}

//Deprecated
export async function fetchRugbyLeagueMatchesByDate(date: Date) {
  return fetchRugbyLeagueApi<Sofascore_Events_Response>(
    `/rugby/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )
}

export async function fetchRugbyLeagueMatchesByCategoryDate(
  category: SportCategory[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchRugbyLeagueApi,
    "/rugby/category/",
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    category,
  )
}
