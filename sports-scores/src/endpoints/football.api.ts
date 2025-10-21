// Free API Live Football Data - RapidAPI
// https://rapidapi.com/Creativesdev/api/free-api-live-football-data

import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

const BASE_URL = "https://free-api-live-football-data.p.rapidapi.com";

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
  const url = BASE_URL + endpoint;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  });

  if (!res.ok) {
    return null;
  }

  updateQuota(res);

  return res.json();
}

// Example endpoints
export async function getMajorLeagues() {
  return (await fetchFootballApi("/football-get-all-leagues")) as string[];
}

export async function getCountryLeagues() {
  return (await fetchFootballApi(
    "/football-get-all-leagues-with-countries",
  )) as string[];
}

export async function getLeagueById(id: string) {
  return fetchFootballApi("/leagues");
}

export async function fetchFootballFixturesByLeague(leagueId: string) {
  return (await fetchFootballApi(
    `/football-get-all-matches-by-league?leagueid=${leagueId}`,
  )) as FootballLive_AllLeagueFixtures_Response;
}

export async function getFixtureById(fixtureId: string) {
  return fetchFootballApi("/fixtures");
}

export async function fetchFootballStandingsByLeague(leagueId: string) {
  return (await fetchFootballApi(
    `/football-get-standing-all?leagueid=${leagueId}`,
  )) as FootballLive_Standings_Response;
}
