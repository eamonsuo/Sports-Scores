import { CricketScorecardPage } from "@/app/sports/cricket/[league]/[season]/[match]/page";
import { MatchDetailsPage } from "@/components/cricket/CricketMatchDetailsPage";
import { CricketScorecardBatProps } from "@/components/cricket/CricketScorecardBat";
import { CricketScorecardBowlProps } from "@/components/cricket/CricketScorecardBowl";
import { CricketLadder } from "@/components/cricket/CricketSeriesLadder";
import {
  fetchCricketAllSeries,
  fetchCricketMatchDetails,
  fetchCricketMatchesByDateLiveScore,
  fetchCricketMatchesByDateSofascore,
  fetchCricketMatchInnings,
  fetchCricketMyTeams,
  fetchCricketSeriesMatches,
} from "@/endpoints/cricket.api";
import { fetchEventsByDate } from "@/endpoints/sofascore.api";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import {
  Cricket_LiveScoreAPI_MatchesGetInnings,
  Cricket_LiveScoreAPI_MatchesGetScoreBoard,
} from "@/types/cricket";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchStatus,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { addDays } from "date-fns";

const excludedSeries = [
  "CSA",
  "The Ford",
  "County",
  "T10",
  "SA20",
  "Super Smash",
  "Bangladesh Premier League",
  "Plunket",
];

export async function cricketMatchesRecent(date: Date) {
  const rawMatchesYesterday = await fetchCricketMatchesByDateLiveScore(
    addDays(date, -1),
  );
  const rawMatches = await fetchCricketMatchesByDateLiveScore(date);

  const rawMatchesTomorrow = await fetchCricketMatchesByDateLiveScore(
    addDays(date, 1),
  );

  const allMatches = [
    ...(rawMatchesYesterday?.Stages ?? []),
    ...(rawMatches?.Stages ?? []),
    ...(rawMatchesTomorrow?.Stages ?? []),
  ];
  if (!allMatches || !allMatches.length) return null;

  const matches = allMatches
    .filter((series) => !excludedSeries.some((str) => series.Snm.includes(str)))
    .flatMap((item) => {
      return item.Events.map((event) => {
        let sDate = convertNumbertoDate(event.Esd);
        let endDate = convertNumbertoDate(event.Ese);
        let longFormat =
          (event.Tr1C1 && event.Tr1C2) || (event.Tr2C1 && event.Tr2C2);
        let home2Ing = longFormat
          ? `, ${event.Tr1CW2 ?? 0}/${event.Tr1C2 ?? 0}${event.Tr1CD2 === 1 ? "d" : ""}`
          : "";
        let away2Ing = longFormat
          ? `, ${event.Tr2CW2 ?? 0}/${event.Tr2C2 ?? 0}${event.Tr2CD2 === 1 ? "d" : ""}`
          : "";

        return {
          id: event.Eid,
          startDate: sDate,
          endDate:
            sDate.toDateString() !== endDate.toDateString()
              ? endDate
              : undefined,
          sport: SPORT.CRICKET,
          venue: "",
          status: mapCricketStatus(event.Eps),
          summaryText: event.Eps === "NS" ? "" : event.ECo,
          timer: event.Eps === "L" ? "Live" : event.Eps === "NS" ? sDate : null,
          timerDisplayColour: event.Eps === "L" ? "green" : "gray",
          otherDetail: event.ErnInf,
          homeDetails: {
            img: resolveSportImage(event.T1[0].Nm),
            score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
            name: event.T1[0].Nm,
          },
          awayDetails: {
            img: resolveSportImage(event.T2[0].Nm),
            score: `${event.Tr2CW1 ?? 0}/${event.Tr2C1 ?? 0}${event.Tr2CD1 === 1 ? "d" : ""}${away2Ing}`,
            name: event.T2[0].Nm,
          },
          seriesName: item.Snm,
          matchSlug: `${item.Ccd}/${item.Scd}/${event.Eid}`,
          seriesSlug: `${item.Ccd}/${item.Scd}`,
        } as MatchSummary;
      });
    });

  // Remove duplicates and sort by start date
  return matches
    .filter(
      (match, index, self) =>
        self.findIndex((m) => m.id === match.id) === index,
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export async function cricketMatchesByDate(date: Date) {
  const rawMatches = await fetchCricketMatchesByDateLiveScore(date);
  if (!rawMatches || !rawMatches.Stages) return null;

  const matches = rawMatches.Stages.filter(
    (series) => !excludedSeries.some((str) => series.Snm.includes(str)),
  ).flatMap((item) => {
    return item.Events.map((event) => {
      let sDate = convertNumbertoDate(event.Esd);
      let endDate = convertNumbertoDate(event.Ese);
      let longFormat =
        (event.Tr1C1 && event.Tr1C2) || (event.Tr2C1 && event.Tr2C2);
      let home2Ing = longFormat
        ? `, ${event.Tr1CW2 ?? 0}/${event.Tr1C2 ?? 0}${event.Tr1CD2 === 1 ? "d" : ""}`
        : "";
      let away2Ing = longFormat
        ? `, ${event.Tr2CW2 ?? 0}/${event.Tr2C2 ?? 0}${event.Tr2CD2 === 1 ? "d" : ""}`
        : "";

      return {
        id: event.Eid,
        startDate: sDate,
        endDate:
          sDate.toDateString() !== endDate.toDateString() ? endDate : undefined,
        sport: SPORT.CRICKET,
        venue: "",
        status: mapCricketStatus(event.Eps),
        summaryText: event.Eps === "NS" ? "" : event.ECo,
        timer: event.Eps === "L" ? "Live" : event.Eps === "NS" ? sDate : null,
        timerDisplayColour: event.Eps === "L" ? "green" : "gray",
        otherDetail: event.ErnInf,
        homeDetails: {
          img: resolveSportImage(event.T1[0].Nm),
          score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
          name: event.T1[0].Nm,
        },
        awayDetails: {
          img: resolveSportImage(event.T2[0].Nm),
          score: `${event.Tr2CW1 ?? 0}/${event.Tr2C1 ?? 0}${event.Tr2CD1 === 1 ? "d" : ""}${away2Ing}`,
          name: event.T2[0].Nm,
        },
        seriesName: item.Snm,
        matchSlug: `${item.Ccd}/${item.Scd}/${event.Eid}`,
        seriesSlug: `${item.Ccd}/${item.Scd}`,
      } as MatchSummary;
    });
  });

  // Sort by start date
  return matches.sort((a, b) => {
    return a.startDate.getTime() - b.startDate.getTime();
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
          id: event.Eid,
          startDate: sDate,
          sport: SPORT.CRICKET,
          venue: "",
          summaryText: event.Eps === "NS" ? "" : event.ECo,
          timer: event.Eps === "L" ? "Live" : event.Eps === "NS" ? sDate : null,
          timerDisplayColour: event.Eps === "L" ? "green" : "gray",
          status: mapCricketStatus(event.Eps),
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
          logo: resolveSportImage(team.Tnm),
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

  const matches = rawMatches.Stages.flatMap((item) => {
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
        id: event.Eid,
        startDate: sDate,
        endDate: convertNumbertoDate(event.Ese ?? event.Esd),
        sport: SPORT.CRICKET,
        venue: "",
        status: mapCricketStatus(event.Eps),
        summaryText: event.Eps === "NS" ? "" : event.ECo,
        timer: event.Eps === "L" ? "Live" : event.Eps === "NS" ? sDate : null,
        timerDisplayColour: event.Eps === "L" ? "green" : "gray",
        otherDetail: event.ErnInf,
        homeDetails: {
          img: resolveSportImage(event.T1[0].Nm),
          score: `${event.Tr1CW1 ?? 0}/${event.Tr1C1 ?? 0}${event.Tr1CD1 === 1 ? "d" : ""}${home2Ing}`,
          name: event.T1[0].Nm,
        },
        awayDetails: {
          img: resolveSportImage(event.T2[0].Nm),
          score: `${event.Tr2CW1 ?? 0}/${event.Tr2C1 ?? 0}${event.Tr2CD1 === 1 ? "d" : ""}${away2Ing}`,
          name: event.T2[0].Nm,
        },
        seriesName: item.Snm,
        matchSlug: `${item.Ccd}/${item.Scd}/${event.Eid}`,
        seriesSlug: `${item.Ccd}/${item.Scd}`,
      } as MatchSummary;
    });
  });

  // Sort by date first, then by start time
  return matches.sort((a, b) => {
    return a.startDate.getTime() - b.startDate.getTime();
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
  let startDate = convertNumbertoDate(details.Esd);
  let endDate = convertNumbertoDate(details.Ese);
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
    date: startDate,
    venue: `${details.Venue.Vnm}, ${details.Stg.Cnm}`,
    tossResult: `${tossWinner} won the toss and chose to ${tossChoice}`,
    umpires: [""],
    pom: "",
    homeInfo: {
      name: details.T1[0].Nm,
      score: `${home1Ing}${home2Ing}`,
      img: resolveSportImage(details.T1[0].Nm),
    },
    homePlayers: homePlayers,
    awayInfo: {
      name: details.T2[0].Nm,
      score: `${away1Ing}${away2Ing}`,
      img: resolveSportImage(details.T2[0].Nm),
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

export function convertNumbertoDate(dateNumber: number) {
  let dateString = dateNumber.toString();
  let year = dateString.substring(0, 4);
  let month = dateString.substring(4, 6);
  let day = dateString.substring(6, 8);
  let hour = dateString.substring(8, 10);
  let minute = dateString.substring(10, 12);
  let second = dateString.substring(12, 14);
  // return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+10:00`);
}

export async function cricketMatchesByDateSofascore(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("cricket", date)
    : fetchCricketMatchesByDateSofascore(date));

  if (!matches) return null;

  // const validLeagueIds = CRICKET_LEAGUES.map((l) => Number(l.slug));

  matches.events = matches.events
    .filter(
      (item) => !excludedSeries.some((str) => item.season.name.includes(str)),
      // validLeagueIds.includes(item.tournament.uniqueTournament.id),
    )
    .sort((a, b) => a.startTimestamp - b.startTimestamp);

  if (!matches.events || matches.events.length === 0) return null;

  const allMatches = matches.events.map((event) =>
    mapCricketMatch(
      event,
      event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
    ),
  );

  const fixture = mapFixtureRounds(
    { name: "", slug: "", seasons: [], display: DISPLAY_TYPES.DATE },
    allMatches,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.DATE, fixture),
  };
}

function mapCricketMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  let startDate = new Date(0);
  startDate.setUTCSeconds(match.startTimestamp);
  let endDate = new Date(0);
  endDate.setUTCSeconds(match?.endTimestamp ?? 0);

  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.CRICKET, match, {
    startDate: startDate,
    endDate:
      startDate.toDateString() !== endDate.toDateString() ? endDate : undefined,
    // status: mapCricketStatus(match.status.code.toString()),
    summaryText: match.note,
    // otherDetail: match.tournament.name,
    timer:
      match.status.type === "finished"
        ? ""
        : match.status.type === "notstarted"
          ? startDate
          : match.status.description,
    // timerDisplayColour: match.status === "L" ? "green" : "gray",
    homeDetails: {
      img: resolveSportImage(match.homeTeam.name),
      score: `${match.homeScore.innings?.inning1?.wickets ?? 0}/${match.homeScore.innings?.inning1?.score ?? 0}${match.homeScore.innings?.inning2 ? `, ${match.homeScore.innings?.inning2?.wickets ?? 0}/${match.homeScore.innings?.inning2?.score ?? 0}` : ""}`,
    },
    awayDetails: {
      img: resolveSportImage(match.awayTeam.name),
      score: `${match.awayScore.innings?.inning1?.wickets ?? 0}/${match.awayScore.innings?.inning1?.score ?? 0}${match.awayScore.innings?.inning2 ? `, ${match.awayScore.innings?.inning2?.wickets ?? 0}/${match.awayScore.innings?.inning2?.score ?? 0}` : ""}`,
    },
    roundLabel: roundLabel,
    seriesName: match.tournament.name,
    seriesSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}`,
  });
}
