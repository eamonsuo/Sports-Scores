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

export async function fetchAFLFixtures(
  season: number,
  revalidate: number = REVALIDATE,
) {
  const rawFixtures = await fetch(
    `${process.env.AFL_BASEURL}/games?season=${season}&league=1`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let fixtures = (await rawFixtures.json()) as AFLResponse<AFLGame>;
  if (fixtures.response.length === 0) {
    return null;
  }

  return fixtures.response;
}

export async function fetchAFLGame(
  gameId: number,
  revalidate: number = REVALIDATE,
) {
  const rawGame = await fetch(`${process.env.AFL_BASEURL}/games?id=${gameId}`, {
    headers: reqHeaders,
    next: { revalidate: revalidate },
  });

  let game = (await rawGame.json()) as AFLResponse<AFLGame>;
  if (game.response.length === 0) {
    return null;
  }

  return game.response[0];
}

export async function fetchAFLGameQuarters(
  gameId: number,
  revalidate: number = REVALIDATE,
) {
  const rawQuarters = await fetch(
    `${process.env.AFL_BASEURL}/games/quarters?id=${gameId}`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let quarters = (await rawQuarters.json()) as AFLResponse<AFLGameQuarters>;
  if (quarters.response.length === 0) {
    return null;
  }

  return quarters.response[0];
}

export async function fetchAFLGameEvents(
  gameId: number,
  revalidate: number = REVALIDATE,
) {
  const rawEvents = await fetch(
    `${process.env.AFL_BASEURL}/games/events?id=${gameId}`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let events = (await rawEvents.json()) as AFLResponse<AFLGameEvents>;
  if (events.response.length === 0) {
    return null;
  }

  return events.response[0];
}

export async function fetchAFLStatus(revalidate: number = REVALIDATE) {
  const rawStatus = await fetch(`${process.env.AFL_BASEURL}/status`, {
    headers: reqHeaders,
    next: { revalidate: revalidate },
  });

  let status = await rawStatus.json();
  if (status.response.length === 0) {
    return null;
  }

  return status.response as APISportsStatusDetails;
}

export async function fetchAFLStandings(
  season: number,
  revalidate: number = REVALIDATE,
) {
  const rawStandings = await fetch(
    `${process.env.AFL_BASEURL}/standings?season=${season}&league=1`,
    {
      headers: reqHeaders,
      next: { revalidate: revalidate },
    },
  );

  let standings = (await rawStandings.json()) as AFLResponse<AFLStanding>;
  if (standings.response.length === 0) {
    return null;
  }

  return standings.response;
}
