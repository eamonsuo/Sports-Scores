/**
 * Generates a JSON matrix for the GitHub Actions bulk-upload workflow.
 *
 * Reads league constants and outputs the latest season for each configured
 * league as a JSON array to stdout.
 *
 * To add or remove leagues from the scheduled sync, edit the SYNC_CONFIG
 * array below.
 */

import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import {
  AMERICAN_FOOTBALL_LEAGUES,
  AUSSIE_RULES_LEAGUES,
  BASEBALL_LEAGUES,
  BASKETBALL_LEAGUES,
  CRICKET_LEAGUES,
  CYCLING_TOURS,
  DARTS_LEAGUES,
  FOOTBALL_LEAGUES,
  GOLF_TOURS,
  ICE_HOCKEY_LEAGUES,
  MOTORSPORT_CATEGORIES,
  NETBALL_LEAGUES,
  RUGBY_LEAGUE_LEAGUES,
  RUGBY_UNION_LEAGUES,
  TENNIS_CATEGORIES,
  TENNIS_LEAGUES,
} from "@/lib/constants";
import { DISPLAY_TYPES } from "@/types/misc";

// ---------------------------------------------------------------------------
// Configure which leagues to sync. Each entry maps a sport key + display type
// to a set of league slugs. Use "*" to include all leagues for that sport.
// ---------------------------------------------------------------------------

type SyncEntry = {
  sport: string;
  displayType: DISPLAY_TYPES;
  leagues: LeagueSeasonConfig[];
  /** Slugs to include. Omit or use ["*"] for all. */
  slugs?: string[];
};

const SYNC_CONFIG: SyncEntry[] = [
  {
    sport: "rugby-league",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: RUGBY_LEAGUE_LEAGUES,
    slugs: ["294", "19120", "2135", "2134"],
  },
  // {
  //   sport: "rugby-league",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: RUGBY_LEAGUE_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "football",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: FOOTBALL_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "aussie-rules",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: AUSSIE_RULES_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "american-football",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: AMERICAN_FOOTBALL_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "basketball",
  //   displayType: DISPLAY_TYPES.DATE,
  //   leagues: BASKETBALL_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "baseball",
  //   displayType: DISPLAY_TYPES.DATE,
  //   leagues: BASEBALL_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "ice-hockey",
  //   displayType: DISPLAY_TYPES.DATE,
  //   leagues: ICE_HOCKEY_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "rugby-union",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: RUGBY_UNION_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "cricket",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: CRICKET_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "netball",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: NETBALL_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "tennis",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: TENNIS_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "tennis",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: TENNIS_CATEGORIES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "darts",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: DARTS_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "motorsport",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: MOTORSPORT_CATEGORIES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "golf",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: GOLF_TOURS,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "cycling",
  //   displayType: DISPLAY_TYPES.ROUND,
  //   leagues: CYCLING_TOURS,
  //   slugs: ["*"],
  // },
];

// ---------------------------------------------------------------------------
// Build the matrix
// ---------------------------------------------------------------------------

type MatrixEntry = {
  name: string;
  tournamentId: string;
  seasonId: string;
  sport: string;
  displayType: string;
};

const matrix: MatrixEntry[] = [];

for (const config of SYNC_CONFIG) {
  const filtered =
    !config.slugs || config.slugs.includes("*")
      ? config.leagues
      : config.leagues.filter((l) => config.slugs!.includes(l.slug));

  for (const league of filtered) {
    const latestSeason = league.seasons[0];
    if (!latestSeason || !latestSeason.slug) continue;

    matrix.push({
      name: `${league.name} ${latestSeason.name}`,
      tournamentId: league.slug,
      seasonId: latestSeason.slug,
      sport: config.sport,
      displayType: league.display ?? config.displayType,
    });
  }
}

// ---------------------------------------------------------------------------
// Build the "all leagues" matrix (every league, latest season)
// ---------------------------------------------------------------------------

const ALL_LEAGUES_CONFIG: SyncEntry[] = [
  {
    sport: "rugby-league",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: RUGBY_LEAGUE_LEAGUES,
  },
  {
    sport: "football",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: FOOTBALL_LEAGUES,
  },
  {
    sport: "aussie-rules",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: AUSSIE_RULES_LEAGUES,
  },
  {
    sport: "american-football",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: AMERICAN_FOOTBALL_LEAGUES,
  },
  {
    sport: "basketball",
    displayType: DISPLAY_TYPES.DATE,
    leagues: BASKETBALL_LEAGUES,
  },
  {
    sport: "baseball",
    displayType: DISPLAY_TYPES.DATE,
    leagues: BASEBALL_LEAGUES,
  },
  {
    sport: "ice-hockey",
    displayType: DISPLAY_TYPES.DATE,
    leagues: ICE_HOCKEY_LEAGUES,
  },
  {
    sport: "rugby-union",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: RUGBY_UNION_LEAGUES,
  },
  {
    sport: "cricket",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: CRICKET_LEAGUES,
  },
  {
    sport: "netball",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: NETBALL_LEAGUES,
  },
  {
    sport: "tennis",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: TENNIS_LEAGUES,
  },
  {
    sport: "tennis",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: TENNIS_CATEGORIES,
  },
  { sport: "darts", displayType: DISPLAY_TYPES.ROUND, leagues: DARTS_LEAGUES },
  {
    sport: "motorsport",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: MOTORSPORT_CATEGORIES,
  },
  { sport: "golf", displayType: DISPLAY_TYPES.ROUND, leagues: GOLF_TOURS },
  {
    sport: "cycling",
    displayType: DISPLAY_TYPES.ROUND,
    leagues: CYCLING_TOURS,
  },
];

const allMatrix: MatrixEntry[] = [];

for (const config of ALL_LEAGUES_CONFIG) {
  for (const league of config.leagues) {
    const latestSeason = league.seasons[0];
    if (!latestSeason || !latestSeason.slug) continue;

    allMatrix.push({
      name: `${league.name} ${latestSeason.name}`,
      tournamentId: league.slug,
      seasonId: latestSeason.slug,
      sport: config.sport,
      displayType: league.display ?? config.displayType,
    });
  }
}

// ---------------------------------------------------------------------------
// Write both matrix files
// ---------------------------------------------------------------------------

import { writeFileSync } from "fs";
import { resolve } from "path";

const weeklyPath = resolve(__dirname, "eventUploadMatrix.json");
writeFileSync(weeklyPath, JSON.stringify(matrix, null, 2));
console.log(`Wrote ${matrix.length} entries to ${weeklyPath}`);

const allPath = resolve(__dirname, "eventUploadMatrixAll.json");
writeFileSync(allPath, JSON.stringify(allMatrix, null, 2));
console.log(`Wrote ${allMatrix.length} entries to ${allPath}`);
