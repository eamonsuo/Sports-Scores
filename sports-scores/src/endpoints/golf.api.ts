import { updateGlobalApiQuota } from "@/lib/apiCounter";
import {
  Golf_SlashGolfAPI_Leaderboard,
  Golf_SlashGolfAPI_Schedule,
  Golf_SlashGolfAPI_Stats,
} from "@/types/golf";
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
      SPORT.GOLF,
    );
  }
}

export async function fetchGolfSchedule(orgId: 1 | 2, year: string = "2025") {
  const rawTournaments = await fetch(
    `${process.env.GOLF_BASEURL}/schedule?orgId=${orgId}&year=${year}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawTournaments.ok) {
    return null;
  }

  updateQuota(rawTournaments);

  return (await rawTournaments.json()) as Golf_SlashGolfAPI_Schedule;
}

export async function fetchGolfRankings(statId: string, year: string = "2025") {
  const rawRankings = await fetch(
    `${process.env.GOLF_BASEURL}/stats?year=${year}&statId=${statId}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawRankings.ok) {
    return null;
  }

  updateQuota(rawRankings);

  return (await rawRankings.json()) as Golf_SlashGolfAPI_Stats;
}

export async function fetchGolfLeaderboard(
  orgId: 1 | 2,
  tournId: string,
  year: string = "2025",
  roundId?: number,
) {
  const rawLeaderboard = await fetch(
    `${process.env.GOLF_BASEURL}/leaderboard?orgId=${orgId}&tournId=${tournId}&year=${year}${roundId != undefined ? `&roundId=${roundId}` : ""}`,
    {
      headers: reqHeaders,
    },
  );

  if (!rawLeaderboard.ok) {
    return null;
  }

  updateQuota(rawLeaderboard);

  return (await rawLeaderboard.json()) as Golf_SlashGolfAPI_Leaderboard;
}
