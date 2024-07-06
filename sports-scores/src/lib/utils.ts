import { MATCHSTATUSAFL, MATCHSTATUSNFL, SPORT } from "./constants";

export function setMatchStatusCricket(status: string) {
  switch (status) {
    case "Aban.":
      return "Abandoned";
    case "NS":
      return "Upcoming";
    default:
      return status;
  }
}

export function calculateMatchResult(
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
  finished: boolean,
) {
  let winningTeam: string = "";
  let winningMargin: number;
  let description: string = "";

  finished ? (description = "won by") : (description = "lead by");

  if (homeScore > awayScore) {
    winningMargin = homeScore - awayScore;
    winningTeam = homeName;
  } else if (homeScore < awayScore) {
    winningMargin = awayScore - homeScore;
    winningTeam = awayName;
  } else {
    winningMargin = 0;
  }

  return winningMargin == 0
    ? "Match Drawn"
    : `${winningTeam} ${description} ${winningMargin}`;
}

export function setMatchSummary(
  status: string,
  startTime: string,
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
) {
  switch (status) {
    case MATCHSTATUSAFL.SHORT_NS || MATCHSTATUSNFL.SHORT_NS:
      return `Starts at ${startTime}`;
    case MATCHSTATUSAFL.SHORT_FT || MATCHSTATUSNFL.SHORT_FT:
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        true,
      );
    case MATCHSTATUSAFL.SHORT_CANC || MATCHSTATUSNFL.SHORT_CANC:
      return "Match Cancelled";
    case MATCHSTATUSAFL.SHORT_PST || MATCHSTATUSNFL.SHORT_PST:
      return "Match Postponed";
    default:
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        false,
      );
  }
}

export function mapAflFixtureFields(matches: AFLGame[]): MatchSummary[] {
  return matches.map((item: AFLGame) => ({
    id: item.game.id,
    startDate: item.date, //Edit date to be in correct timezone
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

export function getCurrentWeek(data: MatchSummary[]) {
  let curDate = new Date(Date.now());
  curDate.setHours(0, 0, 0, 0);

  let record = data.find((item) => {
    let itemDate = new Date(item.startDate);
    itemDate.setHours(0, 0, 0, 0);
    item;
    return itemDate >= curDate;
  });

  return record?.roundLabel ?? "";
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

//Convert to AEST
//startTime format: hh:mm
export function getLocalTime(startTime: string) {
  let splitTime = startTime.split(":");
  let tempDate = new Date(
    Date.UTC(0, 0, 0, Number(splitTime[0]), Number(splitTime[1])),
  );
  return tempDate.toLocaleTimeString("en-US", {
    timeZone: "Australia/Brisbane",
  });
}
