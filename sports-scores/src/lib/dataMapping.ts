import { CricketLadder } from "@/components/cricket/CricketSeriesLadder";
import { GolfLeaderboardPlayerRow } from "@/components/golf/TournamentLeaderboard";
import { AFLGame } from "@/types/afl";
import { BaseballGame } from "@/types/baseball";
import {
  Cricket_LiveScoreAPI_MatchesListByDate,
  Cricket_LiveScoreAPI_MatchesListByLeague,
  Cricket_LiveScoreAPI_TeamDetails,
  LeagueTable,
} from "@/types/cricket";
import {
  Golf_SlashGolfAPI_Leaderboard,
  Golf_SlashGolfAPI_Schedule,
  GolfSchedulePage,
} from "@/types/golf";
import { MatchStatus, MatchSummary } from "@/types/misc";
import { MATCHSTATUSAFL, SPORT } from "./constants";
import {
  getLocalTime,
  resolveGolfPlayerImage,
  setMatchSummary,
  shortenTeamNames,
} from "./projUtils";

export function mapAFLFixtureFields(matches: AFLGame[]) {
  return matches.map(
    (item: AFLGame) =>
      ({
        id: item.game.id,
        startDate: new Date(item.date),
        sport: SPORT.AFL,
        venue: item.venue,
        status: "COMPLETED",
        summaryText: setMatchSummary(
          item.status.short,
          getLocalTime(item.time),
          item.teams.home.name,
          item.scores.home.score,
          item.teams.away.name,
          item.scores.away.score,
        ),
        timer:
          item.status.short === MATCHSTATUSAFL.SHORT_NS
            ? getLocalTime(item.time)
            : item.status.short,
        homeDetails: {
          img: item.teams.home.logo,
          score: item.scores.home.score.toString(),
          name: shortenTeamNames(item.teams.home.name),
        },
        awayDetails: {
          img: item.teams.away.logo,
          score: item.scores.away.score.toString(),
          name: shortenTeamNames(item.teams.away.name),
        },
        roundLabel: `Round ${item.week}`,
      }) as MatchSummary,
  );
}

export function mapBaseballFixtureFields(matches: BaseballGame[]) {
  return matches.map(
    (item) =>
      ({
        id: item.id,
        startDate: new Date(item.date),
        sport: SPORT.BASEBALL,
        venue: "",
        status: item.status.long,
        summaryText: "",
        timer:
          item.status.short === MATCHSTATUSAFL.SHORT_NS
            ? getLocalTime(item.time)
            : item.status.short,
        homeDetails: {
          img: item.teams.home.logo,
          score: item.scores.home.total?.toString(),
          name: item.teams.home.name,
        },
        awayDetails: {
          img: item.teams.away.logo,
          score: item.scores.away.total?.toString(),
          name: item.teams.away.name,
        },
        roundLabel: `Round ${item.week}`,
      }) as MatchSummary,
  );
}

export function mapCricketCurrentMatches(
  data: Cricket_LiveScoreAPI_MatchesListByDate,
) {
  return data.Stages.flatMap((item) => {
    return item.Events.map((event) => {
      let sDate = convertNumbertoDate(event.Esd);
      let longFormat =
        (event.Tr1C1 && event.Tr1C2) || (event.Tr2C1 && event.Tr2C2);
      let home2Ing = longFormat
        ? `, ${event.Tr1CW2 ?? 0}/${event.Tr1C2 ?? 0}${event.Tr1CD2 === 1 ? "d" : ""}`
        : "";
      let away2Ing = longFormat
        ? `, ${event.Tr2CW2 ?? 0}/${event.Tr2C2 ?? 0}${event.Tr2CD2 === 1 ? "d" : ""}`
        : "";
      return {
        id: Number(event.Eid),
        startDate: sDate,
        endDate: convertNumbertoDate(event.Ese),
        sport: SPORT.CRICKET,
        venue: "",
        status: mapCricketStatus(event.Eps),
        summaryText:
          event.Eps === "NS"
            ? `Match starts at ${sDate.toLocaleTimeString("en-US")}`
            : event.ECo,
        otherDetail: event.ErnInf,
        homeDetails: {
          img: "/olympic-rings.svg",
          score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
          name: event.T1[0].Nm,
        },
        awayDetails: {
          img: "/olympic-rings.svg",
          score: `${event.Tr2CW1 ?? 0}/${event.Tr2C1 ?? 0}${event.Tr2CD1 === 1 ? "d" : ""}${away2Ing}`,
          name: event.T2[0].Nm,
        },
        seriesName: item.Snm,
        matchSlug: `${event.Eid}`,
        seriesSlug: `${item.Ccd}/${item.Scd}`,
      } as MatchSummary;
    });
  });
}

export function mapCricketSeriesMatches(
  data: Cricket_LiveScoreAPI_MatchesListByLeague,
) {
  return data.Stages.flatMap((item) => {
    return item.Events.map((event) => {
      let sDate = convertNumbertoDate(event.Esd);
      let longFormat =
        (event.Tr1C1 && event.Tr1C2) || (event.Tr2C1 && event.Tr2C2);
      let home2Ing = longFormat
        ? `, ${event.Tr1CW2 ?? 0}/${event.Tr1C2 ?? 0}${event.Tr1CD2 === 1 ? "d" : ""}`
        : "";
      let away2Ing = longFormat
        ? `, ${event.Tr2CW2 ?? 0}/${event.Tr2C2 ?? 0}${event.Tr2CD2 === 1 ? "d" : ""}`
        : "";
      return {
        id: Number(event.Eid),
        startDate: sDate,
        endDate: convertNumbertoDate(event.Ese),
        sport: SPORT.CRICKET,
        venue: "",
        status: mapCricketStatus(event.Eps),
        summaryText:
          event.Eps === "NS"
            ? `Match starts at ${sDate.toLocaleTimeString("en-US")}`
            : event.ECo,
        otherDetail: event.ErnInf,
        homeDetails: {
          img: "/olympic-rings.svg",
          score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
          name: event.T1[0].Nm,
        },
        awayDetails: {
          img: "/olympic-rings.svg",
          score: `${event.Tr2CW1 ?? 0}/${event.Tr2C1 ?? 0}${event.Tr2CD1 === 1 ? "d" : ""}${away2Ing}`,
          name: event.T2[0].Nm,
        },
        seriesName: item.Snm,
        matchSlug: `${event.Eid}`,
        seriesSlug: `${item.Ccd}/${item.Scd}`,
      } as MatchSummary;
    });
  });
}

export function mapCricketTeamMatches(
  data: Cricket_LiveScoreAPI_TeamDetails[],
) {
  return data.flatMap((a) => {
    return a.Stages.flatMap((item) => {
      return item.Events.map((event) => {
        let sDate = convertNumbertoDate(event.Esd);
        // let longFormat =
        //   (event.Tr1C1 && event.Tr1C2) || (event.Tr2C1 && event.Tr2C2);
        // let home2Ing = longFormat
        //   ? `& ${event.Tr1CW2 ?? 0}/${event.Tr1C2 ?? 0}${event.Tr1CD2 === 1 ? "d" : ""}`
        //   : "";
        // let away2Ing = longFormat
        //   ? `& ${event.Tr2CW2 ?? 0}/${event.Tr2C2 ?? 0}${event.Tr2CD2 === 1 ? "d" : ""}`
        //   : "";
        return {
          id: Number(event.Eid),
          startDate: sDate,
          sport: SPORT.CRICKET,
          venue: "",
          status: mapCricketStatus(event.Eps),
          summaryText: "",
          otherDetail: "",
          homeDetails: {
            score: "", //`${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""} ${home2Ing}`,
            name: event.T1[0].Nm,
          },
          awayDetails: {
            score: "", //`${event.Tr2CW1 ?? 0}/${event.Tr2C1 ?? 0}${event.Tr2CD1 === 1 ? "d" : ""} ${away2Ing}`,
            name: event.T2[0].Nm,
          },
          seriesName: item.Snm,
          matchSlug: item.Sid,
          seriesSlug: ``,
        } as MatchSummary;
      });
    });
  });
}

export function mapCricketSeriesLadders(ladders: LeagueTable) {
  return ladders.L[0].Tables.map((item) => {
    return {
      name: item.name,
      teams: item.team.map((team) => {
        return {
          name: team.Tnm,
          logo: undefined,
          rank: team.rnk,
          played: team.pld,
          won: team.win,
          drawn: team.drw,
          lost: team.lst,
          points: team.pts,
          nrr: Number(team.nrr),
        };
      }),
    } as CricketLadder;
  });
}

function mapCricketStatus(status?: string): MatchStatus {
  switch (status) {
    case "NS":
      return "UPCOMING";
    case "L":
      return "LIVE";
    case "FT":
      return "COMPLETED";
    default:
      return "LIVE";
  }
}

export function convertNumbertoDate(dateNumber: number) {
  let dateString = dateNumber.toString();
  let year = Number(dateString.substring(0, 4));
  let month = Number(dateString.substring(4, 6)) - 1;
  let day = Number(dateString.substring(6, 8));
  let hour = Number(dateString.substring(8, 10));
  let minute = Number(dateString.substring(10, 12));
  let second = Number(dateString.substring(12, 14));
  return new Date(year, month, day, hour, minute, second);
}

export function mapGolfLeaderboard(data: Golf_SlashGolfAPI_Leaderboard) {
  return {
    playerPositions: data.leaderboardRows.map((item) => {
      let playerName = `${item.firstName} ${item.lastName}`;
      return {
        name: playerName,
        position: item.position,
        totalScore: item.total,
        thru: item.thru,
        curRound: item.currentRoundScore,
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
        img: "",
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
