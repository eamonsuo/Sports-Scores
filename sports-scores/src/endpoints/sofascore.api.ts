import {
  Sofascore_FixturePage_Response,
  Sofascore_LeagueTotalStandings_Response,
  Sofascore_Match_Response,
  Sofascore_MatchIncidents_Response,
} from "@/types/sofascore.api";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

export async function fetchTournamentLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.SOFASCORE_API_BASEURL}/tournaments/get-last-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok) {
    return null;
  }

  return (await rawMatches.json()) as Sofascore_FixturePage_Response;
}

export async function fetchTournamentNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.SOFASCORE_API_BASEURL}/tournaments/get-next-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok) {
    return null;
  }

  return (await rawMatches.json()) as Sofascore_FixturePage_Response;
}

export async function fetchTournamentStandings(
  tournamentId: number,
  seasonId: number,
) {
  const rawStandings = await fetch(
    `${process.env.SOFASCORE_API_BASEURL}/tournaments/get-standings?tournamentId=${tournamentId}&seasonId=${seasonId}&type=total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok) {
    return null;
  }

  return (await rawStandings.json()) as Sofascore_LeagueTotalStandings_Response;
}

export async function fetchMatchDetails(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.SOFASCORE_API_BASEURL}/matches/detail?matchId=${matchId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok) {
    return null;
  }

  return (await rawMatch.json()) as Sofascore_Match_Response;
}

export async function fetchMatchIncidents(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.SOFASCORE_API_BASEURL}/matches/get-incidents?matchId=${matchId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  return (await rawMatch.json()) as Sofascore_MatchIncidents_Response;
}
