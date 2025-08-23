import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  AmericanFootball_AmericanFootballApi_CategorySchedule_Response,
  AmericanFootball_AmericanFootballApi_FixturePage_Response,
  AmericanFootball_AmericanFootballApi_LeagueTotalStandings_Response,
  AmericanFootball_AmericanFootballApi_Match_Response,
  AmericanFootball_AmericanFootballApi_MatchIncidents_Response,
} from "@/types/american-football";
import { SPORT } from "@/types/misc";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", `${process.env.RapidAPIKey}`);

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.AMERICAN_FOOTBALL,
    );
  }
}

export async function fetchAmericanFootballLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as AmericanFootball_AmericanFootballApi_FixturePage_Response;
}

export async function fetchAmericanFootballNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as AmericanFootball_AmericanFootballApi_FixturePage_Response;
}

export async function fetchAmericanFootballStandings(
  tournamentId: number,
  seasonId: number,
) {
  const rawStandings = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/${tournamentId}/season/${seasonId}/standings/total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok || rawStandings.status === 204) {
    return null;
  }

  updateQuota(rawStandings);

  return (await rawStandings.json()) as AmericanFootball_AmericanFootballApi_LeagueTotalStandings_Response;
}

export async function fetchAmericanFootballMatchDetails(matchId: number) {
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

  return (await rawMatch.json()) as AmericanFootball_AmericanFootballApi_Match_Response;
}

export async function fetchAmericanFootballMatchIncidents(matchId: number) {
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

  return (await rawMatch.json()) as AmericanFootball_AmericanFootballApi_MatchIncidents_Response;
}

export async function fetchAmericanFootballCurrentMatches(
  date: "TODAY" | "YESTERDAY" | "TOMORROW",
  categoryId: number,
) {
  let curDate = new Date();
  if (date === "YESTERDAY") {
    curDate.setDate(curDate.getDate() - 1);
  } else if (date === "TOMORROW") {
    curDate.setDate(curDate.getDate() + 1);
  }

  const rawFixtures = await fetch(
    `${process.env.NFL_BASEURL}/american-football/category/${categoryId}/events/${curDate.getDate()}/${curDate.getMonth() + 1}/${curDate.getFullYear()}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawFixtures.ok || rawFixtures.status === 204) {
    return null;
  }

  updateQuota(rawFixtures);

  return (await rawFixtures.json()) as AmericanFootball_AmericanFootballApi_CategorySchedule_Response;
}
