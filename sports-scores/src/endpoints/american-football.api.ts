import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import {
  AmericanFootball_AmericanFootballApi_CategorySchedule_Response,
  AmericanFootball_AmericanFootballApi_FixturePage_Response,
  AmericanFootball_AmericanFootballApi_Match_Response,
} from "@/types/american-football"
import { SPORT, SportCategory } from "@/types/misc"
import {
  Sofascore_EventIncidents_Response,
  Sofascore_EventLineups_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

async function fetchAmericanFootballApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.AMERICAN_FOOTBALL_BASEURL,
    endpoint,
    SPORT.AMERICAN_FOOTBALL,
  )
}

export async function fetchAmericanFootballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchAmericanFootballApi<AmericanFootball_AmericanFootballApi_FixturePage_Response>(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )
}

export async function fetchAmericanFootballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchAmericanFootballApi<AmericanFootball_AmericanFootballApi_FixturePage_Response>(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )
}

export async function fetchAmericanFootballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchAmericanFootballApi<Sofascore_TotalStandings_Response>(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )
}

export async function fetchAmericanFootballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchAmericanFootballApi<AmericanFootball_AmericanFootballApi_FixturePage_Response>(
    `/american-football/team/${teamId}/matches/previous/${pageNumber}`,
  )
}

export async function fetchAmericanFootballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchAmericanFootballApi<AmericanFootball_AmericanFootballApi_FixturePage_Response>(
    `/american-football/team/${teamId}/matches/next/${pageNumber}`,
  )
}

export async function fetchAmericanFootballMatchDetails(matchId: string) {
  return fetchAmericanFootballApi<AmericanFootball_AmericanFootballApi_Match_Response>(
    `/american-football/match/${matchId}`,
  )
}

export async function fetchAmericanFootballMatchIncidents(matchId: string) {
  return fetchAmericanFootballApi<Sofascore_EventIncidents_Response>(
    `/american-football/match/${matchId}/incidents`,
  )
}

export async function fetchAmericanFootballMatchLineups(matchId: string) {
  return fetchAmericanFootballApi<Sofascore_EventLineups_Response>(
    `/american-football/match/${matchId}/lineups`,
  )
}

export async function fetchAmericanFootballCurrentMatches(date: Date) {
  return fetchAmericanFootballApi<AmericanFootball_AmericanFootballApi_CategorySchedule_Response>(
    `/american-football/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )
}

export async function fetchAmericanFootballMatchesByCategoryDate(
  category: SportCategory[],
  date: Date,
) {
  return fetchEventsByCategoryDate<AmericanFootball_AmericanFootballApi_CategorySchedule_Response>(
    fetchAmericanFootballApi,
    "/american-football/category/",
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    category,
  )
}
