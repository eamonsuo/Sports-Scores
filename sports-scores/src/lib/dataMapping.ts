import { CricketScorecardPage } from "@/app/sports/cricket/match/[slug]/page";
import { MatchDetailsPage } from "@/components/cricket/CricketMatchDetailsPage";
import { CricketScorecardBatProps } from "@/components/cricket/CricketScorecardBat";
import { CricketScorecardBowlProps } from "@/components/cricket/CricketScorecardBowl";
import { CricketLadder } from "@/components/cricket/CricketSeriesLadder";
import { GolfLeaderboardPlayerRow } from "@/components/golf/TournamentLeaderboard";
import { BaseballGame } from "@/types/baseball";
import {
  Cricket_LiveScoreAPI_MatchesGetInnings,
  Cricket_LiveScoreAPI_MatchesGetScoreBoard,
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
import { MatchStatus, MatchSummary, SPORT } from "@/types/misc";
import {
  resolveCountryImage,
  resolveGolfPlayerImage,
  resolveGolfTournamentImage,
} from "./imageMapping";
import { dateToCustomString, getLocalTime } from "./projUtils";

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
          item.status.short === "NS"
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
  return data.Stages.filter((series) => !/CSA/.test(series.Snm)).flatMap(
    (item) => {
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
              ? `Match starts at ${sDate.toLocaleTimeString("en-US").replace(":00 ", " ")}`
              : event.ECo,
          otherDetail: event.ErnInf,
          homeDetails: {
            img: resolveCountryImage(
              event.T1[0].Nm.replace(/\s((W|A|U19)(\sW)?)$/i, ""),
            ),
            score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
            name: event.T1[0].Nm,
          },
          awayDetails: {
            img: resolveCountryImage(
              event.T2[0].Nm.replace(/\s((W|A|U19)(\sW)?)$/i, ""),
            ),
            score: `${event.Tr2CW1 ?? 0}/${event.Tr2C1 ?? 0}${event.Tr2CD1 === 1 ? "d" : ""}${away2Ing}`,
            name: event.T2[0].Nm,
          },
          seriesName: item.Snm,
          matchSlug: `${event.Eid}`,
          seriesSlug: `${item.Ccd}/${item.Scd}`,
        } as MatchSummary;
      });
    },
  );
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
            ? `Match starts at ${sDate.toLocaleTimeString("en-US").replace(":00 ", " ")}`
            : event.ECo,
        otherDetail: event.ErnInf,
        homeDetails: {
          img: resolveCountryImage(event.T1[0].Nm.replace(/\s(W|A|U19)$/i, "")),
          score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
          name: event.T1[0].Nm,
        },
        awayDetails: {
          img: resolveCountryImage(event.T2[0].Nm.replace(/\s(W|A|U19)$/i, "")),
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
          logo: resolveCountryImage(team.Tnm.replace(/\s(W|A|U19)$/i, "")),
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

export function mapMatchDetails(
  details: Cricket_LiveScoreAPI_MatchesGetScoreBoard,
  innings: Cricket_LiveScoreAPI_MatchesGetInnings,
) {
  const middlePlayerIndex = Math.ceil(innings.Prns.length / 2);
  let homePlayers =
    Object.keys(innings).length === 0
      ? ["No Team Data"]
      : innings.Prns.slice(0, middlePlayerIndex).map((item) => item.Snm);
  let awayPlayers =
    Object.keys(innings).length === 0
      ? ["No Team Data"]
      : innings.Prns.slice(middlePlayerIndex).map((item) => item.Snm);
  let startDate = dateToCustomString(convertNumbertoDate(details.Esd));
  let endDate = dateToCustomString(convertNumbertoDate(details.Ese));
  let dateString =
    details.Esd === details.Ese ? `${startDate}` : `${startDate} - ${endDate}`;
  let tossChoice = details.TCho === 1 ? "bat" : "bowl";
  let tossWinner = details.TPa === 1 ? details.T1[0].Nm : details.T2[0].Nm;
  let longFormat =
    (details.Tr1C1 && details.Tr1C2) || (details.Tr2C1 && details.Tr2C2);
  let home1Ing = `${details.Tr1CW1 ?? 0}/${details.Tr1C1 ?? 0}${details.Tr1CD1 === 1 ? "d" : ""}`;
  let away1Ing = `${details.Tr2CW1 ?? 0}/${details.Tr2C1 ?? 0}${details.Tr2CD1 === 1 ? "d" : ""}`;
  let home2Ing = longFormat
    ? ` & ${details.Tr1CW2 ?? 0}/${details.Tr1C2 ?? 0}${details.Tr1CD2 === 1 ? "d" : ""}`
    : "";
  let away2Ing = longFormat
    ? ` & ${details.Tr2CW2 ?? 0}/${details.Tr2C2 ?? 0}${details.Tr2CD2 === 1 ? "d" : ""}`
    : "";

  return {
    matchSummaryText: details.ECo,
    status: details.EpsL,
    date: dateString,
    venue: `${details.Venue.Vnm}, ${details.Stg.Cnm}`,
    tossResult: `${tossWinner} won the toss and chose to ${tossChoice}`,
    umpires: [""],
    pom: "",
    homeInfo: {
      name: details.T1[0].Nm,
      score: `${home1Ing}${home2Ing}`,
      img: resolveCountryImage(details.T1[0].Nm.replace(/\s(W|A|U19)$/i, "")),
    },
    homePlayers: homePlayers,
    awayInfo: {
      name: details.T2[0].Nm,
      score: `${away1Ing}${away2Ing}`,
      img: resolveCountryImage(details.T2[0].Nm.replace(/\s(W|A|U19)$/i, "")),
    },
    awayPlayers: awayPlayers,
  } as MatchDetailsPage;
}

export function mapScorecardDetails(
  data: Cricket_LiveScoreAPI_MatchesGetInnings,
) {
  if (Object.keys(data).length === 0) {
    return {
      matchState: "LIVE",
      data: [],
    } as CricketScorecardPage;
  }

  const inningsData = data.SDInn.map((item) => {
    let inningTile = item.Ti.replace(" INN", "").split(" ");

    return {
      inningLabel: `${inningTile[1].toLowerCase()} ${inningTile[0]}`,
      inningBatters: {
        batters: item.Bat.map((x) => {
          return {
            name:
              data.Prns.find((p) => p.Pid === x.Pid.toString())?.Snm ??
              "Unknown",
            runs: x.R,
            balls: x.B,
            strikeRate: x.Sr,
            dismissalText:
              x.LpTx === "did not bat"
                ? ""
                : x.LpTx.replace(
                    "[F]",
                    data.Prns.find((p) => p.Pid === x.Fid.toString())?.Ln ??
                      "Unknown",
                  ).replace(
                    "[B]",
                    data.Prns.find((p) => p.Pid === x.Bid.toString())?.Ln ??
                      "Unknown",
                  ),
          };
        }),
        total: item.Pt,
        extras: {
          byes: item.B,
          legbyes: item.LB,
          noballs: item.NB,
          wides: item.WB,
          total: item.Ex,
        },
        overs: item.Ov,
        wickets: item.Wk,
      } as CricketScorecardBatProps,
      inningBowlers: item.Bow.map((bowl) => {
        return {
          name:
            data.Prns.find((p) => p.Pid === bowl.Pid.toString())?.Snm ??
            "Unknown",
          overs: bowl.Ov,
          runs: bowl.R,
          wickets: bowl.Wk,
          economy: bowl.Er,
        };
      }) as CricketScorecardBowlProps,
    };
  });

  return {
    matchState: "LIVE",
    data: inningsData,
  } as CricketScorecardPage;
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
