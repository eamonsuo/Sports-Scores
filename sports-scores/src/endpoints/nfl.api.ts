import {
  NFL_AmericanFootballApi_FixturePage_Response,
  NFL_AmericanFootballApi_LeagueTotalStandings_Response,
  NFL_AmericanFootballApi_Match_Response,
  NFL_AmericanFootballApi_MatchIncidents_Response,
} from "@/types/nfl";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", `${process.env.RapidAPIKey}`);

//sesaon 24-25 - 60592
//unique tourn - 9464
//tourn regular - 41244

export async function fetchNFLLastMatches(
  season: number,
  pageNumber: number = 0,
) {
  let seasonId = season == 2025 ? 60592 : 60592; //24-25 only atm
  const rawMatches = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/9464/season/${seasonId}/matches/last/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  return (await rawMatches.json()) as NFL_AmericanFootballApi_FixturePage_Response;
}

export async function fetchNFLNextMatches(
  season: number,
  pageNumber: number = 0,
) {
  let seasonId = season == 2025 ? 60592 : 60592;
  const rawMatches = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/9464/season/${seasonId}/matches/next/${pageNumber}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  return (await rawMatches.json()) as NFL_AmericanFootballApi_FixturePage_Response;
}

export async function fetchNFLStandings(season: number) {
  let seasonId = season == 2025 ? 60592 : 60592;
  const rawStandings = await fetch(
    `${process.env.NFL_BASEURL}/american-football/tournament/9464/season/${seasonId}/standings/total`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStandings.ok) {
    return null;
  }

  return (await rawStandings.json()) as NFL_AmericanFootballApi_LeagueTotalStandings_Response;
}

export async function fetchNFLMatchDetails(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NFL_BASEURL}/american-football/match/${matchId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok) {
    return null;
  }

  return (await rawMatch.json()) as NFL_AmericanFootballApi_Match_Response;
}

export async function fetchNFLMatchIncidents(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NFL_BASEURL}/american-football/match/${matchId}/incidents`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  return (await rawMatch.json()) as NFL_AmericanFootballApi_MatchIncidents_Response;
}
