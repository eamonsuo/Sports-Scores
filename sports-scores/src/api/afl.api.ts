import {
  AFLGame,
  AFLGameEvents,
  AFLGameQuarters,
  AFLResponse,
  AFLStanding,
} from "@/types/afl";
import { APISportsStatusDetails } from "@/types/misc";

const REVALIDATE = 1500;
const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
  next: { revalidate: REVALIDATE },
};

export async function fetchAFLFixtures(season: number) {
  const rawFixtures = await fetch(
    `${process.env.AFL_BASEURL}/games?season=${season}&league=1`,
    fetchOptions,
  );

  let fixtures = (await rawFixtures.json()) as AFLResponse<AFLGame>;
  return fixtures.response;
}

export async function fetchAFLGame(gameId: number) {
  const rawGame = await fetch(
    `${process.env.AFL_BASEURL}/games?id=${gameId}`,
    fetchOptions,
  );

  let game = (await rawGame.json()) as AFLResponse<AFLGame>;
  return game.response[0];
}

export async function fetchAFLGameQuarters(gameId: number) {
  const rawQuarters = await fetch(
    `${process.env.AFL_BASEURL}/games/quarters?id=${gameId}`,
    fetchOptions,
  );

  let quarters = (await rawQuarters.json()) as AFLResponse<AFLGameQuarters>;
  return quarters.response[0];
}

export async function fetchAFLGameEvents(gameId: number) {
  const rawEvents = await fetch(
    `${process.env.AFL_BASEURL}/games/events?id=${gameId}`,
    fetchOptions,
  );

  let events = (await rawEvents.json()) as AFLResponse<AFLGameEvents>;
  return events.response[0];
}

export async function fetchAFLStatus() {
  const rawStatus = await fetch(
    `${process.env.AFL_BASEURL}/status`,
    fetchOptions,
  );

  let status = await rawStatus.json();
  return status.response as APISportsStatusDetails;
}

export async function fetchAFLStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.AFL_BASEURL}/standings?season=${season}&league=1`,
    fetchOptions,
  );

  let standings = (await rawStandings.json()) as AFLResponse<AFLStanding>;
  return standings.response;
}
