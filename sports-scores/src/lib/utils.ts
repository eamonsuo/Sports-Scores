import { MATCHSTATUSAFL } from "./constants";

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
  finished: boolean
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
  awayScore: number
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
        true
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
        false
      );
  }
}
