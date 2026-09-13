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

async function fetchIceHockeyApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.ICE_HOCKEY_BASEURL,
    endpoint,
    SPORT.ICE_HOCKEY,
  )
}

export async function fetchIceHockeyLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchIceHockeyApi<Sofascore_EventPage_Response>(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )
}

export async function fetchIceHockeyNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchIceHockeyApi<Sofascore_EventPage_Response>(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )
}

export async function fetchIceHockeyTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchIceHockeyApi<Sofascore_EventPage_Response>(
    `/ice-hockey/team/${teamId}/matches/previous/${pageNumber}`,
  )
}

export async function fetchIceHockeyTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchIceHockeyApi<Sofascore_EventPage_Response>(
    `/ice-hockey/team/${teamId}/matches/next/${pageNumber}`,
  )
}

export async function fetchIceHockeyStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchIceHockeyApi<Sofascore_TotalStandings_Response>(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )
}

export async function fetchIceHockeyMatchDetails(matchId: string) {
  return fetchIceHockeyApi<Sofascore_Event_Response>(
    `/ice-hockey/match/${matchId}`,
  )
}

export async function fetchIceHockeyMatchIncidents(matchId: string) {
  return fetchIceHockeyApi<Sofascore_EventIncidents_Response>(
    `/ice-hockey/match/${matchId}/incidents`,
  )
}

export async function fetchIceHockeyMatchLineups(matchId: string) {
  return fetchIceHockeyApi<Sofascore_EventLineups_Response>(
    `/ice-hockey/match/${matchId}/lineups`,
  )
}

export async function fetchIceHockeyMatchesByDate(date: Date) {
  return fetchIceHockeyApi<Sofascore_Events_Response>(
    `/ice-hockey/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )
}

export async function fetchIceHockeyMatchesByCategoryDate(
  category: SportCategory[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchIceHockeyApi,
    "/ice-hockey/category/",
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    category,
  )
}
