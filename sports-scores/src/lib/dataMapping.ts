import { AFLGame } from "@/types/afl";
import { BaseballGame } from "@/types/baseball";
import {
  Cricket_LiveScoreAPI_MatchesListByDate,
  Cricket_LiveScoreAPI_TeamDetails,
} from "@/types/cricket";
import { F1Session, SessionSummary } from "@/types/f1";
import { MatchStatus, MatchSummary } from "@/types/misc";
import { NFLGame, NFLStanding } from "@/types/nfl";
import { MATCHSTATUSAFL, MATCHSTATUSNFL, SPORT } from "./constants";
import { getLocalTime, setMatchSummary, shortenTeamNames } from "./projUtils";

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

export function mapNFLFixtureFields(
  matches: NFLGame[],
  standings?: NFLStanding[],
) {
  return matches.map(
    (item: NFLGame) =>
      ({
        id: item.game.id,
        startDate: new Date(
          item.game.date.date + "T" + item.game.date.time + ":00+00:00",
        ), //Ensures startTime is in UTC
        sport: SPORT.NFL,
        venue: item.game.venue.name ?? "",
        status: "COMPLETED",
        summaryText: setMatchSummary(
          item.game.status.short,
          getLocalTime(item.game.date.time),
          item.teams.home.name ?? "",
          item.scores.home.total ?? 0,
          item.teams.away.name ?? "",
          item.scores.away.total ?? 0,
        ),
        timer:
          item.game.status.short === MATCHSTATUSNFL.SHORT_NS
            ? getLocalTime(item.game.date.time)
            : item.game.status.short,
        homeDetails: {
          img: item.teams.home.logo,
          score: (item.scores.home.total ?? 0).toString(),
          name: shortenTeamNames(item.teams.home.name ?? ""),
          winDrawLoss: standings
            ? `${standings.find((x) => x.team.id === item.teams.home.id)?.won}-${standings.find((x) => x.team.id === item.teams.home.id)?.ties}-${standings.find((x) => x.team.id === item.teams.home.id)?.lost}`
            : "",
        },
        awayDetails: {
          img: item.teams.away.logo,
          score: (item.scores.away.total ?? 0).toString(),
          name: shortenTeamNames(item.teams.away.name ?? ""),
          winDrawLoss: standings
            ? `${standings.find((x) => x.team.id === item.teams.away.id)?.won}-${standings.find((x) => x.team.id === item.teams.away.id)?.ties}-${standings.find((x) => x.team.id === item.teams.away.id)?.lost}`
            : "",
        },
        roundLabel: `${item.game.stage === "Pre Season" ? "Pre - " : ""}${item.game.week === "Hall of Fame Weekend" ? "HOF Weekend" : item.game.week}`,
      }) as MatchSummary,
  );
}

export function mapF1SessionFields(sessions: F1Session[]) {
  return sessions.map(
    (item: F1Session) =>
      ({
        id: item.id,
        name: item.competition.name,
        logo: item.circuit.image,
        status: item.status,
        type: item.type,
        startDate: item.date,
        sport: SPORT.F1,
      }) as SessionSummary,
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
        seriesSlug: ``,
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
