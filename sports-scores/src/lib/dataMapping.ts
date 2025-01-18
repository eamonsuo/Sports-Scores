import { AFLGame } from "@/types/afl";
import { BaseballGame } from "@/types/baseball";
import { CricketMatch } from "@/types/cricket";
import { F1Session, SessionSummary } from "@/types/f1";
import { MatchSummary } from "@/types/misc";
import { NFLGame, NFLStanding } from "@/types/nfl";
import { MATCHSTATUSAFL, MATCHSTATUSNFL, SPORT } from "./constants";
import {
  getCricketImageUrl,
  getLocalTime,
  getLocalTimeISO,
  setMatchSummary,
  shortenTeamNames,
} from "./projUtils";

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
        startDate: item.date,
        sport: SPORT.BASEBALL,
        venue: "",
        status: item.status.long,
        summary: "",
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
        startDate:
          item.game.date.date + "T" + item.game.date.time + ":00+00:00", //Ensures startTime is in UTC
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
  return data.map((item: CricketMatch) => {
    let homeTeam = item.teams[0].isHome ? item.teams[0] : item.teams[1];
    let awayTeam = item.teams[0].isHome ? item.teams[1] : item.teams[0];
    return {
      id: item.id,
      startDate: item.startTime,
      gameid: item.id,
      sport: SPORT.CRICKET,
      venue: item.ground?.smallName,
      status: `${item.stage} - ${item.state}`,
      summary:
        item.status === "{{MATCH_START_TIME}}"
          ? `Starts at ${getLocalTimeISO(item.startTime)} `
          : item.statusText,
      timer: item.status === "{{MATCH_START_TIME}}" ? "Scheduled" : item.status,
      otherDetail: item.title,
      homeDetails: {
        img: getCricketImageUrl(homeTeam.team.imageUrl),
        score: `${homeTeam?.score ?? "0"}`,
        name: homeTeam.team.name,
      },
      awayDetails: {
        img: getCricketImageUrl(awayTeam.team.imageUrl),
        score: `${awayTeam?.score ?? "0"}`,
        name: awayTeam.team.name,
      },
      seriesName: item.series.longName,
      matchSlug: `${item.slug}-${item.objectId}`,
      seriesSlug: `${item.series.slug}-${item.series.objectId}`,
    } as MatchSummary;
  });
}
