import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
  Sofascore_TournamentCupTrees_Response,
} from "@/types/sofascore";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.FOOTBALL,
    );
  }
}

async function fetchFootballApi(endpoint: string) {
  const url = process.env.FOOTBALL_BASEURL + endpoint;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  });

  if (!res.ok || res.status === 204) {
    return null;
  }

  updateQuota(res);

  return res.json();
}

export async function fetchFootballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchFootballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchFootballStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response;
}

export async function fetchFootballMatchDetails(matchId: string) {
  return (await fetchFootballApi(
    `/match/${matchId}`,
  )) as Sofascore_Event_Response;
}

export async function fetchFootballMatchIncidents(matchId: string) {
  return (await fetchFootballApi(
    `/match/${matchId}/incidents`,
  )) as Sofascore_EventIncidents_Response;
}

export async function fetchFootballMatchesByDate(date: Date) {
  return (await fetchFootballApi(
    `/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Sofascore_Events_Response;
}

export async function fetchFootballTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchFootballTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/team/${teamId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchFootballCupTrees(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/cuptrees`,
  )) as Sofascore_TournamentCupTrees_Response;
}
