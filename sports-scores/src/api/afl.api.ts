import { APICALLS, SPORT } from "@/lib/constants";
import { setAFLMatchSummary } from "../lib/utils";
import { NextResponse } from "next/server";

const REVALIDATE = 10000; //TODO: change for deployment

export async function fetchAflData(type: APISettings) {
  const reqHeaders = new Headers();
  reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

  const fetchOptions = {
    headers: reqHeaders,
    next: { revalidate: REVALIDATE },
  };

  let returnValue;

  switch (type) {
    case APICALLS.FIXTURES:
      const rawFixtures = await fetch(
        `${process.env.AFL_BASEURL}/games?season=2024&league=1`,
        fetchOptions
      );

      returnValue = (await rawFixtures.json()) as APISportsAFLGames;
      return mapAflFixtureFields(returnValue.response);
    case APICALLS.STATUS:
      const rawStatus = await fetch(
        `${process.env.AFL_BASEURL}/status`,
        fetchOptions
      );

      returnValue = await rawStatus.json();
      return returnValue.response as APISportsStatus;
    case APICALLS.STANDINGS:
      const rawStandings = await fetch(
        `${process.env.AFL_BASEURL}/standings?season=2024&league=1`,
        fetchOptions
      );

      returnValue = await rawStandings.json();
      return returnValue;
  }

  return {};
}

function mapAflFixtureFields(matches: APISportsMatchAFL[]) {
  return matches.map((item: APISportsMatchAFL) => ({
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
