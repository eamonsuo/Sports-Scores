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
import { format } from "date-fns/format"

async function fetchSofascoreRapidApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.SOFASCORE_API_BASEURL,
    endpoint,
    SPORT.AUSSIE_RULES,
    false,
  )
}

export async function fetchTournamentLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchSofascoreRapidApi<Sofascore_EventPage_Response>(
    `/tournaments/get-last-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
  )
}

export async function fetchTournamentNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchSofascoreRapidApi<Sofascore_EventPage_Response>(
    `/tournaments/get-next-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
  )
}

export async function fetchTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchSofascoreRapidApi<Sofascore_EventPage_Response>(
    `/teams/get-last-matches?teamId=${teamId}&pageIndex=${pageNumber}`,
  )
}

export async function fetchTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return fetchSofascoreRapidApi<Sofascore_EventPage_Response>(
    `/teams/get-next-matches?teamId=${teamId}&pageIndex=${pageNumber}`,
  )
}

export async function fetchTournamentStandings(
  tournamentId: string,
  seasonId: string,
) {
  return fetchSofascoreRapidApi<Sofascore_TotalStandings_Response>(
    `/tournaments/get-standings?tournamentId=${tournamentId}&seasonId=${seasonId}&type=total`,
  )
}

export async function fetchTournamentBrackets(
  tournamentId: string,
  seasonId: string,
) {
  return fetchSofascoreRapidApi<Sofascore_TournamentCupTrees_Response>(
    `/tournaments/get-cuptrees?tournamentId=${tournamentId}&seasonId=${seasonId}`,
  )
}

export async function fetchMatchDetails(matchId: string) {
  return fetchSofascoreRapidApi<Sofascore_Event_Response>(
    `/matches/detail?matchId=${matchId}`,
  )
}

export async function fetchMatchIncidents(matchId: string) {
  return fetchSofascoreRapidApi<Sofascore_EventIncidents_Response>(
    `/matches/get-incidents?matchId=${matchId}`,
  )
}

export async function fetchMatchLineups(matchId: string) {
  return fetchSofascoreRapidApi<Sofascore_EventLineups_Response>(
    `/matches/get-lineups?matchId=${matchId}`,
  )
}

export async function fetchScheduledEvents(
  category: SportCategory[],
  date: Date,
): Promise<[Sofascore_Events_Response, { category: string; error: number }[]]> {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchSofascoreRapidApi,
    "/tournaments/get-scheduled-events?categoryId=",
    `&date=${format(date, "yyyy-MM-dd")}`,
    category,
  )
}
