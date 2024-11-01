import { handleAPIErrors } from "@/lib/utils";
import { APISportsStatusDetails } from "@/types/misc";
import { NFLGame, NFLGameEvents, NFLResponse, NFLStanding } from "@/types/nfl";

const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
  // next: { revalidate: REVALIDATE },
};

export async function fetchNFLFixtures(season: number) {
  const rawFixtures = await fetch(
    `${process.env.NFL_BASEURL}/games?season=${season}&league=1`,
    fetchOptions,
  );

  let fixtures = (await rawFixtures.json()) as NFLResponse<NFLGame>;
  if (fixtures.response.length === 0) {
    return handleAPIErrors(fixtures);
  }

  return fixtures.response;
}

export async function fetchNFLGame(gameId: number) {
  const rawGame = await fetch(
    `${process.env.NFL_BASEURL}/games?id=${gameId}`,
    fetchOptions,
  );

  let game = (await rawGame.json()) as NFLResponse<NFLGame>;
  if (game.response.length === 0) {
    return handleAPIErrors(game);
  }

  return game.response[0];
}

export async function fetchNFLStatus() {
  const rawStatus = await fetch(
    `${process.env.NFL_BASEURL}/status`,
    fetchOptions,
  );

  let status = await rawStatus.json();
  if (status.response.length === 0) {
    return handleAPIErrors(status);
  }

  return status.response as APISportsStatusDetails;
}

export async function fetchNFLStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.NFL_BASEURL}/standings?season=${season}&league=1`,
    fetchOptions,
  );

  let standings = (await rawStandings.json()) as NFLResponse<NFLStanding>;
  if (standings.response.length === 0) {
    return handleAPIErrors(standings);
  }

  return standings.response;
}

export async function fetchNFLGameEvents(gameId: number) {
  const rawEvents = await fetch(
    `${process.env.NFL_BASEURL}/games/events?id=${gameId}`,
    fetchOptions,
  );

  let events = (await rawEvents.json()) as NFLResponse<NFLGameEvents>;
  if (events.response.length === 0) {
    return handleAPIErrors(events);
  }

  return events.response;
}
