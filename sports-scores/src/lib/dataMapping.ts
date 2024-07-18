import { MatchSummary } from "@/types/misc";
import { MATCHSTATUSAFL, MATCHSTATUSNFL, SPORT } from "./constants";
import {
  getLocalTime,
  getLocalTimeISO,
  setMatchStatusCricket,
  setMatchSummary,
} from "./utils";
import { AFLGame } from "@/types/afl";
import { F1Session, SessionSummary } from "@/types/f1";
import { NFLGame } from "@/types/nfl";
import { CricketMatch } from "@/types/cricket";

export function mapAFLFixtureFields(matches: AFLGame[]) {
  return matches.map(
    (item: AFLGame) =>
      ({
        id: item.game.id,
        startDate: item.date,
        sport: SPORT.AFL,
        venue: item.venue,
        status: item.status.long,
        summary: setMatchSummary(
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
          name: item.teams.home.name,
        },
        awayDetails: {
          img: item.teams.away.logo,
          score: item.scores.away.score.toString(),
          name: item.teams.away.name,
        },
        roundLabel: `Round ${item.week}`,
      }) as MatchSummary,
  );
}

export function mapNFLFixtureFields(matches: NFLGame[]) {
  return matches.map(
    (item: NFLGame) =>
      ({
        id: item.game.id,
        startDate: item.game.date.date,
        sport: SPORT.NFL,
        venue: item.game.venue.name ?? "",
        status: item.game.status.long,
        summary: setMatchSummary(
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
          name: item.teams.home.name ?? "",
        },
        awayDetails: {
          img: item.teams.away.logo,
          score: (item.scores.away.total ?? 0).toString(),
          name: item.teams.away.name ?? "",
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

// export function mapCricketFixtureFields(matches: SportsmonksMatchCricket[]) {
//   return matches.map((item: SportsmonksMatchCricket) => ({
//     id: item.id,
//     startDate: item.starting_at,
//     gameid: item.id,
//     sport: SPORT.CRICKET,
//     venue: `${item.venue?.name}, ${item.venue?.city}`,
//     status: setMatchStatusCricket(item.status),
//     summary:
//       item.status === "NS"
//         ? `Starts at ${new Date(item.starting_at).toLocaleTimeString()} `
//         : item.note,
//     otherDetail: item.round,
//     homeDetails: {
//       img: item.localteam.image_path,
//       score: `${item.runs[0]?.wickets ? item.runs[0]?.wickets : "0"}/${
//         item.runs[0]?.score ? item.runs[0]?.score : "0"
//       }`,
//       name: item.localteam.name,
//     },
//     awayDetails: {
//       img: item.visitorteam.image_path,
//       score: `${item.runs[1]?.wickets ? item.runs[1]?.wickets : "0"}/${
//         item.runs[1]?.score ? item.runs[1]?.score : "0"
//       }`,
//       name: item.visitorteam.name,
//     },
//   }));
// }

export function mapScrape(data: CricketMatch[]) {
  return data.map(
    (item: CricketMatch) =>
      ({
        id: item.id,
        startDate: item.startTime,
        gameid: item.id,
        sport: SPORT.CRICKET,
        venue: item.ground.smallName,
        status: `${item.stage} - ${item.state}`,
        summary:
          item.status === "{{MATCH_START_TIME}}"
            ? `Starts at ${getLocalTimeISO(item.startTime)} `
            : item.statusText,
        timer: item.stage,
        otherDetail: item.title,
        homeDetails: {
          img: "",
          score: `${item.teams[0]?.score ?? "0"} ${item.teams[0].scoreInfo ?? ""}`,
          name: item.teams[0].team.name,
        },
        awayDetails: {
          img: "",
          score: `${item.teams[1]?.score ?? "0"} ${item.teams[1].scoreInfo ?? ""}`,
          name: item.teams[1].team.name,
        },
      }) as MatchSummary,
  );
}
