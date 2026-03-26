import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  Cricket_LiveScoreAPI_LeaguesListPopular,
  Cricket_LiveScoreAPI_MatchesGetInnings,
  Cricket_LiveScoreAPI_MatchesGetScoreBoard,
  Cricket_LiveScoreAPI_MatchesListByDate,
  Cricket_LiveScoreAPI_MatchesListByLeague,
  Cricket_LiveScoreAPI_TeamDetails,
} from "@/types/cricket";
import { SPORT } from "@/types/misc";
import { Sofascore_Events_Response } from "@/types/sofascore";
import { format } from "date-fns/format";

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

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.CRICKET,
    );
  }
}

async function fetchCricketApi(endpoint: string) {
  const url = process.env.CRICKET_BASEURL + endpoint;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  });

  if (!res.ok) {
    return null;
  }

  updateQuota(res);

  return res.json();
}

export async function fetchCricketMyTeams() {
  let matches: Cricket_LiveScoreAPI_TeamDetails[] = [];

  for (const teamId of MY_TEAMS_IDs) {
    const result = await fetchCricketApi(`/teams/detail?ID=${teamId}`);
    if (result) {
      matches.push(result as Cricket_LiveScoreAPI_TeamDetails);
    }
  }

  if (matches.length <= 0) {
    return null;
  }

  return matches;
}

export async function fetchCricketAllSeries() {
  return (await fetchCricketApi(
    `/leagues/v2/list-popular?Category=cricket`,
  )) as Cricket_LiveScoreAPI_LeaguesListPopular;
}

export async function fetchCricketMatchesByDateLiveScore(date: Date) {
  return (await fetchCricketApi(
    `/matches/v2/list-by-date?Category=cricket&Date=${format(date, "yyyyMMdd")}&Timezone=10`,
  )) as Cricket_LiveScoreAPI_MatchesListByDate;
}

export async function fetchCricketMatchesByDateSofascore(date: Date) {
  const rawFixtures = await fetch(
    `https://cricketapi21.p.rapidapi.com/api/cricket/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
      },
    },
  );
  if (!rawFixtures.ok) {
    return null;
  }
  updateQuota(rawFixtures);
  return (await rawFixtures.json()) as Sofascore_Events_Response;
}

export async function fetchCricketMatchInnings(id: number) {
  return (await fetchCricketApi(
    `/matches/v2/get-innings?Category=cricket&Eid=${id}`,
  )) as Cricket_LiveScoreAPI_MatchesGetInnings;
}

export async function fetchCricketMatchDetails(id: number) {
  return (await fetchCricketApi(
    `/matches/v2/get-scoreboard?Category=cricket&Eid=${id}`,
  )) as Cricket_LiveScoreAPI_MatchesGetScoreBoard;
}

export async function fetchCricketSeriesMatches(ccd: string, scd: string) {
  return (await fetchCricketApi(
    `/matches/v2/list-by-league?Category=cricket&Ccd=${ccd}&Scd=${scd}`,
  )) as Cricket_LiveScoreAPI_MatchesListByLeague;
}

export async function fetchCricketSeriesStandings(url: string) {}
