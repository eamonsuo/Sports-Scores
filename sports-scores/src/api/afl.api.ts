import { REVALIDATE } from "@/lib/constants";
import {
  AFLGame,
  AFLGameEvents,
  AFLGameQuarters,
  AFLResponse,
  AFLStanding,
} from "@/types/afl";
import { APISportsStatusDetails } from "@/types/misc";

const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

export async function fetchAFLFixtures(season: number, revalidate: number = 0) {
  const rawFixtures = await fetch(
    `${process.env.AFL_BASEURL}/games?season=${season}&league=1`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let fixtures = (await rawFixtures.json()) as AFLResponse<AFLGame>;

  return fixtures.response;
}

export async function fetchAFLGame(gameId: number, revalidate: number = 0) {
  const rawGame = await fetch(`${process.env.AFL_BASEURL}/games?id=${gameId}`, {
    headers: reqHeaders,
    next: { revalidate: revalidate },
  });

  let game = (await rawGame.json()) as AFLResponse<AFLGame>;
  return game.response[0];
}

export async function fetchAFLGameQuarters(
  gameId: number,
  revalidate: number = 0,
) {
  const rawQuarters = await fetch(
    `${process.env.AFL_BASEURL}/games/quarters?id=${gameId}`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let quarters = (await rawQuarters.json()) as AFLResponse<AFLGameQuarters>;
  return quarters.response[0];
}

export async function fetchAFLGameEvents(
  gameId: number,
  revalidate: number = 0,
) {
  const rawEvents = await fetch(
    `${process.env.AFL_BASEURL}/games/events?id=${gameId}`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let events = (await rawEvents.json()) as AFLResponse<AFLGameEvents>;
  return events.response[0];
}

export async function fetchAFLStatus(revalidate: number = 0) {
  const rawStatus = await fetch(`${process.env.AFL_BASEURL}/status`, {
    headers: reqHeaders,
    next: { revalidate: revalidate },
  });

  let status = await rawStatus.json();
  return status.response as APISportsStatusDetails;
}

export async function fetchAFLStandings(
  season: number,
  revalidate: number = 0,
) {
  const rawStandings = await fetch(
    `${process.env.AFL_BASEURL}/standings?season=${season}&league=1`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let standings = (await rawStandings.json()) as AFLResponse<AFLStanding>;
  return standings.response;
}
