import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MATCHSTATUSAFL, MATCHSTATUSNFL, SPORT } from "./constants";
import { MatchSummary } from "@/types/misc";

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
      return ``;
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
