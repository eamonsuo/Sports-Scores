import {
  fetchGolfLeaderboard,
  fetchGolfRankings,
  fetchGolfSchedule,
} from "@/api/golf.api";
import { mapGolfLeaderboard } from "@/lib/dataMapping";

export async function golfPGASchedule() {
  var rawSchedule = await fetchGolfSchedule(1, "2025");
  if (!rawSchedule) {
    return null;
  }
}

export async function golfLIVSchedule() {
  var rawSchedule = await fetchGolfSchedule(2, "2025");
  if (!rawSchedule) {
    return null;
  }
}

export async function golfOWGRankings() {
  var rawRanking = await fetchGolfRankings("186", "2025");
  if (!rawRanking) {
    return null;
  }
}

export async function golfFedExRankings() {
  var rawRanking = await fetchGolfRankings("02671", "2025");
  if (!rawRanking) {
    return null;
  }
}

export async function golfPGATournamentLeaderboard(
  tournId: string,
  roundId?: number,
) {
  var rawLeaderboard = await fetchGolfLeaderboard(1, tournId, "2025", roundId);
  if (!rawLeaderboard) {
    return null;
  }

  return mapGolfLeaderboard(rawLeaderboard);
}
