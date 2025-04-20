import {
  fetchGolfLeaderboard,
  fetchGolfRankings,
  fetchGolfSchedule,
} from "@/api/golf.api";
import { mapGolfLeaderboard } from "@/lib/dataMapping";
import { GolfTournament } from "@/types/golf";

export async function golfPGASchedule() {
  var rawSchedule = await fetchGolfSchedule(1, "2025");
  if (!rawSchedule) {
    return null;
  }

  return rawSchedule.schedule.map((item) => {
    var startDate = new Date(0);
    startDate.setUTCSeconds(item.date.start.$date.$numberLong / 1000);

    var endDate = new Date(0);
    endDate.setUTCSeconds(item.date.end.$date.$numberLong / 1000);

    return {
      id: item.tournId,
      name: item.name,
      img: "",
      startDate: startDate,
      endDate: endDate,
      sport: "golf",
      course: [""],
      status: item.format,
      tourName: "pga",
    };
  }) as GolfTournament[];
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
