import { handleAPIErrors } from "@/lib/projUtils";
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

export async function fetchAFLFixtures(season: number) {
  const rawFixtures = await fetch(
    `${process.env.AFL_BASEURL}/games?season=${season}&league=1`,
    {
      headers: reqHeaders,
    },
  );

  let fixtures = (await rawFixtures.json()) as AFLResponse<AFLGame>;

  if (fixtures.response.length === 0) {
    return handleAPIErrors(fixtures);
  }

  return fixtures.response;
}

export async function fetchAFLGame(gameId: number) {
  const rawGame = await fetch(`${process.env.AFL_BASEURL}/games?id=${gameId}`, {
    headers: reqHeaders,
  });

  let game = (await rawGame.json()) as AFLResponse<AFLGame>;

  if (game.response.length === 0) {
    return handleAPIErrors(game);
  }

  return game.response[0];
}

export async function fetchAFLGameQuarters(gameId: number) {
  const rawQuarters = await fetch(
    `${process.env.AFL_BASEURL}/games/quarters?id=${gameId}`,
    {
      headers: reqHeaders,
    },
  );

  let quarters = (await rawQuarters.json()) as AFLResponse<AFLGameQuarters>;

  if (quarters.response.length === 0) {
    return handleAPIErrors(quarters);
  }

  return quarters.response[0];
}

export async function fetchAFLGameEvents(gameId: number) {
  const rawEvents = await fetch(
    `${process.env.AFL_BASEURL}/games/events?id=${gameId}`,
    {
      headers: reqHeaders,
    },
  );

  let events = (await rawEvents.json()) as AFLResponse<AFLGameEvents>;

  if (events.response.length === 0) {
    return handleAPIErrors(events);
  }

  return events.response[0];
}

export async function fetchAFLStatus() {
  const rawStatus = await fetch(`${process.env.AFL_BASEURL}/status`, {
    headers: reqHeaders,
  });

  let status = await rawStatus.json();

  if (status.response.length === 0) {
    return handleAPIErrors(status);
  }

  return status.response as APISportsStatusDetails;
}

export async function fetchAFLStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.AFL_BASEURL}/standings?season=${season}&league=1`,
    {
      headers: reqHeaders,
    },
  );

  let standings = (await rawStandings.json()) as AFLResponse<AFLStanding>;

  if (standings.response.length === 0) {
    return handleAPIErrors(standings);
  }

  return standings.response.filter((item) => item.games.played > 19); //TODO: Remove for 2025
}
