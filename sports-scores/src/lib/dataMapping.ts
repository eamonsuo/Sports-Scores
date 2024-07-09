import { SPORT } from "./constants";
import { getLocalTime, setMatchSummary } from "./utils";

export function mapAflFixtureFields(matches: AFLGame[]): MatchSummary[] {
  return matches.map((item: AFLGame) => ({
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
    otherDetail: `Round ${item.week}`,
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
  }));
}

export function mapNFLFixtureFields(matches: NFLGame[]): MatchSummary[] {
  return matches.map((item: NFLGame) => ({
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
    otherDetail: item.game.stage.concat(", ", item.game.week),
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
  }));
}

export function mapF1SessionFields(sessions: F1Session[]): SessionSummary[] {
  return sessions.map((item: F1Session) => ({
    id: item.id,
    name: item.competition.name,
    logo: item.circuit.image,
    status: item.status,
    type: item.type,
    startDate: item.date,
    sport: SPORT.F1,
  }));
}
