import {
  NRL_RugbyAPI2_FixturePage_Response,
  NRL_RugbyAPI2_LeagueTotalStandings_Response,
  NRL_RugbyAPI2_Match_Response,
  NRL_RugbyAPI2_MatchIncidents_Response,
} from "@/types/nrl";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

export async function fetchNRLLastMatches(
  season: number,
  pageNumber: number = 0,
) {
  let seasonId = season == 2025 ? 69277 : 56749; //If not 2025 then 2024 season
  const rawMatches = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/294/season/${seasonId}/matches/last/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok) {
    return null;
  }

  return (await rawMatches.json()) as NRL_RugbyAPI2_FixturePage_Response;
}

export async function fetchNRLNextMatches(
  season: number,
  pageNumber: number = 0,
) {
  let seasonId = season == 2025 ? 69277 : 39630;
  const rawMatches = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/294/season/${seasonId}/matches/next/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok) {
    return null;
  }

  return (await rawMatches.json()) as NRL_RugbyAPI2_FixturePage_Response;
}

export async function fetchNRLStandings(season: number) {
  let seasonId = season == 2025 ? 69277 : 39630;
  const rawStandings = await fetch(
    `${process.env.NRL_BASEURL}/rugby/tournament/294/season/${seasonId}/standings/total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok) {
    return null;
  }

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

  return (await rawMatch.json()) as NRL_RugbyAPI2_MatchIncidents_Response;
}
