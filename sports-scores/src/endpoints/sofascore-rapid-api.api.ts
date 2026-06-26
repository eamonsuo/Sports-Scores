import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
  Sofascore_TournamentCupTrees_Response,
} from "@/types/sofascore"
import { format } from "date-fns/format"

async function fetchSofascoreRapidApi(endpoint: string) {
  const url = process.env.SOFASCORE_API_BASEURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (!res.ok || res.status === 204) {
    return null
  }

  updateQuota(res, SPORT.AUSSIE_RULES)

  return res.json()
}

export async function fetchTournamentLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-last-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchTournamentNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-next-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreRapidApi(
    `/teams/get-last-matches?teamId=${teamId}&pageIndex=${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreRapidApi(
    `/teams/get-next-matches?teamId=${teamId}&pageIndex=${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchTournamentStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-standings?tournamentId=${tournamentId}&seasonId=${seasonId}&type=total`,
  )) as Sofascore_TotalStandings_Response
}

export async function fetchTournamentBrackets(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-cuptrees?tournamentId=${tournamentId}&seasonId=${seasonId}`,
  )) as Sofascore_TournamentCupTrees_Response
}

export async function fetchMatchDetails(matchId: string) {
  return (await fetchSofascoreRapidApi(
    `/matches/detail?matchId=${matchId}`,
  )) as Sofascore_Event_Response
}

export async function fetchMatchIncidents(matchId: string) {
  return (await fetchSofascoreRapidApi(
    `/matches/get-incidents?matchId=${matchId}`,
  )) as Sofascore_EventIncidents_Response
}

export async function fetchScheduledEvents(categoryId: string[], date: Date) {
  const responses = await Promise.all(
    categoryId.map(
      (cat) =>
        fetchSofascoreRapidApi(
          `/tournaments/get-scheduled-events?categoryId=${cat}&date=${format(date, "yyyy-MM-dd")}`,
        ) as Promise<Sofascore_Events_Response>,
    ),
  )

  return {
    events: responses.flatMap((r) => r?.events ?? []),
  } as Sofascore_Events_Response
}
