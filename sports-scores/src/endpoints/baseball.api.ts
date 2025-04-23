import { handleAPIErrors } from "@/lib/projUtils";
import { BaseballGame, BaseballResponse } from "@/types/baseball";
import { APISportsStatusDetails } from "@/types/misc";

const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
  // next: { revalidate: REVALIDATE },
  //  cache: 'no-store'
};

export async function fetchBaseballFixtures(season: number) {
  const rawFixtures = await fetch(
    `${process.env.BASEBALL_BASEURL}/games?season=${season}&league=1`,
    fetchOptions,
  );

  let fixtures = (await rawFixtures.json()) as BaseballResponse<BaseballGame>;
  if (fixtures.response.length === 0) {
    return handleAPIErrors(fixtures);
  }

  return fixtures.response;
}

export async function fetchBaseballGame(gameId: number) {
  const rawGame = await fetch(
    `${process.env.BASEBALL_BASEURL}/games?id=${gameId}`,
    fetchOptions,
  );

  let game = (await rawGame.json()) as BaseballResponse<BaseballGame>;
  if (game.response.length === 0) {
    return handleAPIErrors(game);
  }

  return game.response[0];
}

export async function fetchBaseballStatus() {
  const rawStatus = await fetch(
    `${process.env.BASEBALL_BASEURL}/status`,
    fetchOptions,
  );

  let status = await rawStatus.json();
  if (status.response.length === 0) {
    return handleAPIErrors(status);
  }

  return status.response as APISportsStatusDetails;
}

export async function fetchBaseballStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.BASEBALL_BASEURL}/standings?season=${season}&league=1`,
    fetchOptions,
  );

  let standings = await rawStandings.json(); // as AFLResponse<AFLStanding>;
  // return standings.response;
}
