import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

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

async function fetchCyclingApi(endpoint: string) {
  const url = process.env.CYCLING_BASEURL + endpoint;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  });

  if (!res.ok || res.status === 204) {
    return null;
  }

  updateQuota(res);

  return res.json();
}

export async function fetchCyclingSeasonRaces(seasonId: number) {
  return (await fetchCyclingApi(`/cycling/stage/${seasonId}/extended`)) as any;
}

export async function fetchCyclingRaceStages(stageId: number) {
  return (await fetchCyclingApi(`/cycling/stage/${stageId}/substages`)) as any;
}

export async function fetchCyclingRiderSeasonRaces(
  riderId: number,
  seasonId: number,
) {
  return (await fetchCyclingApi(
    `/cycling/team/${riderId}/stage/season/${seasonId}/races`,
  )) as any;
}
