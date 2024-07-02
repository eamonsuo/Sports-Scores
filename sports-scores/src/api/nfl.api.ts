import { SPORT } from "@/lib/constants";

const REVALIDATE = 15; //TODO: change for deployment
const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
  next: { revalidate: REVALIDATE },
};

export async function fetchNFLFixtures(season: string) {
  const rawFixtures = await fetch(
    `${process.env.NFL_BASEURL}/games?season=${season}&league=1`,
    fetchOptions,
  );

  let fixtures = (await rawFixtures.json()) as NFLGamesResponse<NFLGame>;
  return fixtures.response;
}

export async function fetchNFLGame(gameId: number) {
  const rawGame = await fetch(
    `${process.env.NFL_BASEURL}/games?id=${gameId}`,
    fetchOptions,
  );

  let game = (await rawGame.json()) as NFLGamesResponse<NFLGame>;
  return game.response[0];
}

export async function fetchNFLStatus() {
  const rawStatus = await fetch(
    `${process.env.NFL_BASEURL}/status`,
    fetchOptions,
  );

  let status = await rawStatus.json();
  return status.response as APISportsStatusDetails;
}

export async function fetchNFLStandings(season: string) {
  const rawStandings = await fetch(
    `${process.env.NFL_BASEURL}/standings?season=${season}&league=1`,
    fetchOptions,
  );

  let standings = (await rawStandings.json()) as NFLStandingsResponse;
  return standings.response;
}
/*
export async function fetchNFLGameQuarters(gameId: number) {
  const rawQuarters = await fetch(
    `${process.env.NFL_BASEURL}/games/quarters?id=${gameId}`,
    fetchOptions,
  );

  let quarters =
    (await rawQuarters.json()) as //NFLGamesResponse<NFLGameQuarters>;
  return quarters.response[0];
}

export async function fetchNFLGameEvents(gameId: number) {
  const rawEvents = await fetch(
    `${process.env.NFL_BASEURL}/games/events?id=${gameId}`,
    fetchOptions,
  );

  let events = (await rawEvents.json()) as //NFLGamesResponse<NFLGameEvents>;
  return events.response[0];
}




*/
