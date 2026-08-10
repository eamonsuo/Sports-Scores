import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
  Sofascore_TournamentCupTrees_Response,
} from "@/types/sofascore"

async function fetchFootballApi(endpoint: string) {
  return fetchRapidApi(process.env.FOOTBALL_BASEURL, endpoint, SPORT.FOOTBALL)
}

export async function fetchFootballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchFootballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchFootballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response
}

export async function fetchFootballMatchDetails(matchId: string) {
  return (await fetchFootballApi(
    `/match/${matchId}`,
  )) as Sofascore_Event_Response
}

export async function fetchFootballMatchIncidents(matchId: string) {
  return (await fetchFootballApi(
    `/match/${matchId}/incidents`,
  )) as Sofascore_EventIncidents_Response
}

// All matches
// export async function fetchFootballMatchesByDate(date: Date) {
//   return (await fetchFootballApi(
//     `/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
//   )) as Sofascore_Events_Response
// }

// Top League matches
export async function fetchFootballMatchesByDate(date: Date) {
  return (await fetchFootballApi(
    `/matches/top/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Sofascore_Events_Response
}

export async function fetchFootballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchFootballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/team/${teamId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchFootballCupTrees(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/cuptrees`,
  )) as Sofascore_TournamentCupTrees_Response
}

export async function fetchFootballMatchesByCategoryDate(
  category: string[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchFootballApi,
    "",
    category,
    date,
    4,
  )
}
