/**
 * Resolves league choice to leagueId, seasonId, sport, and displayType.
 * Used by the GitHub Actions workflow to auto-resolve from the league dropdown.
 *
 * Usage: npx tsx scripts/resolve-league.ts "<league choice>" [seasonId override]
 *
 * Outputs GitHub Actions step outputs to $GITHUB_OUTPUT.
 */

import { appendFileSync, readFileSync } from "fs"
import { resolve } from "path"

const [, , leagueChoice, seasonIdOverride] = process.argv

if (!leagueChoice) {
  console.error("Usage: resolve-league.ts <league choice> [seasonId]")
  process.exit(1)
}

type LeagueLookupEntry = {
  leagueId: string
  seasonId: string
  sport: string
  displayType: string
}

const lookupPath = resolve(__dirname, "leagueLookup.json")
const lookup: Record<string, LeagueLookupEntry> = JSON.parse(
  readFileSync(lookupPath, "utf-8"),
)

const entry = lookup[leagueChoice]

if (!entry) {
  console.error(`❌ League not found: "${leagueChoice}"`)
  console.error(`Available leagues:\n${Object.keys(lookup).sort().join("\n")}`)
  process.exit(1)
}

const resolvedSeasonId = seasonIdOverride?.trim() || entry.seasonId

console.log(`Resolved: ${leagueChoice}`)
console.log(`  leagueId: ${entry.leagueId}`)
console.log(
  `  seasonId: ${resolvedSeasonId}${seasonIdOverride ? " (override)" : " (latest)"}`,
)
console.log(`  sport: ${entry.sport}`)
console.log(`  displayType: ${entry.displayType}`)

// Write to GitHub Actions output file
const outputFile = process.env.GITHUB_OUTPUT
if (outputFile) {
  appendFileSync(outputFile, `leagueId=${entry.leagueId}\n`)
  appendFileSync(outputFile, `seasonId=${resolvedSeasonId}\n`)
  appendFileSync(outputFile, `sport=${entry.sport}\n`)
  appendFileSync(outputFile, `displayType=${entry.displayType}\n`)
} else {
  console.log("\n(No $GITHUB_OUTPUT — running locally)")
}
