import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

async function fetchBaseballApi(endpoint: string) {
  const url = process.env.BASEBALL_BASEURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (!res.ok || res.status === 204) {
    return null
  }

  updateQuota(res, SPORT.BASEBALL)

  return res.json()
}

export async function fetchBaseballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchBaseballApi(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBaseballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchBaseballApi(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBaseballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchBaseballApi(
    `/baseball/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBaseballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchBaseballApi(
    `/baseball/team/${teamId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchBaseballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchBaseballApi(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response
}

export async function fetchBaseballMatchDetails(matchId: string) {
  return (await fetchBaseballApi(
    `/baseball/match/${matchId}`,
  )) as Sofascore_Event_Response
}

// export async function fetchBaseballMatchIncidents(matchId: number) {
//   return (await fetchBaseballApi(
//     `/match/${matchId}/incidents`,
//   )) as Baseball_BaseballApi_MatchIncidents_Response;
// }

export async function fetchBaseballMatchesByDate(date: Date) {
  return (await fetchBaseballApi(
    `/baseball/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Sofascore_Events_Response
}
