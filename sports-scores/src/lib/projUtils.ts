import {
  API_EVENT_TYPES,
  APIEventTypes,
  CountryFlagCode,
  DeepPartial,
  DISPLAY_TYPES,
  DisplayTypes,
  FixtureRound,
  MatchSummary,
  SportCodes,
} from "@/types/misc";
import { Sofascore_Event, Sofascore_Score } from "@/types/sofascore";
import { format } from "date-fns/format";
import { resolveSportImage } from "./imageMapping";

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
    default:
      // Includes finished
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

// Timezone detection utilities
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getTimezoneAbbr(): string {
  const timeString = new Date().toLocaleTimeString("en-US", {
    timeZoneName: "short",
  });
  return timeString.split(" ").pop() || "";
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
  return format(dateObj, "EEE MMM d yyyy");
}

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

export function mapMatchSummary(
  type: APIEventTypes,
  sport: SportCodes,
  event: any,
  options?: DeepPartial<MatchSummary>,
) {
  switch (type) {
    case API_EVENT_TYPES.SOFASCORE:
      return mapSofascoreEventToMatchSummary(sport, event, options);
    case API_EVENT_TYPES.SPORTSMONKS_CRICKET:
    default:
      return {
        id: Math.random().toString(),
        sport: sport,
        summaryText: "",
        status: "UPCOMING",
        startDate: new Date(),
        awayDetails: {},
        homeDetails: {},
        ...options,
      } as MatchSummary;
  }
}

function mapSofascoreEventToMatchSummary(
  sport: SportCodes,
  event: Sofascore_Event,
  options?: DeepPartial<MatchSummary>,
): MatchSummary {
  var startDate = new Date(0);
  startDate.setUTCSeconds(event.startTimestamp);

  return {
    id: options?.id ?? event.id,
    startDate: startDate,
    sport: sport,
    status:
      (options?.status ?? event.status.type === "inprogress")
        ? "LIVE"
        : event.status.type === "notstarted"
          ? "UPCOMING"
          : "COMPLETED",
    roundLabel: options?.roundLabel ?? `Round ${event.roundInfo?.round}`,
    timer:
      options?.timer ??
      (event.status.type === "notstarted"
        ? null // Don't format server-side, let client handle it
        : event.status.description),
    timerDisplayColour:
      options?.timerDisplayColour ??
      (event.status.type === "inprogress" ? "green" : "gray"),
    matchSlug:
      options?.matchSlug ??
      `${event.tournament.uniqueTournament.id}/${event.season.id}/${event.id}`,
    venue: options?.venue ?? event?.venue?.name ?? "",
    summaryText:
      options?.summaryText ??
      setMatchSummary(
        event.status.type,
        event.homeTeam.name,
        event.homeScore.current,
        event.awayTeam.name,
        event.awayScore.current,
      ),
    homeDetails: {
      name: options?.homeDetails?.name ?? shortenTeamNames(event.homeTeam.name),
      score:
        options?.homeDetails?.score ??
        event.homeScore.current?.toString() ??
        "0",
      img: options?.homeDetails?.img ?? resolveSportImage(event.homeTeam.name),
    },
    awayDetails: {
      name: options?.awayDetails?.name ?? shortenTeamNames(event.awayTeam.name),
      score:
        options?.awayDetails?.score ??
        event.awayScore.current?.toString() ??
        "0",
      img: options?.awayDetails?.img ?? resolveSportImage(event.awayTeam.name),
    },
  };
}

export function mapFixtureRound(
  type: APIEventTypes,
  roundDisplayType: DisplayTypes,
  matches: any[],
  matchesMapper: (match: any, roundLabel: string) => MatchSummary,
  showByes: boolean,
  teams?: { name: string; img: string }[], // Required if showByes is true
  sport?: SportCodes,
) {
  switch (type) {
    case API_EVENT_TYPES.SOFASCORE:
      return mapSofascoreEventsToFixtureRounds(
        roundDisplayType,
        matches,
        matchesMapper,
        showByes,
        teams,
        sport,
      );
    case API_EVENT_TYPES.SPORTSMONKS_CRICKET:
    default:
      return [
        {
          matches: [],
          roundLabel: "",
        } as FixtureRound,
      ];
  }
}

function mapSofascoreEventsToFixtureRounds(
  roundDisplayType: DisplayTypes,
  matches: Sofascore_Event[],
  matchesMapper: (match: Sofascore_Event, roundLabel: string) => MatchSummary,
  showByes: boolean,
  teams?: { name: string; img: string }[], // Required if showByes is true
  sport?: SportCodes,
) {
  // Create rounds object { round: string; matches: Sofascore_Event[]; byes: { name: string; img: string }[] }
  const tempRounds = Object.values(
    matches.reduce(
      (acc, match) => {
        let round = "";
        switch (roundDisplayType) {
          case DISPLAY_TYPES.ROUND:
            round =
              match.roundInfo?.name ?? `Round ${match.roundInfo?.round ?? 0}`;
            break;
          case DISPLAY_TYPES.DATE:
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);
            // startDate = addHours(startDate, 10);

            round = format(startDate, "eee d MMM");
            break;
          case DISPLAY_TYPES.LEAGUE:
            round = match.tournament.name;
            break;
        }

        if (round !== undefined) {
          if (!acc[round]) {
            acc[round] = showByes
              ? { round, matches: [], byes: teams }
              : { round, matches: [] };
          }

          acc[round].matches.push(match);
          acc[round].roundSlug = sport
            ? `${sport}/${match.tournament.uniqueTournament.id}/${match.season.id}`
            : undefined;
          if (showByes) {
            acc[round].byes = acc[round]?.byes?.filter(
              (team) =>
                team.name !== match.homeTeam.name &&
                team.name !== match.awayTeam.name,
            );
          }
        }
        return acc;
      },
      {} as Record<
        string,
        {
          round: string;
          matches: Sofascore_Event[];
          byes?: { name: string; img: string }[];
          roundSlug?: string;
        }
      >,
    ),
  );

  return tempRounds.map((roundData) => {
    return {
      matches: roundData.matches.map((match) =>
        matchesMapper(match, roundData.round),
      ),
      roundLabel: roundData.round,
      byes: roundData.byes,
      roundSlug: roundData.roundSlug,
    } as FixtureRound;
  });
}

export function getCurrentRound(
  roundDisplayType: DisplayTypes,
  rounds: FixtureRound[],
) {
  switch (roundDisplayType) {
    case DISPLAY_TYPES.ROUND:
      // Find first round with upcoming matches
      return (
        rounds.find((r) => r.matches.some((m) => m.status === "UPCOMING"))
          ?.roundLabel ??
        rounds[rounds.length - 1]?.roundLabel ??
        "Round 0"
      );
    case DISPLAY_TYPES.DATE:
      let startDate = new Date();
      return rounds
        .map((item) => item.roundLabel)
        .includes(format(startDate, "eee d MMM"))
        ? format(startDate, "eee d MMM")
        : rounds[0].roundLabel;

    case DISPLAY_TYPES.LEAGUE:
      return rounds[0].roundLabel ?? "League";
  }
}
