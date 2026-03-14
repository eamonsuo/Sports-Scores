import { CountryFlagCode } from "@/types/misc";
import { Sofascore_Score } from "@/types/sofascore";
import { format } from "date-fns/format";

const fallback = "/vercel.svg";

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
    ? finished
      ? "Match Drawn"
      : `${homeName} ${description} ${0}`
    : `${winningTeam} ${description} ${winningMargin}`;
}

export function setMatchSummary(
  status: string,
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
) {
  switch (status) {
    case "notstarted":
      return ``;
    case "postponed":
      return "Match Postponed";
    case "finished":
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        true,
      );
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

export function getCountryImageUrl(countryCode?: CountryFlagCode) {
  if (countryCode === null || countryCode === undefined) {
    return fallback;
  }

  return `https://flagcdn.com/${countryCode}.svg`;
}

export function shortenTeamNames(team: string) {
  switch (team) {
    //AFL
    case "Greater Western Sydney Giants":
      return "GWS Giants";
    case "North Melbourne Kangaroos":
      return "North Melbourne";
    case "North Melbourne Kangaroos II":
      return "North Melbourne II";
    //NFL
    case "Washington Commanders":
      return "Washington Comm.";
    case "Tampa Bay Buccaneers":
      return "Tampa Bay Buccs";
    case "Los Angeles Chargers":
      return "LA Chargers";
    //NRL
    case "North Queensland Cowboys":
      return "North QLD Cowboys";
    case "St. George Illawarra Dragons":
      return "St George Illawarra";
    case "South Sydney Rabbitohs":
      return "South Sydney Rabbits";
    case "New Zealand Warriors":
      return "NZ Warriors";
    default:
      return team;
  }
}

/**
 * Format time as a string in user's timezone.
 * Use this in client components to format times.
 * Client-side: formats in user's browser timezone
 * Server-side: formats in server's timezone (UTC)
 */
export function formatTime(date: Date | number | null | undefined): string {
  if (!date) return "";

  const dateObj = typeof date === "number" ? new Date(date) : date;

  // Format in execution environment's timezone
  return format(dateObj, "h:mm a");
}

/**
 * Format date in long format (EEE MMM d yyyy) in user's timezone.
 * Use this in client components to format dates.
 * Client-side: formats in user's browser timezone
 * Server-side: formats in server's timezone (UTC)
 */
export function formatDateLong(date: Date | number | null | undefined): string {
  if (!date) return "";

  const dateObj = typeof date === "number" ? new Date(date) : date;

  // Format in execution environment's timezone
  return format(dateObj, "EEE d MMM yyyy");
}

export const formatDate = (date: Date) => format(date, "d MMM");
export const formatDateYear = (date: Date) => format(date, "d MMM yyyy");

export function formatPeriodScores(
  homeScore: Sofascore_Score,
  awayScore: Sofascore_Score,
  showWinnerFirst: boolean = false,
  winner?: number,
) {
  const periodKeys = Object.keys(homeScore).filter(
    (key) => key.includes("period") && !key.includes("TieBreak"),
  );

  // Determine if we should reverse scores (show away/home instead of home/away)
  const shouldReverse = showWinnerFirst && winner === 2;

  const periodScores = periodKeys.map((periodKey) => {
    const tieBreakKey = `${periodKey}TieBreak` as keyof Sofascore_Score;
    const homeVal = homeScore[periodKey as keyof Sofascore_Score];
    const awayVal = awayScore[periodKey as keyof Sofascore_Score];

    let scoreStr = shouldReverse
      ? `${awayVal}-${homeVal}`
      : `${homeVal}-${awayVal}`;

    // Check if there's a tie break for this period
    if (
      homeScore[tieBreakKey] !== undefined &&
      awayScore[tieBreakKey] !== undefined
    ) {
      const homeTB = homeScore[tieBreakKey];
      const awayTB = awayScore[tieBreakKey];
      scoreStr += shouldReverse
        ? ` (${awayTB}-${homeTB})`
        : ` (${homeTB}-${awayTB})`;
    }

    return scoreStr;
  });

  return periodScores.join(", ");
}

export function setTennisMatchSummary(
  status: string,
  winner: number,
  homeName: string,
  awayName: string,
  homeScore: number,
  awayScore: number,
) {
  switch (status) {
    case "notstarted":
      return ``;
    case "postponed":
      return "Match Postponed";
    case "finished":
      return winner !== undefined
        ? `${winner === 1 ? homeName : awayName} wins`
        : "";
    case "inprogress":
      if (homeScore > awayScore) {
        return `${homeName} leading ${homeScore}-${awayScore}`;
      } else if (awayScore > homeScore) {
        return `${awayName} leading ${awayScore}-${homeScore}`;
      }
      return `Match tied at ${homeScore}-${awayScore}`;
    default:
      return "";
  }
}
