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
import { LeagueSeasonConfig } from "@/types/misc"

// ---------------------------------------------------------------------------
// Configure which leagues to sync. Each entry maps a sport key + display type
// to a set of league slugs. Use "*" to include all leagues for that sport.
// ---------------------------------------------------------------------------

type SyncEntry = {
  sport: string
  leagues: LeagueSeasonConfig[]
  /** Slugs to include. Omit or use ["*"] for all. */
  slugs?: string[]
}

const SYNC_CONFIG: SyncEntry[] = [
  {
    sport: "rugby-league",
    leagues: RUGBY_LEAGUE_LEAGUES,
    slugs: ["294", "19120", "2135", "2134"],
  },
  {
    sport: "football",
    leagues: FOOTBALL_LEAGUES,
    slugs: ["136", "1894", "1786", "17", "19"],
  },
  {
    sport: "aussie-rules",
    leagues: AUSSIE_RULES_LEAGUES,
    slugs: ["656", "10159", "25506"],
  },
  {
    sport: "american-football",
    leagues: AMERICAN_FOOTBALL_LEAGUES,
    slugs: ["9464"],
  },
  {
    sport: "basketball",
    leagues: BASKETBALL_LEAGUES,
    slugs: ["1524", "1506", "132", "486"],
  },
  {
    sport: "baseball",
    leagues: BASEBALL_LEAGUES,
    slugs: ["11205", "19445"],
  },
  {
    sport: "ice-hockey",
    leagues: ICE_HOCKEY_LEAGUES,
    slugs: ["11059", "234"],
  },
  {
    sport: "rugby-union",
    leagues: RUGBY_UNION_LEAGUES,
    slugs: ["422"],
  },
  // {
  //   sport: "cricket",
  //   leagues: CRICKET_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "netball",
  //   leagues: NETBALL_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  // {
  //   sport: "tennis",
  //   leagues: TENNIS_CATEGORIES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "darts",
  //   leagues: DARTS_LEAGUES,
  //   slugs: ["*"],
  // },
  // {
  //   sport: "motorsport",
  //   leagues: MOTORSPORT_CATEGORIES,
  //   slugs: ["40", "17"],
  // },
  {
    sport: "golf",
    leagues: GOLF_TOURS,
    slugs: ["pga", "liv", "dpworld", "lpga", "australasia", "tgl"],
  },
  // {
  //   sport: "cycling",
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
    })
  }
}

// ---------------------------------------------------------------------------
// All leagues config (used for league lookup generation)
// ---------------------------------------------------------------------------

const ALL_LEAGUES_CONFIG: SyncEntry[] = [
  {
    sport: "rugby-league",
    leagues: RUGBY_LEAGUE_LEAGUES,
  },
  {
    sport: "football",
    leagues: FOOTBALL_LEAGUES,
  },
  {
    sport: "aussie-rules",
    leagues: AUSSIE_RULES_LEAGUES,
  },
  {
    sport: "american-football",
    leagues: AMERICAN_FOOTBALL_LEAGUES,
  },
  {
    sport: "basketball",
    leagues: BASKETBALL_LEAGUES,
  },
  {
    sport: "baseball",
    leagues: BASEBALL_LEAGUES,
  },
  {
    sport: "ice-hockey",
    leagues: ICE_HOCKEY_LEAGUES,
  },
  {
    sport: "rugby-union",
    leagues: RUGBY_UNION_LEAGUES,
  },
  {
    sport: "cricket",
    leagues: CRICKET_LEAGUES,
  },
  {
    sport: "netball",
    leagues: NETBALL_LEAGUES,
  },
  {
    sport: "tennis",
    leagues: TENNIS_LEAGUES,
  },
  {
    sport: "tennis",
    leagues: TENNIS_CATEGORIES,
  },
  {
    sport: "darts",
    leagues: DARTS_LEAGUES,
  },
  {
    sport: "motorsport",
    leagues: MOTORSPORT_CATEGORIES,
  },
  {
    sport: "golf",
    leagues: GOLF_TOURS,
  },
  {
    sport: "cycling",
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
