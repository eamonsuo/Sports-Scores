import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

async function fetchBasketballApi(endpoint: string) {
  const url = process.env.BASKETBALL_BASEURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (!res.ok || res.status === 204) {
    return null
  }

  updateQuota(res, SPORT.BASKETBALL)

  return res.json()
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
    `/match/${matchId}/incidents`,
  )) as Sofascore_EventIncidents_Response
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
  const responses = await Promise.all(
    category.map(
      (cat) =>
        fetchBasketballApi(
          `/basketball/category/${cat}/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        ) as Promise<Sofascore_Events_Response>,
    ),
  )

  return {
    events: responses.flatMap((r) => r?.events ?? []),
  } as Sofascore_Events_Response
}
