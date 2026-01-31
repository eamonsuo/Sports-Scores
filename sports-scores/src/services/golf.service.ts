import { GolfLeaderboardPlayerRow } from "@/components/golf/TournamentLeaderboard";
import {
  fetchGolfLeaderboard,
  fetchGolfRankings,
  fetchGolfSchedule,
} from "@/endpoints/golf.api";
import {
  resolveGolfPlayerImage,
  resolveGolfTeamImage,
  resolveGolfTournamentImage,
} from "@/lib/imageMapping";
import {
  Golf_SlashGolfAPI_Leaderboard,
  Golf_SlashGolfAPI_Schedule,
  GolfRankingsPage,
  GolfSchedulePage,
  SlashGolf_PlayerRanking_FedExCup,
  SlashGolf_PlayerRanking_OWGR,
} from "@/types/golf";
import { MatchSummary, SPORT } from "@/types/misc";

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
        let playerName = item.firstName + " " + item.lastName;
        return {
          name: playerName,
          img: resolveGolfPlayerImage(playerName),
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
        let playerName = item.firstName + " " + item.lastName;
        return {
          name: playerName,
          img: resolveGolfPlayerImage(playerName),
          position: item.rank.$numberInt.toString(),
          totalPoints: item.totalPoints?.toString() ?? "",
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

  return {
    playerLeaderboard: mapGolfLeaderboard(rawLeaderboard),
    teamLeaderboard:
      rawLeaderboard.teams?.map((item) => {
        return {
          name: item.name,
          position: item.position,
          totalScore: item.totalScore,
          thru: "",
          curRound: "",
          img: resolveGolfTeamImage(item.name),
        } as GolfLeaderboardPlayerRow;
      }) ?? [],
  };
}

export function mapGolfLeaderboard(data: Golf_SlashGolfAPI_Leaderboard) {
  return {
    playerPositions: data.leaderboardRows.map((item) => {
      let playerName =
        item.players === undefined
          ? `${item.firstName} ${item.lastName}${item.isAmateur ? " (A)" : ""}`
          : item.players
              .map(
                (item) =>
                  `${item.firstName} ${item.lastName}${item.isAmateur ? " (A)" : ""}`,
              )
              .join(", ");
      return {
        name: playerName,
        position: item.position,
        totalScore: item.total,
        thru: item.thru,
        curRound:
          Number(item.currentRoundScore) > 0 &&
          item.currentRoundScore[0] !== "+"
            ? "+" + item.currentRoundScore
            : item.currentRoundScore,
        img: resolveGolfPlayerImage(playerName),
      } as GolfLeaderboardPlayerRow;
    }),
  };
}

export function mapGolfSchedule(
  data: Golf_SlashGolfAPI_Schedule,
  tour: string,
) {
  return {
    schedule: data.schedule.map((item) => {
      var startDate = new Date(0);
      startDate.setUTCSeconds(item.date.start.$date.$numberLong / 1000);

      var endDate = new Date(0);
      endDate.setUTCSeconds(item.date.end.$date.$numberLong / 1000);

      return {
        id: item.tournId,
        name: item.name,
        img: resolveGolfTournamentImage(item.name),
        startDate: startDate,
        endDate: endDate,
        sport: "golf",
        course: [""],
        status: "",
        leader: "",
        location: "",
        tourName: tour,
      };
    }),
    pageName: "",
  } as GolfSchedulePage;
}

export function golfTournamentsByDate(date: Date) {
  // Placeholder for golf matches fetching logic

  function createGolfMatchSummary(id: number, name: string, slug: string) {
    return {
      id: id,
      sport: SPORT.GOLF,
      summaryText: name,
      startDate: date,
      status: "UPCOMING",
      awayDetails: { score: "", name: "" },
      homeDetails: { score: "", name: "" },
      matchSlug: slug,
    } as MatchSummary;
  }

  const golfTours: MatchSummary[] = [];

  // Basic check for tournaments
  switch (date.getDay()) {
    case 2: // Tuesday
    case 3: // Wednesday
      golfTours.push(createGolfMatchSummary(0, "TGL", "tgl"));
      break;
    case 4: // Thursday
      golfTours.push(
        createGolfMatchSummary(1, "PGA Tour of Australasia", "australasia"),
      );
      break;
    case 5: // Friday
    case 6: // Saturday
    case 0: // Sunday
      golfTours.push(
        createGolfMatchSummary(1, "PGA Tour of Australasia", "australasia"),
        createGolfMatchSummary(2, "PGA Tour", "pga/2026"),
        createGolfMatchSummary(3, "LIV Golf", "liv/2026"),
        createGolfMatchSummary(4, "DP World Tour", "dpworld"),
        createGolfMatchSummary(5, "LPGA Tour", "lpga"),
      );
      break;
    case 1: // Monday
      golfTours.push(
        // createGolfMatchSummary(1, "PGA Tour of Australasia", "australasia"),
        createGolfMatchSummary(2, "PGA Tour", "pga/2026"),
        createGolfMatchSummary(3, "LIV Golf", "liv/2026"),
        createGolfMatchSummary(4, "DP World Tour", "dpworld"),
        createGolfMatchSummary(5, "LPGA Tour", "lpga"),
      );
      break;
  }
  return golfTours;
}
