import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  Baseball_BaseballApi_FixturePage_Response,
  Baseball_BaseballApi_LeagueTotalStandings_Response,
  Baseball_BaseballApi_Match_Response,
  Baseball_BaseballApi_MatchSchedules_Response,
} from "@/types/baseball";
import { SPORT } from "@/types/misc";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.BASEBALL,
    );
  }
}

async function fetchBaseballApi(endpoint: string) {
  const url = process.env.BASEBALL_BASEURL + endpoint;
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

export async function fetchBaseballLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchBaseballApi(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Baseball_BaseballApi_FixturePage_Response;
}

export async function fetchBaseballNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchBaseballApi(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Baseball_BaseballApi_FixturePage_Response;
}

export async function fetchBaseballStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchBaseballApi(
    `/baseball/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Baseball_BaseballApi_LeagueTotalStandings_Response;
}

export async function fetchBaseballMatchDetails(matchId: number) {
  return (await fetchBaseballApi(
    `/baseball/match/${matchId}`,
  )) as Baseball_BaseballApi_Match_Response;
}

// export async function fetchBaseballMatchIncidents(matchId: number) {
//   return (await fetchBaseballApi(
//     `/match/${matchId}/incidents`,
//   )) as Baseball_BaseballApi_MatchIncidents_Response;
// }

export async function fetchBaseballCurrentMatches(date: Date) {
  return (await fetchBaseballApi(
    `/baseball/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Baseball_BaseballApi_MatchSchedules_Response;
}
