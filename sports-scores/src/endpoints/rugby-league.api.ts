// ...existing code...
// This file was renamed from nrl.api.ts
import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  RugbyLeague_RugbyAPI2_FixturePage_Response,
  RugbyLeague_RugbyAPI2_LeagueTotalStandings_Response,
  RugbyLeague_RugbyAPI2_Match_Response,
  RugbyLeague_RugbyAPI2_MatchIncidents_Response,
} from "@/types/rugby-league";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

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

export async function fetchRugbyLeagueLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as RugbyLeague_RugbyAPI2_FixturePage_Response;
}

export async function fetchRugbyLeagueNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as RugbyLeague_RugbyAPI2_FixturePage_Response;
}

export async function fetchRugbyLeagueStandings(
  tournamentId: number,
  seasonId: number,
) {
  const rawStandings = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/${tournamentId}/season/${seasonId}/standings/total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok || rawStandings.status === 204) {
    return null;
  }

  updateQuota(rawStandings);

  return (await rawStandings.json()) as RugbyLeague_RugbyAPI2_LeagueTotalStandings_Response;
}

export async function fetchRugbyLeagueMatchDetails(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NRL_BASEURL}/rugby/match/${matchId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as RugbyLeague_RugbyAPI2_Match_Response;
}

export async function fetchRugbyLeagueMatchIncidents(matchId: number) {
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

  return (await rawMatch.json()) as RugbyLeague_RugbyAPI2_MatchIncidents_Response;
}
