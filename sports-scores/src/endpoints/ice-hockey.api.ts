import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  IceHockey_IceHockeyApi2_CategorySchedules_Response,
  IceHockey_IceHockeyApi2_FixturePage_Response,
  IceHockey_IceHockeyApi2_LeagueTotalStandings_Response,
  IceHockey_IceHockeyApi2_Match_Response,
  IceHockey_IceHockeyApi2_MatchIncidents_Response,
} from "@/types/ice-hockey";
import { SPORT } from "@/types/misc";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.ICE_HOCKEY,
    );
  }
}

async function fetchIceHockeyApi(endpoint: string) {
  const url = process.env.ICE_HOCKEY_BASEURL + endpoint;
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

export async function fetchIceHockeyLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as IceHockey_IceHockeyApi2_FixturePage_Response;
}

export async function fetchIceHockeyNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as IceHockey_IceHockeyApi2_FixturePage_Response;
}

export async function fetchIceHockeyStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as IceHockey_IceHockeyApi2_LeagueTotalStandings_Response;
}

export async function fetchIceHockeyMatchDetails(matchId: number) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/match/${matchId}`,
  )) as IceHockey_IceHockeyApi2_Match_Response;
}

export async function fetchIceHockeyMatchIncidents(matchId: number) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/match/${matchId}/incidents`,
  )) as IceHockey_IceHockeyApi2_MatchIncidents_Response;
}

export async function fetchIceHockeyMatchesByDate(date: Date) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as IceHockey_IceHockeyApi2_CategorySchedules_Response;
}
