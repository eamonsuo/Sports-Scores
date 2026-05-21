/**
 * Generates a JSON matrix for the GitHub Actions bulk-upload workflow.
 *
 * Reads league constants and outputs the latest season for each configured
 * league as a JSON array to stdout.
 *
 * To add or remove leagues from the scheduled sync, edit the SYNC_CONFIG
 * array below.
 */

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
} from "@/lib/constants"
import { DisplayTypes, LeagueSeasonConfig } from "@/types/misc"

// ---------------------------------------------------------------------------
// Configure which leagues to sync. Each entry maps a sport key + display type
// to a set of league slugs. Use "*" to include all leagues for that sport.
// ---------------------------------------------------------------------------

type SyncEntry = {
  sport: string
  displayType: DisplayTypes
  leagues: LeagueSeasonConfig[]
  /** Slugs to include. Omit or use ["*"] for all. */
  slugs?: string[]
}

const SYNC_CONFIG: SyncEntry[] = [
  {
    sport: "rugby-league",
    displayType: DisplayTypes.ROUND,
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
  {
    sport: "aussie-rules",
    displayType: DisplayTypes.ROUND,
    leagues: AUSSIE_RULES_LEAGUES,
    slugs: ["656", "10159", "25506", "20126", "20160"],
  },
  {
    sport: "american-football",
    displayType: DisplayTypes.ROUND,
    leagues: AMERICAN_FOOTBALL_LEAGUES,
    slugs: ["9464"],
  },
  {
    sport: "basketball",
    displayType: DisplayTypes.DATE,
    leagues: BASKETBALL_LEAGUES,
    slugs: ["1524", "1506", "132", "486"],
  },
  {
    sport: "baseball",
    displayType: DisplayTypes.DATE,
    leagues: BASEBALL_LEAGUES,
    slugs: ["11205", "19445"],
  },
  {
    sport: "ice-hockey",
    displayType: DisplayTypes.DATE,
    leagues: ICE_HOCKEY_LEAGUES,
    slugs: ["11059", "234"],
  },
  {
    sport: "rugby-union",
    displayType: DisplayTypes.ROUND,
    leagues: RUGBY_UNION_LEAGUES,
    slugs: ["422"],
  },
  // {
  //   sport: "cricket",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: CRICKET_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "netball",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: NETBALL_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "tennis",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: TENNIS_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "tennis",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: TENNIS_CATEGORIES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "darts",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: DARTS_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "motorsport",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: MOTORSPORT_CATEGORIES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "golf",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: GOLF_TOURS,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "cycling",
  //   displayType: DisplayTypes.ROUND,
  //   leagues: CYCLING_TOURS,
  //   slugs: ["*"],
  // },
]

// ---------------------------------------------------------------------------
// Build the matrix
// ---------------------------------------------------------------------------

type MatrixEntry = {
  name: string
  leagueId: string
  seasonId: string
  sport: string
  displayType: string
}

const matrix: MatrixEntry[] = []

for (const config of SYNC_CONFIG) {
  const filtered =
    !config.slugs || config.slugs.includes("*")
      ? config.leagues
      : config.leagues.filter((l) => config.slugs!.includes(l.slug))

  for (const league of filtered) {
    const latestSeason = league.seasons[0]
    if (!latestSeason || !latestSeason.slug) continue

    matrix.push({
      name: `${league.name} ${latestSeason.name}`,
      leagueId: league.slug,
      seasonId: latestSeason.slug,
      sport: config.sport,
      displayType: league.display ?? config.displayType,
    })
  }
}

// ---------------------------------------------------------------------------
// All leagues config (used for league lookup generation)
// ---------------------------------------------------------------------------

const ALL_LEAGUES_CONFIG: SyncEntry[] = [
  {
    sport: "rugby-league",
    displayType: DisplayTypes.ROUND,
    leagues: RUGBY_LEAGUE_LEAGUES,
  },
  {
    sport: "football",
    displayType: DisplayTypes.ROUND,
    leagues: FOOTBALL_LEAGUES,
  },
  {
    sport: "aussie-rules",
    displayType: DisplayTypes.ROUND,
    leagues: AUSSIE_RULES_LEAGUES,
  },
  {
    sport: "american-football",
    displayType: DisplayTypes.ROUND,
    leagues: AMERICAN_FOOTBALL_LEAGUES,
  },
  {
    sport: "basketball",
    displayType: DisplayTypes.DATE,
    leagues: BASKETBALL_LEAGUES,
  },
  {
    sport: "baseball",
    displayType: DisplayTypes.DATE,
    leagues: BASEBALL_LEAGUES,
  },
  {
    sport: "ice-hockey",
    displayType: DisplayTypes.DATE,
    leagues: ICE_HOCKEY_LEAGUES,
  },
  {
    sport: "rugby-union",
    displayType: DisplayTypes.ROUND,
    leagues: RUGBY_UNION_LEAGUES,
  },
  {
    sport: "cricket",
    displayType: DisplayTypes.ROUND,
    leagues: CRICKET_LEAGUES,
  },
  {
    sport: "netball",
    displayType: DisplayTypes.ROUND,
    leagues: NETBALL_LEAGUES,
  },
  {
    sport: "tennis",
    displayType: DisplayTypes.ROUND,
    leagues: TENNIS_LEAGUES,
  },
  {
    sport: "tennis",
    displayType: DisplayTypes.ROUND,
    leagues: TENNIS_CATEGORIES,
  },
  { sport: "darts", displayType: DisplayTypes.ROUND, leagues: DARTS_LEAGUES },
  {
    sport: "motorsport",
    displayType: DisplayTypes.ROUND,
    leagues: MOTORSPORT_CATEGORIES,
  },
  { sport: "golf", displayType: DisplayTypes.ROUND, leagues: GOLF_TOURS },
  {
    sport: "cycling",
    displayType: DisplayTypes.ROUND,
    leagues: CYCLING_TOURS,
  },
]

// ---------------------------------------------------------------------------
// Build league lookup (for single-mode resolve at runtime)
// ---------------------------------------------------------------------------

type LeagueLookupEntry = {
  leagueId: string
  seasonId: string
  sport: string
  displayType: string
}

const leagueLookup: Record<string, LeagueLookupEntry> = {}

for (const config of ALL_LEAGUES_CONFIG) {
  for (const league of config.leagues) {
    const latestSeason = league.seasons[0]
    if (!latestSeason || !latestSeason.slug) continue

    const key = `${config.sport} — ${league.name}`
    leagueLookup[key] = {
      leagueId: league.slug,
      seasonId: latestSeason.slug,
      sport: config.sport,
      displayType: league.display ?? config.displayType,
    }
  }
}

// ---------------------------------------------------------------------------
// Write all output files
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const weeklyPath = resolve(__dirname, "eventUploadMatrix.json")
writeFileSync(weeklyPath, JSON.stringify(matrix, null, 2))
console.log(`Wrote ${matrix.length} entries to ${weeklyPath}`)

const lookupPath = resolve(__dirname, "leagueLookup.json")
writeFileSync(lookupPath, JSON.stringify(leagueLookup, null, 2))
console.log(
  `Wrote ${Object.keys(leagueLookup).length} entries to ${lookupPath}`,
)

// ---------------------------------------------------------------------------
// Inject league choices into the workflow YAML
// ---------------------------------------------------------------------------

const workflowPath = resolve(
  __dirname,
  "../../.github/workflows/bulk-upload-latest-events.yml",
)

const yamlContent = readFileSync(workflowPath, "utf-8")

const startMarker = "# --- LEAGUE_CHOICES_START ---"
const endMarker = "# --- LEAGUE_CHOICES_END ---"

const startIdx = yamlContent.indexOf(startMarker)
const endIdx = yamlContent.indexOf(endMarker)

if (startIdx !== -1 && endIdx !== -1) {
  const choices = Object.keys(leagueLookup)
    .sort()
    .map((key) => `          - "${key}"`)
    .join("\n")

  const before = yamlContent.substring(0, startIdx + startMarker.length)
  const after = yamlContent.substring(endIdx)
  const newYaml = `${before}\n${choices}\n          ${after}`

  writeFileSync(workflowPath, newYaml)
  console.log(
    `Injected ${Object.keys(leagueLookup).length} league choices into workflow YAML`,
  )
} else {
  console.warn(
    "⚠️  Could not find LEAGUE_CHOICES markers in workflow YAML. Add markers manually.",
  )
}
