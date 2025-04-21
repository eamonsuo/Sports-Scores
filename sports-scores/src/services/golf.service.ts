import {
  fetchGolfLeaderboard,
  fetchGolfRankings,
  fetchGolfSchedule,
} from "@/api/golf.api";
import { mapGolfLeaderboard, mapGolfSchedule } from "@/lib/dataMapping";
import {
  GolfRankingsPage,
  SlashGolf_PlayerRanking_FedExCup,
  SlashGolf_PlayerRanking_OWGR,
} from "@/types/golf";

export async function golfPGASchedule(year: string = "2025") {
  var rawSchedule = await fetchGolfSchedule(1, year);
  if (!rawSchedule) {
    return null;
  }

  return mapGolfSchedule(rawSchedule, "pga");
}

export async function golfLIVSchedule(year: string = "2025") {
  var rawSchedule = await fetchGolfSchedule(2, year);
  if (!rawSchedule) {
    return null;
  }

  return mapGolfSchedule(rawSchedule, "liv");
}

export async function golfOWGRankings(year: string = "2025") {
  var rawRanking = await fetchGolfRankings("186", year);
  if (!rawRanking) {
    return null;
  }

  return {
    rankings: (rawRanking.rankings as SlashGolf_PlayerRanking_OWGR[]).map(
      (item) => {
        return {
          name: item.firstName + " " + item.lastName,
          country: "",
          position: item.rank.$numberInt.toString(),
          totalPoints: item.avgPoints.$numberDouble.toString(),
          pointsBehind: item.previousRank.$numberInt.toString(),
        };
      },
    ),
  } as GolfRankingsPage;
}

export async function golfFedExRankings(year: string = "2025") {
  var rawRanking = await fetchGolfRankings("02671", year);
  if (!rawRanking) {
    return null;
  }

  return {
    rankings: (rawRanking.rankings as SlashGolf_PlayerRanking_FedExCup[]).map(
      (item) => {
        console.log(item);
        return {
          name: item.firstName + " " + item.lastName,
          country: "",
          position: item.rank.$numberInt.toString(),
          totalPoints: item.totalPoints.toString(),
          pointsBehind: item.pointsBehind,
        };
      },
    ),
  } as GolfRankingsPage;
}

export async function golfPGATournamentLeaderboard(
  tournId: string,
  year: string = "2025",
  roundId?: number,
) {
  var rawLeaderboard = await fetchGolfLeaderboard(1, tournId, year, roundId);
  if (!rawLeaderboard) {
    return null;
  }

  return mapGolfLeaderboard(rawLeaderboard);
}

export async function golfLIVTournamentLeaderboard(
  tournId: string,
  year: string = "2025",
  roundId?: number,
) {
  var rawLeaderboard = await fetchGolfLeaderboard(2, tournId, year, roundId);
  if (!rawLeaderboard) {
    return null;
  }

  return mapGolfLeaderboard(rawLeaderboard);
}
