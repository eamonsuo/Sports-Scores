# Scripts & Data Tools

Quick reference for all scripts and agent commands available to populate the Dataverse `ss_matchsummaries` table.

> All commands run from the `sports-scores` directory.

---

## Scripts

### `bulk-upload-events.ts`

Unified upload script that fetches matches from Sofascore APIs **and** custom sources (F1, Golf, Motorsport substages, file-based JSON) and bulk-uploads them to Dataverse. Handles dedup automatically via a unified adapter registry.

```
npx tsx scripts/bulk-upload-events.ts <leagueId> <seasonId> <sport> [displayType] [allEventsMode] [useSportApi]
```

| Arg             | Description                                        | Default  |
| --------------- | -------------------------------------------------- | -------- |
| `leagueId`      | Sofascore tournament ID or custom league key       | required |
| `seasonId`      | Sofascore season ID or year                        | required |
| `sport`         | Sport key (e.g. `rugby-league`, `motorsport`)      | required |
| `displayType`   | `round` or `date`                                  | `round`  |
| `allEventsMode` | `true` to fetch all pages, `false` for latest only | `true`   |
| `useSportApi`   | `true` to use sport-specific API endpoints         | `false`  |

**Sofascore examples:**

```bash
# NRL 2026
npx tsx scripts/bulk-upload-events.ts 294 86317 rugby-league round false true

# AFL 2026
npx tsx scripts/bulk-upload-events.ts 656 86748 aussie-rules round false
```

**Custom adapter examples:**

```bash
# F1 2026
npx tsx scripts/bulk-upload-events.ts f1 2026 motorsport

# MotoGP 2026
npx tsx scripts/bulk-upload-events.ts 17 2026 motorsport

# Supercars 2026 (file-based)
npx tsx scripts/bulk-upload-events.ts supercars 2026 motorsport

# PGA Tour 2026
npx tsx scripts/bulk-upload-events.ts pga 2026 golf

# LIV Golf 2026
npx tsx scripts/bulk-upload-events.ts liv 2026 golf
```

**Custom adapters:** The script contains a unified `adapters` registry. File-based leagues use `createFileAdapter("<leagueId>")` which reads from `scripts/{leagueId}-{seasonId}-events.json`.

---

### `generate-matrix.ts`

Generates `eventUploadMatrix.json` and `leagueLookup.json` for GitHub Actions bulk-upload workflows, and injects league choices into the workflow YAML. Edit the `ALL_LEAGUES_CONFIG` array in the script to add/remove leagues.

```
npx tsx scripts/generate-matrix.ts
```

---

### `create-match-summary-table.ts`

One-time script to create the `ss_matchsummary` table schema in Dataverse. Only needs to be run once.

```
npx tsx scripts/create-match-summary-table.ts
```

---

## Agent Commands (Prompt Files)

Reusable Copilot prompts invoked via `/` in VS Code chat.

### `/scrape-supercars-schedule`

Scrapes Supercars track schedules from supercars.com using Playwright, builds MatchSummary JSON entries, and uploads to Dataverse. Handles timezone conversion, session extraction, and dedup.

**Location:** `.github/prompts/scrape-supercars-schedule.prompt.md`

---

### `/scrape-schedule`

Generic schedule scraper for any sport/tour. Uses MCP browser tools to scrape a URL, maps events to MatchSummary records, creates a staged JSON file, checks in with the user, then uploads via `bulk-upload-events.ts`.

**Location:** `.github/prompts/scrape-schedule.prompt.md`

---

## Current Upload Matrix

Leagues configured for scheduled sync (from `eventUploadMatrix.json`):

| League              | Tournament ID | Season ID | Sport             | Display |
| ------------------- | ------------- | --------- | ----------------- | ------- |
| NRL 2026            | 294           | 86317     | rugby-league      | round   |
| NRLW 2026           | 19120         | 87573     | rugby-league      | round   |
| Queensland Cup 2026 | 2135          | 88763     | rugby-league      | round   |
| NSW Cup 2026        | 2134          | 89006     | rugby-league      | round   |
| AFL 2026            | 656           | 86748     | aussie-rules      | round   |
| AFLW 2025           | 10159         | 76123     | aussie-rules      | round   |
| VFL 2026            | 25506         | 90001     | aussie-rules      | round   |
| SANFL 2026          | 20126         | 89835     | aussie-rules      | round   |
| WAFL 2026           | 20160         | 89836     | aussie-rules      | round   |
| NFL 25/26           | 9464          | 75522     | american-football | round   |
| NBL 25/26           | 1524          | 77205     | basketball        | date    |
| WNBL 25/26          | 1506          | 77204     | basketball        | date    |
| NBA 25/26           | 132           | 80229     | basketball        | date    |
| WNBA 2026           | 486           | 89004     | basketball        | date    |
| MLB 2026            | 11205         | 84695     | baseball          | date    |
| ALB 25/26           | 19445         | 81328     | baseball          | date    |
| AIHL 2026           | 11059         | 86527     | ice-hockey        | date    |
| NHL 25/26           | 234           | 78476     | ice-hockey        | date    |

---

## Data Files

| File                         | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `supercars-2026-events.json` | 55 Supercars 2026 MatchSummary entries (scraped from supercars.com)        |
| `dpwt-2026-events.json`      | 42 DP World Tour 2026 MatchSummary entries (scraped from europeantour.com) |
| `eventUploadMatrix.json`     | Active leagues for scheduled GitHub Actions sync                           |
| `eventUploadMatrixAll.json`  | All configured leagues (full matrix)                                       |
