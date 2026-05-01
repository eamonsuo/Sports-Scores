import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore";

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
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchIceHockeyNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchIceHockeyTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchIceHockeyTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/team/${teamId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchIceHockeyStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response;
}

export async function fetchIceHockeyMatchDetails(matchId: string) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/match/${matchId}`,
  )) as Sofascore_Event_Response;
}

export async function fetchIceHockeyMatchIncidents(matchId: string) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/match/${matchId}/incidents`,
  )) as Sofascore_EventIncidents_Response;
}

export async function fetchIceHockeyMatchesByDate(date: Date) {
  return (await fetchIceHockeyApi(
    `/ice-hockey/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Sofascore_Events_Response;
}
