import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.AUSSIE_RULES,
    );
  }
}

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

  updateQuota(rawMatches);

  return (await rawMatches.json()) as Sofascore_EventPage_Response;
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

  updateQuota(rawMatches);

  return (await rawMatches.json()) as Sofascore_EventPage_Response;
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

  updateQuota(rawStandings);

  return (await rawStandings.json()) as Sofascore_TotalStandings_Response;
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

  updateQuota(rawMatch);

  return (await rawMatch.json()) as Sofascore_Event_Response;
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

  updateQuota(rawMatch);

  return (await rawMatch.json()) as Sofascore_EventIncidents_Response;
}

export async function fetchScheduledEvents(categoryId: number, date?: string) {
  // Date must be formatted as yyyy-mm-dd
  const rawMatch = await fetch(
    `${process.env.SOFASCORE_API_BASEURL}/tournaments/get-scheduled-events?categoryId=${categoryId}${date ? `&date=${date}` : ""}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as Sofascore_Events_Response;
}
