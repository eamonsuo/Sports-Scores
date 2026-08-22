import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventLineups_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

async function fetchBasketballApi(endpoint: string) {
  return fetchRapidApi(
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
  return (await fetchBasketballApi(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBasketballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchBasketballApi(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBasketballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchBasketballApi(
    `/basketball/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBasketballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchBasketballApi(
    `/basketball/team/${teamId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBasketballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchBasketballApi(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response
}

export async function fetchBasketballMatchDetails(matchId: string) {
  return (await fetchBasketballApi(
    `/basketball/match/${matchId}`,
  )) as Sofascore_Event_Response
}

export async function fetchBasketballMatchIncidents(matchId: string) {
  return (await fetchBasketballApi(
    `/basketball/match/${matchId}/incidents`,
  )) as Sofascore_EventIncidents_Response
}

export async function fetchBasketballMatchLineups(matchId: string) {
  return (await fetchBasketballApi(
    `/basketball/match/${matchId}/lineups`,
  )) as Sofascore_EventLineups_Response
}

export async function fetchBasketballMatchesByDate(date: Date) {
  return (await fetchBasketballApi(
    `/basketball/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Sofascore_Events_Response
}

export async function fetchBasketballMatchesByCategoryDate(
  category: string[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchBasketballApi,
    "/basketball",
    category,
    date,
  )
}
