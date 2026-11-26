/**
 * Generates a JSON matrix for the GitHub Actions bulk-upload workflow.
 *
 * Reads league constants and outputs the latest season for each configured
 * league as a JSON array to stdout.
 *
 * To add or remove leagues from the scheduled sync, edit the SYNC_CONFIG
 * array below.
 */

import { leaguesBySportToShow } from "@/services/dataverse.service"
import { SPORT } from "@/types/misc"
import { loadEnvConfig } from "@next/env"
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

loadEnvConfig(process.cwd())

// ---------------------------------------------------------------------------
// Configure which leagues to sync. Each entry maps a sport key + display type
// to a set of league slugs. Use "*" to include all leagues for that sport.
// ---------------------------------------------------------------------------

const REGULAR_LEAGUES_CONFIG: Record<SPORT, string[]> = {
  [SPORT.RUGBY_LEAGUE]: ["294", "19120", "2135", "2134"],
  [SPORT.FOOTBALL]: ["136", "1894", "1786", "17", "19"],
  [SPORT.AUSSIE_RULES]: ["656", "10159", "25506"],
  [SPORT.AMERICAN_FOOTBALL]: ["9464"],
  [SPORT.BASKETBALL]: ["1524", "1506", "132", "486"],
  [SPORT.BASEBALL]: ["11205", "19445"],
  [SPORT.ICE_HOCKEY]: ["11059", "234"],
  [SPORT.RUGBY_UNION]: ["422"],
  [SPORT.CRICKET]: ["11160", "11161", "11162", "18704", "11163", "11165"],
  [SPORT.NETBALL]: [],
  [SPORT.TENNIS]: [],
  [SPORT.DARTS]: [],
  [SPORT.MOTORSPORT]: ["40", "17", "67", "18"],
  [SPORT.GOLF]: ["pga", "liv", "dpworld", "lpga", "australasia", "tgl"],
  [SPORT.CYCLING]: ["9", "94"],
  [SPORT.SURFING]: ["wsl"],
  [SPORT.ATHLETICS]: [],
  [SPORT.MULTI_SPORT]: [],
  [SPORT.DEFAULT_SPORT]: [],
}

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

async function buildRegularEventMatrix() {
  for (const sport of Object.values(SPORT)) {
    const slugs = REGULAR_LEAGUES_CONFIG[sport]
    const leagueList = await leaguesBySportToShow(sport)

    for (const slug of slugs) {
      const league = leagueList.find((l) => l.slug === slug)
      if (!league) continue
      const latestSeason = league.seasons[0]
      if (!latestSeason || !latestSeason.slug) continue

      matrix.push({
        name: `${league.name} ${latestSeason.name}`,
        leagueId: league.slug,
        seasonId: latestSeason.slug,
        sport: sport,
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Build league lookup (for single-mode resolve at runtime)
// ---------------------------------------------------------------------------

type LeagueLookupEntry = {
  leagueId: string
  seasonId: string
  sport: string
}

const leagueLookup: Record<string, LeagueLookupEntry> = {}

async function buildAllLeagueLookup() {
  for (const sport of Object.values(SPORT)) {
    const leagueList = await leaguesBySportToShow(sport)

    for (const league of leagueList) {
      const latestSeason = league.seasons[0]
      if (!latestSeason || !latestSeason.slug) continue

      const key = `${sport} — ${league.name}`
      leagueLookup[key] = {
        leagueId: league.slug,
        seasonId: latestSeason.slug,
        sport: sport,
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Write all output files
// ---------------------------------------------------------------------------

async function main() {
  await buildRegularEventMatrix()
  await buildAllLeagueLookup()

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
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
