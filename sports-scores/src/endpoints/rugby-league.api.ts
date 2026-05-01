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
      SPORT.RUGBY_LEAGUE,
    );
  }
}

async function fetchRugbyLeagueApi(endpoint: string) {
  const url = process.env.NRL_BASEURL + endpoint;
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

export async function fetchRugbyLeagueLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchRugbyLeagueNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchRugbyLeagueTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchRugbyLeagueTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/team/${teamId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchRugbyLeagueStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchRugbyLeagueApi(
    `/rugby/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response;
}

export async function fetchRugbyLeagueMatchDetails(matchId: string) {
  return (await fetchRugbyLeagueApi(
    `/rugby/match/${matchId}`,
  )) as Sofascore_Event_Response;
}

export async function fetchRugbyLeagueMatchIncidents(matchId: string) {
  return (await fetchRugbyLeagueApi(
    `/rugby/match/${matchId}/incidents`,
  )) as Sofascore_EventIncidents_Response;
}

export async function fetchRugbyLeagueMatchesByDate(date: Date) {
  return (await fetchRugbyLeagueApi(
    `/rugby/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Sofascore_Events_Response;
}
