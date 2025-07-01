import {
  APISportsErrors,
  APISportsResponse,
  CountryFlagCode,
  MatchSummary,
} from "@/types/misc";
import { MATCHSTATUSAFL, MATCHSTATUSNFL } from "./constants";

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
    case "notstarted":
    case MATCHSTATUSAFL.SHORT_NS:
    case MATCHSTATUSNFL.SHORT_NS:
      return ``;
    case MATCHSTATUSAFL.SHORT_FT:
    case MATCHSTATUSNFL.SHORT_FT:
    case MATCHSTATUSNFL.SHORT_AOT:
    case "finished":
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        true,
      );
    case MATCHSTATUSAFL.SHORT_CANC:
    case MATCHSTATUSNFL.SHORT_CANC:
      return "Match Cancelled";
    case MATCHSTATUSAFL.SHORT_PST:
    case MATCHSTATUSNFL.SHORT_PST:
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

export function getCurrentWeek(data: MatchSummary[]) {
  let curDate = new Date(Date.now());
  curDate.setHours(0, 0, 0, 0);

  let record = data.find((item) => {
    let itemDate = new Date(item.startDate);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate >= curDate;
  });

  return record?.roundLabel ?? data[data.length - 1].roundLabel ?? "";
}

export function toShortTimeString(date: Date) {
  return date
    .toLocaleTimeString("en-US", {
      timeZone: "Australia/Brisbane",
    })
    .replace(":00 ", " ");
}

//Convert to AEST
//startTime format: hh:mm
export function getLocalTime(startTime: string) {
  let splitTime = startTime.split(":");
  let tempDate = new Date(
    Date.UTC(0, 0, 0, Number(splitTime[0]), Number(splitTime[1])),
  );
  return tempDate
    .toLocaleTimeString("en-US", {
      timeZone: "Australia/Brisbane",
    })
    .replace(":00 ", " ");
}

//Convert to AEST
//startTime format: yyyy-mm-ddThh:mm:ss.sssZ
export function getLocalTimeISO(startTime: string) {
  // let splitTime = startTime.split(":");
  let tempDate = new Date(startTime);
  return tempDate
    .toLocaleTimeString("en-US", {
      timeZone: "Australia/Brisbane",
    })
    .replace(":00 ", " ");
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

export function handleAPIErrors(response: APISportsResponse) {
  if ((response.errors as any[]).length === undefined) {
    return (
      (response.errors as APISportsErrors).rateLimit ??
      (response.errors as APISportsErrors).requests ??
      (response.errors as APISportsErrors).token ??
      "Unknown error"
    );
  }
  return "No Results";
}

export function dateToCustomString(date: Date) {
  return date
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Australia/Brisbane",
    })
    .replaceAll(",", "");
}
