import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  NRL_RugbyAPI2_FixturePage_Response,
  NRL_RugbyAPI2_LeagueTotalStandings_Response,
  NRL_RugbyAPI2_Match_Response,
  NRL_RugbyAPI2_MatchIncidents_Response,
} from "@/types/nrl";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.NRL,
    );
  }
}

export async function fetchNRLLastMatches(
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/294/season/${seasonId}/matches/last/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as NRL_RugbyAPI2_FixturePage_Response;
}

export async function fetchNRLNextMatches(
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/294/season/${seasonId}/matches/next/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as NRL_RugbyAPI2_FixturePage_Response;
}

export async function fetchNRLStandings(seasonId: number) {
  const rawStandings = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/294/season/${seasonId}/standings/total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok) {
    return null;
  }

  updateQuota(rawStandings);

  return (await rawStandings.json()) as NRL_RugbyAPI2_LeagueTotalStandings_Response;
}

export async function fetchNRLMatchDetails(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NRL_BASEURL}/rugby/match/${matchId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as NRL_RugbyAPI2_Match_Response;
}

export async function fetchNRLMatchIncidents(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NRL_BASEURL}/rugby/match/${matchId}/incidents`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as NRL_RugbyAPI2_MatchIncidents_Response;
}
