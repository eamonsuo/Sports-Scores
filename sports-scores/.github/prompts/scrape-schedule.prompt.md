---
description: "Scrape a sports schedule page and upload events to Dataverse. Follow the numbered steps in order: collect inputs, scrape, parse, map, stage JSON, confirm, then upload."
agent: "agent"
tools: [playwright/*, browser, search]
---

# Scrape Sports Schedule & Upload to Dataverse

Generic workflow for scraping any sports schedule page and uploading events to the Dataverse `ss_matchsummaries` table.

## Inputs required

Before starting, confirm the following with the user if not already provided:

| Input        | Description                                                        | Example                                                    |
| ------------ | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `url`        | Full URL of the schedule page                                      | `https://www.europeantour.com/dpworld-tour/schedule/2026/` |
| `sport`      | SPORT enum value                                                   | `golf`, `tennis`, `motorsport`, `cycling`                  |
| `leagueId`   | League/tour identifier matching the slug in `src/lib/constants.ts` | `dpworld`, `wta`, `atp`, `supercars`                       |
| `seasonId`   | Season string                                                      | `2026`                                                     |
| `roundLabel` | Default round/group label for events                               | `Schedule`, `Round`, `Stage`                               |

**Input validation:** If `url` is empty, `sport` is not one of the valid SPORT enum values, or `leagueId` is blank, stop and prompt the user to provide valid inputs before continuing.

---

## Steps

### 1. Navigate & scrape the schedule page

Use the Playwright MCP browser tools to:

1. Navigate to the provided URL
2. If the page is JS-heavy (SPA/React/Vue), wait for `networkidle` before continuing; otherwise proceed directly to step 3
3. Take a snapshot to inspect the DOM structure
4. Use `browser_evaluate` to extract all event data as structured JSON using this pattern:

```js
// Adapt selectors to match the actual page structure observed in the snapshot
;() => {
  const results = []
  const allItems = document.querySelectorAll("main li") // adjust selector as needed
  allItems.forEach((item) => {
    // Skip nav/header items
    const texts = []
    const walk = (el) => {
      if (el.nodeType === 3) {
        const t = el.textContent.trim()
        if (t) texts.push(t)
      } else {
        for (const child of el.childNodes) walk(child)
      }
    }
    walk(item)
    const href = item.querySelector("a")?.getAttribute("href")
    results.push({ texts: texts.slice(0, 15), href })
  })
  return JSON.stringify(results)
}
```

Choose the selector based on the snapshot structure:

- If the page renders a `<table>`, use `tr` as the item selector.
- If the page uses card or list elements, use `[class*="event"]`, `[class*="card"]`, or `li` depending on what is present.
- If the page is JS-heavy and content is missing, wait for `networkidle` before taking the snapshot, then re-evaluate.

### 2. Parse the extracted data

For each event item, identify:

- **Date range** — look for month names or date patterns in the text array
- **Event name** — typically the longest meaningful string, often contains the tournament/event title
- **Venue** — usually contains commas (e.g. `"Course Name, City, Country"`)
- **Status link / result link** — href or nested link pointing to results
- **Winner** (if completed) — look for "Winner", "Champion", or similar labels

### 3. Map to MatchSummary records

Use the following field mapping. If a `scripts/{leagueId}-{seasonId}-events.json` file already exists for this league, use it as a reference — otherwise use the schema below as your guide.

| MatchSummary field   | Mapping logic                                                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | Derive from the event's URL slug (strip domain and trailing `/`)                                                                                      |
| `sport`              | Use the `sport` input                                                                                                                                 |
| `leagueId`           | Use the `leagueId` input                                                                                                                              |
| `seasonId`           | Use the `seasonId` input                                                                                                                              |
| `summaryText`        | `"Details"` for schedule-style events                                                                                                                 |
| `startDate`          | Parsed start date as UTC ISO string — dates spanning year-end (e.g. Nov/Dec season openers) must use the correct year                                 |
| `endDate`            | Parsed end date as UTC ISO string                                                                                                                     |
| `status`             | `COMPLETED` if endDate is before today; `LIVE` if today is between startDate and endDate; `UPCOMING` otherwise                                        |
| `leagueName`         | Full event/tournament name                                                                                                                            |
| `leagueImg`          | Country flag URL from `https://flagcdn.com/{countryCode}.svg` based on the host country — see `CountryFlagCode` enum in `src/types/misc.ts` for codes |
| `leagueSlug`         | `/sports/{sport}/{leagueId}/{seasonId}`                                                                                                               |
| `matchSlug`          | Full external URL to the event's results/leaderboard page                                                                                             |
| `roundLabel`         | Use the `roundLabel` input; override for majors/special events (e.g. `"Major"`, `"Rolex Series"`, `"Qualifying"`)                                     |
| `timer`              | `startDate` ISO string for UPCOMING; `"Completed"` for COMPLETED; `"Live"` for LIVE                                                                   |
| `timerDisplayColour` | `"green"` for LIVE; `"gray"` otherwise                                                                                                                |
| `venue`              | Full venue string (e.g. `"Augusta National GC, Augusta, GA, USA"`)                                                                                    |
| `competitorDetails`  | For COMPLETED events: `[{ "id": "{name-kebab}", "name": "{Full Name}", "score": "Winner" }]` for the winner if available; otherwise `[]`              |

### 4. Write the staged JSON file

Save the records to `scripts/{leagueId}-{seasonId}-events.json` (this naming matches the convention expected by the file-based adapters in `bulk-upload-events.ts`).

### 5. Check in with the user

Before uploading, summarise the records and ask the user to confirm:

- Total event count
- Date range of events
- Sample of 3–5 records (first, last, one mid-season)
- Any records where date parsing was uncertain or venue is missing
- Any `leagueImg` values left empty that need a flag

Ask: _"Does this mapping look correct? Shall I proceed with the upload?"_

### 6. Upload to Dataverse

The upload is handled via `scripts/bulk-upload-events.ts`. This script uses a unified adapter registry — file-based adapters, API adapters, and Sofascore adapters all live in the same file.

**Check if an adapter already exists** by looking at the `adapters` registry in `scripts/bulk-upload-events.ts`. If one exists, run it directly:

```bash
npx tsx scripts/bulk-upload-events.ts <leagueId> <seasonId> <sport>
```

**If no adapter exists**, register one using `createFileAdapter("<leagueId>")` — this generic factory in `bulk-upload-events.ts` reads from `scripts/{leagueId}-{seasonId}-events.json` and maps all standard `MatchSummary` fields automatically (including optional `leagueImg`). Add it to the appropriate sport entry in the `adapters` registry (create the sport entry if it's new):

```typescript
[SPORT.GOLF]: {
  // ...existing adapters
  myLeague: createFileAdapter("myLeague"),
}
```

---

## Reference: MatchSummary JSON schema

```jsonc
[
  {
    "id": "unique-event-slug", // dedup key — must be stable
    "sport": "<sport>",
    "leagueId": "<leagueId>",
    "seasonId": "<seasonId>",
    "summaryText": "Details",
    "startDate": "2026-05-21T00:00:00.000Z",
    "endDate": "2026-05-24T00:00:00.000Z",
    "status": "UPCOMING", // UPCOMING | LIVE | COMPLETED
    "leagueName": "Event Name",
    "leagueImg": "https://flagcdn.com/{countryCode}.svg",
    "leagueSlug": "/sports/<sport>/<leagueId>/<seasonId>",
    "matchSlug": "https://example.com/event/results",
    "roundLabel": "Schedule",
    "timer": "2026-05-21T00:00:00.000Z", // Date for UPCOMING; string for others
    "timerDisplayColour": "gray",
    "venue": "Venue Name, City, Country",
    "competitorDetails": [
      { "id": "player-name", "name": "Player Name", "score": "Winner" },
    ],
  },
]
```

## Reference: Country flag codes

Key codes from `CountryFlagCode` enum in `src/types/misc.ts`:

| Country     | Code     | Country      | Code     |
| ----------- | -------- | ------------ | -------- |
| Australia   | `au`     | USA          | `us`     |
| England     | `gb-eng` | Scotland     | `gb-sct` |
| Ireland     | `ie`     | France       | `fr`     |
| Germany     | `de`     | Spain        | `es`     |
| Italy       | `it`     | Netherlands  | `nl`     |
| UAE         | `ae`     | South Africa | `za`     |
| Japan       | `jp`     | South Korea  | `kr`     |
| India       | `in`     | China        | `cn`     |
| Belgium     | `be`     | Austria      | `at`     |
| Switzerland | `ch`     | Denmark      | `dk`     |
| Qatar       | `qa`     | Bahrain      | `bh`     |
| Kenya       | `ke`     | Mauritius    | `mu`     |
| Turkey      | `tr`     | Canada       | `ca`     |
| New Zealand | `nz`     | Brazil       | `br`     |

For the full list see `src/types/misc.ts` → `CountryFlagCode` enum.

## Reference: SPORT enum values

`golf` · `tennis` · `motorsport` · `football` · `rugby-league` · `rugby-union` · `cricket` · `basketball` · `baseball` · `american-football` · `ice-hockey` · `aussie-rules` · `cycling` · `netball` · `surfing` · `darts` · `olympics`
