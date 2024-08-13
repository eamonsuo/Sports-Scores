import { REVALIDATE } from "@/lib/constants";
import {
  F1Response,
  F1Session,
  F1SessionResults,
  F1DriverStandings,
  F1TeamStandings,
} from "@/types/f1";
import { APISportsStatusDetails } from "@/types/misc";

const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
  next: { revalidate: REVALIDATE },
};

export async function fetchF1Status() {
  const rawStatus = await fetch(
    `${process.env.F1_BASEURL}/status`,
    fetchOptions,
  );

  let status = await rawStatus.json();
  if (status.response.length === 0) {
    return null;
  }

  return status.response as APISportsStatusDetails;
}

export async function fetchAllF1Sessions(
  season: number,
  timezone: string = "UTC",
) {
  const rawSessions = await fetch(
    `${process.env.F1_BASEURL}/races?timezone=${timezone}&season=${season}`,
    fetchOptions,
  );

  let sessions = (await rawSessions.json()) as F1Response<F1Session>;
  if (sessions.response.length === 0) {
    return null;
  }

  return sessions.response;
}

export async function fetchF1Races(season: number, timezone: string = "UTC") {
  const rawRaces = await fetch(
    `${process.env.F1_BASEURL}/races?timezone=${timezone}&season=${season}&type=Race`,
    fetchOptions,
  );

  let races = (await rawRaces.json()) as F1Response<F1Session>;
  if (races.response.length === 0) {
    return null;
  }

  return races.response;
}

export async function fetchF1SessionResult(raceId: number) {
  const rawSessions = await fetch(
    `${process.env.F1_BASEURL}/rankings/races?race=${raceId}`,
    fetchOptions,
  );

  let results = (await rawSessions.json()) as F1Response<F1SessionResults>;
  if (results.response.length === 0) {
    return null;
  }

  return results.response;
}

export async function fetchF1DriverStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.F1_BASEURL}/rankings/drivers?season=${season}`,
    fetchOptions,
  );

  let standings = (await rawStandings.json()) as F1Response<F1DriverStandings>;
  if (standings.response.length === 0) {
    return null;
  }

  return standings.response;
}

export async function fetchF1TeamStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.F1_BASEURL}/rankings/teams?season=${season}`,
    fetchOptions,
  );

  let standings = (await rawStandings.json()) as F1Response<F1TeamStandings>;
  if (standings.response.length === 0) {
    return null;
  }

  return standings.response;
}
