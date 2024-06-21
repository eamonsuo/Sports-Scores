import { MATCHSTATUSAFL, SPORT } from "./constants";

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

export function calculateAFLMatchResult(
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

export function setAFLMatchSummary(
  status: string,
  startDate: string,
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
) {
  switch (status) {
    case MATCHSTATUSAFL.SHORT_NS:
      let tempDate: Date = new Date(startDate);
      return `Starts at ${tempDate.toLocaleTimeString()} `;
    case MATCHSTATUSAFL.SHORT_FT:
      return calculateAFLMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        true,
      );
    case MATCHSTATUSAFL.SHORT_CANC:
      return "Match Cancelled";
    case MATCHSTATUSAFL.SHORT_PST:
      return "Match Postponed";
    default:
      return calculateAFLMatchResult(
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
    startDate: item.date,
    sport: SPORT.AFL,
    venue: item.venue,
    status: item.status.long,
    summary: setAFLMatchSummary(
      item.status.short,
      item.date,
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
  }));
}
