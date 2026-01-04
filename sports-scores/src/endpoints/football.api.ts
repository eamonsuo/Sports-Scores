import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  Football_FootApi_FixturePage_Response,
  Football_FootApi_LeagueCupTrees_Response,
  Football_FootApi_LeagueTotalStandings_Response,
  Football_FootApi_Match_Response,
  Football_FootApi_MatchIncidents_Response,
  Football_FootApi_MatchSchedules_Response,
} from "@/types/football";
import { SPORT } from "@/types/misc";

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
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Football_FootApi_FixturePage_Response;
}

export async function fetchFootballNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Football_FootApi_FixturePage_Response;
}

export async function fetchFootballStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Football_FootApi_LeagueTotalStandings_Response;
}

export async function fetchFootballMatchDetails(matchId: number) {
  return (await fetchFootballApi(
    `/match/${matchId}`,
  )) as Football_FootApi_Match_Response;
}

export async function fetchFootballMatchIncidents(matchId: number) {
  return (await fetchFootballApi(
    `/match/${matchId}/incidents`,
  )) as Football_FootApi_MatchIncidents_Response;
}

export async function fetchFootballCurrentMatches(date: Date) {
  return (await fetchFootballApi(
    `/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Football_FootApi_MatchSchedules_Response;
}

export async function fetchFootballTeamLastMatches(
  teamId: number,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Football_FootApi_FixturePage_Response;
}

export async function fetchFootballTeamNextMatches(
  teamId: number,
  pageNumber: number = 0,
) {
  return (await fetchFootballApi(
    `/team/${teamId}/matches/next/${pageNumber}`,
  )) as Football_FootApi_FixturePage_Response;
}

export async function fetchFootballCupTrees(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchFootballApi(
    `/tournament/${tournamentId}/season/${seasonId}/cuptrees`,
  )) as Football_FootApi_LeagueCupTrees_Response;
}
