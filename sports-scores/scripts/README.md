# Scripts & Data Tools

Quick reference for all scripts and agent commands available to populate the Dataverse `ss_matchsummaries` table.

> All commands run from the `sports-scores` directory.

---

## Scripts

### `bulk-upload-events.ts`

Fetches matches from the Sofascore API for a given tournament/season and bulk-uploads them to Dataverse. Handles dedup automatically.

```
npx tsx scripts/bulk-upload-events.ts <tournamentId> <seasonId> <sport> [displayType] [allEventsMode] [useSportApi]
```

| Arg             | Description                                        | Default  |
| --------------- | -------------------------------------------------- | -------- |
| `tournamentId`  | Sofascore tournament ID                            | required |
| `seasonId`      | Sofascore season ID                                | required |
| `sport`         | Sport key (e.g. `rugby-league`, `basketball`)      | required |
| `displayType`   | `round` or `date`                                  | `round`  |
| `allEventsMode` | `true` to fetch all pages, `false` for latest only | `true`   |
| `useSportApi`   | `true` to use sport-specific API endpoints         | `false`  |

**Examples:**

```bash
# NRL 2026
npx tsx scripts/bulk-upload-events.ts 294 86317 rugby-league round false

# AFL 2026
npx tsx scripts/bulk-upload-events.ts 656 86748 aussie-rules round false

# NBA 25/26
npx tsx scripts/bulk-upload-events.ts 132 80229 basketball date

# MLB 2026
npx tsx scripts/bulk-upload-events.ts 11205 84695 baseball date
```

---

### `upload-custom-events.ts`

Uploads events from non-Sofascore sources (F1 API, JSON files, etc.) to Dataverse. Each sport has its own adapter.

```
npx tsx scripts/upload-custom-events.ts <sport> <sub-sport> [...args]
```

**Adapters:**

| Sport        | Sub-sport   | Extra args | Source                                   |
| ------------ | ----------- | ---------- | ---------------------------------------- |
| `motorsport` | `f1`        | `<season>` | Jolpica F1 API                           |
| `motorsport` | `supercars` | `<season>` | `scripts/supercars-{season}-events.json` |

**Examples:**

```bash
# F1 2026 (fetches from Jolpica API)
npx tsx scripts/upload-custom-events.ts motorsport f1 2026

# Supercars 2026 (reads from JSON file)
npx tsx scripts/upload-custom-events.ts motorsport supercars 2026
```

---

### `generate-matrix.ts`

Generates `eventUploadMatrix.json` and `eventUploadMatrixAll.json` for GitHub Actions bulk-upload workflows. Edit the `SYNC_CONFIG` array in the script to add/remove leagues.

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

| File                         | Description                                                         |
| ---------------------------- | ------------------------------------------------------------------- |
| `supercars-2026-events.json` | 55 Supercars 2026 MatchSummary entries (scraped from supercars.com) |
| `eventUploadMatrix.json`     | Active leagues for scheduled GitHub Actions sync                    |
| `eventUploadMatrixAll.json`  | All configured leagues (full matrix)                                |
