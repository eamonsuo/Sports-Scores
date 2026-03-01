import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  IceHockey_IceHockeyApi2_CategorySchedules_Response,
  IceHockey_IceHockeyApi2_FixturePage_Response,
  IceHockey_IceHockeyApi2_LeagueTotalStandings_Response,
  IceHockey_IceHockeyApi2_Match_Response,
  IceHockey_IceHockeyApi2_MatchIncidents_Response,
} from "@/types/ice-hockey";
import { SPORT } from "@/types/misc";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

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

export async function fetchIceHockeyLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NHL_BASEURL}/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as IceHockey_IceHockeyApi2_FixturePage_Response;
}

export async function fetchIceHockeyNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NHL_BASEURL}/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as IceHockey_IceHockeyApi2_FixturePage_Response;
}

export async function fetchIceHockeyStandings(
  tournamentId: number,
  seasonId: number,
) {
  const rawStandings = await fetch(
    `${process.env.NHL_BASEURL}/ice-hockey/tournament/${tournamentId}/season/${seasonId}/standings/total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok || rawStandings.status === 204) {
    return null;
  }

  updateQuota(rawStandings);

  return (await rawStandings.json()) as IceHockey_IceHockeyApi2_LeagueTotalStandings_Response;
}

export async function fetchIceHockeyMatchDetails(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NHL_BASEURL}/ice-hockey/match/${matchId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as IceHockey_IceHockeyApi2_Match_Response;
}

export async function fetchIceHockeyMatchIncidents(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NHL_BASEURL}/ice-hockey/match/${matchId}/incidents`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as IceHockey_IceHockeyApi2_MatchIncidents_Response;
}

export async function fetchIceHockeyMatchesByDate(date: Date) {
  const rawFixtures = await fetch(
    `${process.env.NHL_BASEURL}/ice-hockey/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawFixtures.ok || rawFixtures.status === 204) {
    return null;
  }

  updateQuota(rawFixtures);

  return (await rawFixtures.json()) as IceHockey_IceHockeyApi2_CategorySchedules_Response;
}
