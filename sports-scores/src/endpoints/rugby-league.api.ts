import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  RugbyLeague_RugbyAPI2_CategorySchedules_Response,
  RugbyLeague_RugbyAPI2_FixturePage_Response,
  RugbyLeague_RugbyAPI2_LeagueTotalStandings_Response,
  RugbyLeague_RugbyAPI2_Match_Response,
  RugbyLeague_RugbyAPI2_MatchIncidents_Response,
} from "@/types/rugby-league";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.RUGBY_LEAGUE,
    );
  }
}

async function fetchRugbyLeagueApi(endpoint: string) {
  const url = process.env.NRL_BASEURL + endpoint;
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

export async function fetchRugbyLeagueLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as RugbyLeague_RugbyAPI2_FixturePage_Response;
}

export async function fetchRugbyLeagueNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as RugbyLeague_RugbyAPI2_FixturePage_Response;
}

export async function fetchRugbyLeagueStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as RugbyLeague_RugbyAPI2_LeagueTotalStandings_Response;
}

export async function fetchRugbyLeagueMatchDetails(matchId: number) {
  return (await fetchRugbyLeagueApi(
    `/rugby/match/${matchId}`,
  )) as RugbyLeague_RugbyAPI2_Match_Response;
}

export async function fetchRugbyLeagueMatchIncidents(matchId: number) {
  return (await fetchRugbyLeagueApi(
    `/rugby/match/${matchId}/incidents`,
  )) as RugbyLeague_RugbyAPI2_MatchIncidents_Response;
}

export async function fetchRugbyLeagueMatchesByDate(date: Date) {
  return (await fetchRugbyLeagueApi(
    `/rugby/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as RugbyLeague_RugbyAPI2_CategorySchedules_Response;
}
