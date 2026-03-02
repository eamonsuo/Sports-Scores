import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

const reqHeaders = new Headers();
reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.CYCLING,
    );
  }
}

export async function fetchCyclingSeasonRaces(seasonId: number) {
  const rawRaces = await fetch(
    `${process.env.CYCLING_BASEURL}/cycling/stage/${seasonId}/extended`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawRaces.ok || rawRaces.status === 204) {
    return null;
  }

  updateQuota(rawRaces);

  return (await rawRaces.json()) as any;
}

export async function fetchCyclingRaceStages(stageId: number) {
  const rawStages = await fetch(
    `${process.env.CYCLING_BASEURL}/cycling/stage/${stageId}/substages`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawStages.ok || rawStages.status === 204) {
    return null;
  }

  updateQuota(rawStages);

  return (await rawStages.json()) as any;
}

export async function fetchCyclingRiderSeasonRaces(
  riderId: number,
  seasonId: number,
) {
  const rawRaces = await fetch(
    `${process.env.CYCLING_BASEURL}/cycling/team/${riderId}/stage/season/${seasonId}/races`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawRaces.ok || rawRaces.status === 204) {
    return null;
  }

  updateQuota(rawRaces);

  return (await rawRaces.json()) as any;
}
