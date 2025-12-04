import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  Basketball_BasketApi_FixturePage_Response,
  Basketball_BasketApi_LeagueTotalStandings_Response,
  Basketball_BasketApi_Match_Response,
  Basketball_BasketApi_MatchIncidents_Response,
  Basketball_BasketApi_MatchSchedules_Response,
} from "@/types/basketball";
import { SPORT } from "@/types/misc";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.BASKETBALL,
    );
  }
}

async function fetchBasketballApi(endpoint: string) {
  const url = process.env.BASKETBALL_BASEURL + endpoint;
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

export async function fetchBasketballLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchBasketballApi(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Basketball_BasketApi_FixturePage_Response;
}

export async function fetchBasketballNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchBasketballApi(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Basketball_BasketApi_FixturePage_Response;
}

export async function fetchBasketballStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchBasketballApi(
    `/basketball/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Basketball_BasketApi_LeagueTotalStandings_Response;
}

export async function fetchBasketballMatchDetails(matchId: number) {
  return (await fetchBasketballApi(
    `/basketball/match/${matchId}`,
  )) as Basketball_BasketApi_Match_Response;
}

export async function fetchBasketballMatchIncidents(matchId: number) {
  return (await fetchBasketballApi(
    `/match/${matchId}/incidents`,
  )) as Basketball_BasketApi_MatchIncidents_Response;
}

export async function fetchBasketballCurrentMatches(date: Date) {
  return (await fetchBasketballApi(
    `/basketball/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Basketball_BasketApi_MatchSchedules_Response;
}
