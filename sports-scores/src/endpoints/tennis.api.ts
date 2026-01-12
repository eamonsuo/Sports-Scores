import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  Tennis_TennisApi_CupTrees_Response,
  Tennis_TennisApi_EventsByDate_Response,
  Tennis_TennisApi_FixturePage_Response,
  Tennis_TennisApi_MatchDetails_Response,
  Tennis_TennisApi_MatchStatistics_Response,
  Tennis_TennisApi_Rankings_Response,
  Tennis_TennisApi_TournamentRoundMatch_Response,
  Tennis_TennisApi_TournamentRounds_Response,
  Tennis_TennisApi_TournamentStandings_Response,
} from "@/types/tennis";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.TENNIS,
    );
  }
}

async function fetchTennisApi(endpoint: string) {
  const url = process.env.TENNIS_BASEURL + endpoint;
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

export async function fetchTennisTournamentRounds(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchTennisApi(
    `/tournament/${tournamentId}/season/${seasonId}/rounds`,
  )) as Tennis_TennisApi_TournamentRounds_Response;
}

export async function fetchTennisTournamentRoundMatches(
  tournamentId: number,
  seasonId: number,
  roundId: number,
  roundSlug: string,
) {
  return (await fetchTennisApi(
    `/tournament/${tournamentId}/season/${seasonId}/events/round/${roundId}/slug/${roundSlug}`,
  )) as Tennis_TennisApi_TournamentRoundMatch_Response;
}

export async function fetchTennisTournamentLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchTennisApi(
    `/tournament/${tournamentId}/season/${seasonId}/events/last/${pageNumber}`,
  )) as Tennis_TennisApi_FixturePage_Response;
}

export async function fetchTennisTournamentNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchTennisApi(
    `/tournament/${tournamentId}/season/${seasonId}/events/next/${pageNumber}`,
  )) as Tennis_TennisApi_FixturePage_Response;
}

export async function fetchTennisBracket(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchTennisApi(
    `/tournament/${tournamentId}/season/${seasonId}/cup-trees/old`,
  )) as Tennis_TennisApi_CupTrees_Response;
}

export async function fetchTennisTournamentStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchTennisApi(
    `/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Tennis_TennisApi_TournamentStandings_Response;
}

export async function fetchTennisMatchDetails(matchId: number) {
  return (await fetchTennisApi(
    `/event/${matchId}/`,
  )) as Tennis_TennisApi_MatchDetails_Response;
}

export async function fetchTennisMatchStatistics(matchId: number) {
  return (await fetchTennisApi(
    `/match/${matchId}/statistics`,
  )) as Tennis_TennisApi_MatchStatistics_Response;
}

export async function fetchTennisMatchesByDate(date: Date) {
  return (await fetchTennisApi(
    `/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Tennis_TennisApi_EventsByDate_Response;
}

export async function fetchTennisPlayerLastMatches(
  teamId: number,
  pageNumber: number = 0,
) {
  return (await fetchTennisApi(
    `/team/${teamId}/events/previous/${pageNumber}`,
  )) as Tennis_TennisApi_FixturePage_Response;
}

export async function fetchTennisPlayerNextMatches(
  teamId: number,
  pageNumber: number = 0,
) {
  return (await fetchTennisApi(
    `/team/${teamId}/events/next/${pageNumber}`,
  )) as Tennis_TennisApi_FixturePage_Response;
}

export async function fetchTennisWTARankings() {
  return (await fetchTennisApi(
    `/rankings/wta`,
  )) as Tennis_TennisApi_Rankings_Response;
}

export async function fetchTennisATPRankings() {
  return (await fetchTennisApi(
    `/rankings/atp`,
  )) as Tennis_TennisApi_Rankings_Response;
}
