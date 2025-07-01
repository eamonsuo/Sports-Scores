import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  NFL_AmericanFootballApi_FixturePage_Response,
  NFL_AmericanFootballApi_LeagueTotalStandings_Response,
  NFL_AmericanFootballApi_Match_Response,
  NFL_AmericanFootballApi_MatchIncidents_Response,
} from "@/types/nfl";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", `${process.env.RapidAPIKey}`);

//unique tourn - 9464

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.NFL,
    );
  }
}

export async function fetchNFLLastMatches(
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/9464/season/${seasonId}/matches/last/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as NFL_AmericanFootballApi_FixturePage_Response;
}

export async function fetchNFLNextMatches(
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/9464/season/${seasonId}/matches/next/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as NFL_AmericanFootballApi_FixturePage_Response;
}

export async function fetchNFLStandings(seasonId: number) {
  const rawStandings = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/9464/season/${seasonId}/standings/total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok) {
    return null;
  }

  updateQuota(rawStandings);

  return (await rawStandings.json()) as NFL_AmericanFootballApi_LeagueTotalStandings_Response;
}

export async function fetchNFLMatchDetails(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NFL_BASEURL}/american-football/match/${matchId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as NFL_AmericanFootballApi_Match_Response;
}

export async function fetchNFLMatchIncidents(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NFL_BASEURL}/american-football/match/${matchId}/incidents`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as NFL_AmericanFootballApi_MatchIncidents_Response;
}
