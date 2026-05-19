import { updateQuota } from "@/lib/projUtils"
import {
  AmericanFootball_AmericanFootballApi_CategorySchedule_Response,
  AmericanFootball_AmericanFootballApi_FixturePage_Response,
  AmericanFootball_AmericanFootballApi_Match_Response,
} from "@/types/american-football"
import { SPORT } from "@/types/misc"
import {
  Sofascore_EventIncidents_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

async function fetchAmericanFootballApi(endpoint: string) {
  const url = process.env.NFL_BASEURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (!res.ok || res.status === 204) {
    return null
  }

  updateQuota(res, SPORT.AMERICAN_FOOTBALL)

  return res.json()
}

export async function fetchAmericanFootballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as AmericanFootball_AmericanFootballApi_FixturePage_Response
}

export async function fetchAmericanFootballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as AmericanFootball_AmericanFootballApi_FixturePage_Response
}

export async function fetchAmericanFootballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response
}

export async function fetchAmericanFootballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/team/${teamId}/matches/previous/${pageNumber}`,
  )) as AmericanFootball_AmericanFootballApi_FixturePage_Response
}

export async function fetchAmericanFootballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/team/${teamId}/matches/next/${pageNumber}`,
  )) as AmericanFootball_AmericanFootballApi_FixturePage_Response
}

export async function fetchAmericanFootballMatchDetails(matchId: string) {
  return (await fetchAmericanFootballApi(
    `/american-football/match/${matchId}`,
  )) as AmericanFootball_AmericanFootballApi_Match_Response
}

export async function fetchAmericanFootballMatchIncidents(matchId: string) {
  return (await fetchAmericanFootballApi(
    `/american-football/match/${matchId}/incidents`,
  )) as Sofascore_EventIncidents_Response
}

export async function fetchAmericanFootballCurrentMatches(date: Date) {
  return (await fetchAmericanFootballApi(
    `/american-football/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as AmericanFootball_AmericanFootballApi_CategorySchedule_Response
}
