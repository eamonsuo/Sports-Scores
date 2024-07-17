import {
  F1Response,
  F1Session,
  F1SessionResults,
  F1DriverStandings,
  F1TeamStandings,
} from "@/types/f1";
import { APISportsStatusDetails } from "@/types/misc";

const REVALIDATE = 1500;
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
  return sessions.response;
}

export async function fetchF1Races(season: number, timezone: string = "UTC") {
  const rawRaces = await fetch(
    `${process.env.F1_BASEURL}/races?timezone=${timezone}&season=${season}&type=Race`,
    fetchOptions,
  );

  let races = (await rawRaces.json()) as F1Response<F1Session>;
  return races.response;
}

export async function fetchF1SessionResult(raceId: number) {
  const rawSessions = await fetch(
    `${process.env.F1_BASEURL}/rankings/races?race=${raceId}`,
    fetchOptions,
  );

  let results = (await rawSessions.json()) as F1Response<F1SessionResults>;
  return results.response;
}

export async function fetchF1DriverStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.F1_BASEURL}/rankings/drivers?season=${season}`,
    fetchOptions,
  );

  let standings = (await rawStandings.json()) as F1Response<F1DriverStandings>;
  return standings.response;
}

export async function fetchF1TeamStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.F1_BASEURL}/rankings/teams?season=${season}`,
    fetchOptions,
  );

  let standings = (await rawStandings.json()) as F1Response<F1TeamStandings>;
  return standings.response;
}
