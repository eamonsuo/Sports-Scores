import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  AmericanFootball_AmericanFootballApi_CategorySchedule_Response,
  AmericanFootball_AmericanFootballApi_FixturePage_Response,
  AmericanFootball_AmericanFootballApi_LeagueTotalStandings_Response,
  AmericanFootball_AmericanFootballApi_Match_Response,
  AmericanFootball_AmericanFootballApi_MatchIncidents_Response,
} from "@/types/american-football";
import { SPORT } from "@/types/misc";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.AMERICAN_FOOTBALL,
    );
  }
}

async function fetchAmericanFootballApi(endpoint: string) {
  const url = process.env.NFL_BASEURL + endpoint;
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

export async function fetchAmericanFootballLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as AmericanFootball_AmericanFootballApi_FixturePage_Response;
}

export async function fetchAmericanFootballNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as AmericanFootball_AmericanFootballApi_FixturePage_Response;
}

export async function fetchAmericanFootballStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchAmericanFootballApi(
    `/american-football/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as AmericanFootball_AmericanFootballApi_LeagueTotalStandings_Response;
}

export async function fetchAmericanFootballMatchDetails(matchId: number) {
  return (await fetchAmericanFootballApi(
    `/american-football/match/${matchId}`,
  )) as AmericanFootball_AmericanFootballApi_Match_Response;
}

export async function fetchAmericanFootballMatchIncidents(matchId: number) {
  return (await fetchAmericanFootballApi(
    `/american-football/match/${matchId}/incidents`,
  )) as AmericanFootball_AmericanFootballApi_MatchIncidents_Response;
}

export async function fetchAmericanFootballCurrentMatches(date: Date) {
  return (await fetchAmericanFootballApi(
    `/american-football/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as AmericanFootball_AmericanFootballApi_CategorySchedule_Response;
}
