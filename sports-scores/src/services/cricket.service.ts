import { CricketScorecardPage } from "@/app/sports/cricket/match/[slug]/page";
import { MatchDetailsPage } from "@/components/cricket/CricketMatchDetailsPage";
import { CricketScorecardBatProps } from "@/components/cricket/CricketScorecardBat";
import { CricketScorecardBowlProps } from "@/components/cricket/CricketScorecardBowl";
import { CricketLadder } from "@/components/cricket/CricketSeriesLadder";
import {
  fetchCricketAllSeries,
  fetchCricketMatchDetails,
  fetchCricketMatchesByDate,
  fetchCricketMatchInnings,
  fetchCricketMyTeams,
  fetchCricketSeriesMatches,
} from "@/endpoints/cricket.api";
import { resolveCricketTeamImages } from "@/lib/imageMapping";
import { dateToCustomString, toShortTimeString } from "@/lib/projUtils";
import {
  Cricket_LiveScoreAPI_MatchesGetInnings,
  Cricket_LiveScoreAPI_MatchesGetScoreBoard,
} from "@/types/cricket";
import { MatchStatus, MatchSummary, SPORT } from "@/types/misc";

const excludedSeries = ["CSA", "The Ford", "County"];

// Fetch matches for a specific date
export async function cricketMatchesByDate(date: Date) {
  const dateString = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

  const rawMatches = await fetchCricketMatchesByDate(dateString);
  if (!rawMatches || !rawMatches.Stages) return null;

  return rawMatches.Stages.filter(
    (series) => !excludedSeries.some((str) => series.Snm.includes(str)),
  ).flatMap((item) => {
    return item.Events.map((event) => {
      let sDate = convertNumbertoDate(event.Esd, false);
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
        endDate: convertNumbertoDate(event.Ese, false),
        sport: SPORT.CRICKET,
        venue: "",
        status: mapCricketStatus(event.Eps),
        summaryText:
          event.Eps === "NS"
            ? `Match starts at ${toShortTimeString(sDate)}`
            : event.ECo,
        otherDetail: event.ErnInf,
        homeDetails: {
          img: resolveCricketTeamImages(
            event.T1[0].Nm.replace(/\s((W|A|U19)(\sW)?)$/i, ""),
          ),
          score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
          name: event.T1[0].Nm,
        },
        awayDetails: {
          img: resolveCricketTeamImages(
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
  });
}

export async function cricketMyTeamsMatches() {
  const rawTeamDetails = await fetchCricketMyTeams();

  if (rawTeamDetails === null) {
    return null;
  }

  return rawTeamDetails.flatMap((a) => {
    return a.Stages.flatMap((item) => {
      return item.Events.map((event) => {
        let sDate = convertNumbertoDate(event.Esd, true);
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

export async function cricketAllSeries() {
  const rawTeamDetails = await fetchCricketAllSeries();

  if (rawTeamDetails === null) {
    return null;
  }

  return rawTeamDetails;
}

export async function cricketMatchDetails(id: number): Promise<{
  matchDetails: MatchDetailsPage;
  matchScorecard: CricketScorecardPage;
  matchSeries: string;
} | null> {
  const rawInnings = await fetchCricketMatchInnings(id);
  const rawDetails = await fetchCricketMatchDetails(id);

  if (rawInnings === null || rawDetails === null) {
    return null;
  }

  const detailsPage = mapMatchDetails(rawDetails, rawInnings);
  const scorecardPage = mapScorecardDetails(rawInnings);

  return {
    matchDetails: detailsPage,
    matchScorecard: scorecardPage,
    matchSeries: `${rawDetails.Stg.Ccd}/${rawDetails.Stg.Scd}`,
  };
}

export async function cricketSeriesResults(ccd: string, scd: string) {
  let rawSeries = await fetchCricketSeriesMatches(ccd, scd);

  if (
    rawSeries?.Stages[0].LeagueTable === undefined ||
    rawSeries === null ||
    rawSeries === undefined
  ) {
    return null;
  }

  return rawSeries.Stages[0].LeagueTable.L[0].Tables.map((item) => {
    return {
      name: item.name,
      teams: item.team.map((team) => {
        return {
          name: team.Tnm,
          logo: resolveCricketTeamImages(team.Tnm.replace(/\s(W|A|U19)$/i, "")),
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

export async function cricketSeriesDetails(ccd: string, scd: string) {
  let rawMatches = await fetchCricketSeriesMatches(ccd, scd);

  if (rawMatches == undefined || rawMatches.Stages == undefined) {
    return null;
  }

  return rawMatches.Stages.flatMap((item) => {
    return item.Events.map((event) => {
      let sDate = convertNumbertoDate(event.Esd, false);
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
        endDate: convertNumbertoDate(event.Ese ?? event.Esd, false),
        sport: SPORT.CRICKET,
        venue: "",
        status: mapCricketStatus(event.Eps),
        summaryText:
          event.Eps === "NS"
            ? `Match starts at ${toShortTimeString(sDate)}`
            : event.ECo,
        otherDetail: event.ErnInf,
        homeDetails: {
          img: resolveCricketTeamImages(
            event.T1[0].Nm.replace(/\s(W|A|U19)$/i, ""),
          ),
          score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
          name: event.T1[0].Nm,
        },
        awayDetails: {
          img: resolveCricketTeamImages(
            event.T2[0].Nm.replace(/\s(W|A|U19)$/i, ""),
          ),
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

export function mapMatchDetails(
  details: Cricket_LiveScoreAPI_MatchesGetScoreBoard,
  innings: Cricket_LiveScoreAPI_MatchesGetInnings,
) {
  const middlePlayerIndex = Math.ceil((innings.Prns?.length ?? 0) / 2);
  let homePlayers =
    Object.keys(innings).length === 0
      ? ["No Team Data"]
      : innings.Prns.slice(0, middlePlayerIndex).map((item) => item.Snm);
  let awayPlayers =
    Object.keys(innings).length === 0
      ? ["No Team Data"]
      : innings.Prns.slice(middlePlayerIndex).map((item) => item.Snm);
  let startDate = dateToCustomString(convertNumbertoDate(details.Esd, true));
  let endDate = dateToCustomString(convertNumbertoDate(details.Ese, true));
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
      img: resolveCricketTeamImages(
        details.T1[0].Nm.replace(/\s(W|A|U19)$/i, ""),
      ),
    },
    homePlayers: homePlayers,
    awayInfo: {
      name: details.T2[0].Nm,
      score: `${away1Ing}${away2Ing}`,
      img: resolveCricketTeamImages(
        details.T2[0].Nm.replace(/\s(W|A|U19)$/i, ""),
      ),
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

export function convertNumbertoDate(dateNumber: number, utcDate: boolean) {
  let dateString = dateNumber.toString();
  let year = Number(dateString.substring(0, 4));
  let month = Number(dateString.substring(4, 6)) - 1;
  let day = Number(dateString.substring(6, 8));
  let hour = Number(dateString.substring(8, 10));
  let minute = Number(dateString.substring(10, 12));
  let second = Number(dateString.substring(12, 14));
  return utcDate
    ? new Date(Date.UTC(year, month, day, hour, minute, second))
    : new Date(year, month, day, hour, minute, second);
}
