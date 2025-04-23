import {
  Cricket_LiveScoreAPI_LeaguesListPopular,
  Cricket_LiveScoreAPI_MatchesGetInnings,
  Cricket_LiveScoreAPI_MatchesGetScoreBoard,
  Cricket_LiveScoreAPI_MatchesListByDate,
  Cricket_LiveScoreAPI_MatchesListByLeague,
  Cricket_LiveScoreAPI_TeamDetails,
} from "@/types/cricket";

export let CRICKET_REQUEST_USED: number = 0;

const SERIES_IDS = [
  1445395, //Darwin T20 Series
  1445044, //T20 Spring Series (Pre WBBL)
  1442625, //WBBL
  1443056, //BBL
  1444468, //Sheffield Shield
  1444469, //One Day Cup (Men Domestic)
  1445042, //WNCL
];

const MY_TEAMS_IDs = [
  86103, // Australia Men
  86295, // QLD men
];

const reqHeaders = new Headers();
reqHeaders.append(
  "x-rapidapi-key",
  "8f40076dbdmsh686515dc9514f65p12718djsn07eae920cba7",
);

export async function fetchCricketMyTeams() {
  let matches: Cricket_LiveScoreAPI_TeamDetails[] = [];

  for (let i = 0; i < MY_TEAMS_IDs.length; i++) {
    const rawFixtures = await fetch(
      `https://livescore6.p.rapidapi.com/teams/detail?ID=${MY_TEAMS_IDs[i]}`,
      {
        headers: reqHeaders,
      },
    );

    if (rawFixtures.ok) {
      matches.push(
        (await rawFixtures.json()) as Cricket_LiveScoreAPI_TeamDetails,
      );
    }
  }

  if (matches.length <= 0) {
    return null;
  }

  // setRequestsUsed(rawFixtures);

  return matches;
}

export async function fetchCricketAllSeries() {
  const rawFixtures = await fetch(
    `https://livescore6.p.rapidapi.com/leagues/v2/list-popular?Category=cricket`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawFixtures.ok) {
    return null;
  }

  setRequestsUsed(rawFixtures);

  return (await rawFixtures.json()) as Cricket_LiveScoreAPI_LeaguesListPopular;
}

export async function fetchCricketCurrentMatches() {
  let curDate = new Date();
  let month = curDate.getMonth() + 1;
  let monthStr = month < 10 ? "0" + month : month;
  let day = curDate.getDate();
  let dayStr = day < 10 ? "0" + day : day;

  const rawFixtures = await fetch(
    `https://livescore6.p.rapidapi.com/matches/v2/list-by-date?Category=cricket&Date=${curDate.getFullYear()}${monthStr}${dayStr}&Timezone=10`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawFixtures.ok) {
    return null;
  }

  setRequestsUsed(rawFixtures);

  return (await rawFixtures.json()) as Cricket_LiveScoreAPI_MatchesListByDate;
}

export async function fetchCricketMatchInnings(id: number) {
  const rawInnings = await fetch(
    `https://livescore6.p.rapidapi.com/matches/v2/get-innings?Category=cricket&Eid=${id}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawInnings.ok) {
    return null;
  }

  setRequestsUsed(rawInnings);

  return (await rawInnings.json()) as Cricket_LiveScoreAPI_MatchesGetInnings;
}

export async function fetchCricketMatchDetails(id: number) {
  const rawMatch = await fetch(
    `https://livescore6.p.rapidapi.com/matches/v2/get-scoreboard?Category=cricket&Eid=${id}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawMatch.ok) {
    return null;
  }

  setRequestsUsed(rawMatch);

  return (await rawMatch.json()) as Cricket_LiveScoreAPI_MatchesGetScoreBoard;
}

export async function fetchCricketSeriesMatches(ccd: string, scd: string) {
  const rawFixtures = await fetch(
    `https://livescore6.p.rapidapi.com/matches/v2/list-by-league?Category=cricket&Ccd=${ccd}&Scd=${scd}&Timezone=10`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawFixtures.ok) {
    return null;
  }

  setRequestsUsed(rawFixtures);

  return (await rawFixtures.json()) as Cricket_LiveScoreAPI_MatchesListByLeague;
}

export async function fetchCricketSeriesStandings(url: string) {}

function setRequestsUsed(apiResponse: Response) {
  var requestsRemain = apiResponse.headers.get(
    "x-ratelimit-requests-remaining",
  );
  var requestsTotal = apiResponse.headers.get("x-ratelimit-requests-limit");

  if (requestsRemain !== null && requestsTotal !== null) {
    CRICKET_REQUEST_USED =
      (1 - Number(requestsRemain) / Number(requestsTotal)) * 100;
  }
}
