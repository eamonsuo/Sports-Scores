import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  Golf_SlashGolfAPI_Leaderboard,
  Golf_SlashGolfAPI_Schedule,
  Golf_SlashGolfAPI_Stats,
} from "@/types/golf";
import { SPORT } from "@/types/misc";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.GOLF,
    );
  }
}

async function fetchGolfApi(endpoint: string) {
  const url = process.env.GOLF_BASEURL + endpoint;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RapidAPIKey ?? "",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  updateQuota(res);

  return res.json();
}

export async function fetchGolfSchedule(orgId: 1 | 2, year: string) {
  return (await fetchGolfApi(
    `/schedule?orgId=${orgId}&year=${year}`,
  )) as Golf_SlashGolfAPI_Schedule;
}

export async function fetchGolfRankings(statId: string, year: string) {
  return (await fetchGolfApi(
    `/stats?year=${year}&statId=${statId}`,
  )) as Golf_SlashGolfAPI_Stats;
}

export async function fetchGolfLeaderboard(
  orgId: 1 | 2,
  tournId: string,
  year: string,
  roundId?: number,
) {
  return (await fetchGolfApi(
    `/leaderboard?orgId=${orgId}&tournId=${tournId}&year=${year}${roundId != undefined ? `&roundId=${roundId}` : ""}`,
  )) as Golf_SlashGolfAPI_Leaderboard;
}
