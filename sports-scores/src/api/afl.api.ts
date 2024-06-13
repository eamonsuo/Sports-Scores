import { APICALLS, SPORT } from "@/lib/constants";
import { setAFLMatchSummary } from "../lib/utils";
import { NextResponse } from "next/server";

const REVALIDATE = 10000; //TODO: change for deployment
const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
  next: { revalidate: REVALIDATE },
};

export async function fetchAFLFixtures(season: string) {
  const rawFixtures = await fetch(
    `${process.env.AFL_BASEURL}/games?season=${season}&league=1`,
    fetchOptions
  );

  let fixtures = (await rawFixtures.json()) as AFLGamesResponse;
  return mapAflFixtureFields(fixtures.response);
}

export async function fetchAFLStatus() {
  const rawStatus = await fetch(
    `${process.env.AFL_BASEURL}/status`,
    fetchOptions
  );

  let status = await rawStatus.json();
  return status.response as APISportsStatusDetails;
}

export async function fetchAFLStandings(season: string) {
  const rawStandings = await fetch(
    `${process.env.AFL_BASEURL}/standings?season=${season}&league=1`,
    fetchOptions
  );

  let standings = (await rawStandings.json()) as AFLStandingsResponse;
  return standings.response;
}

function mapAflFixtureFields(matches: AFLGame[]) {
  return matches.map((item: AFLGame) => ({
    id: item.game.id,
    startDate: item.date,
    details: {
      matchDetails: {
        venue: item.venue,
        status: item.status.long,
        summary: setAFLMatchSummary(
          item.status.short,
          item.date,
          item.teams.home.name,
          item.scores.home.score,
          item.teams.away.name,
          item.scores.away.score
        ),
        otherDetail: item.round,
      },
      homeDetails: {
        img: item.teams.home.logo,
        score: item.scores.home.score.toString(),
        name: item.teams.home.name,
      },
      awayDetails: {
        img: item.teams.away.logo,
        score: item.scores.away.score.toString(),
        name: item.teams.away.name,
      },
    },
  }));
}
