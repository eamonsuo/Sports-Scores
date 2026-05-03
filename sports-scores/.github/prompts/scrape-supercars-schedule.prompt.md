---
description: "Scrape Supercars track schedules from supercars.com and update the events JSON file. Use when new Supercars event schedules are published and need to be scraped, or to refresh existing data."
agent: "agent"
tools: [playwright, browser, search]
---

# Scrape Supercars Track Schedules

Scrape the Supercars Championship track schedules from https://www.supercars.com/calendar and update the JSON events file at `scripts/supercars-2026-events.json`.

## Steps

1. **Navigate** to each event's schedule page at `https://www.supercars.com/events/{slug}/schedule`
2. **Extract** only "Repco Supercars Championship" sessions (ignore support categories like GR Cup, SuperUtes, Touring Car Masters, etc.)
3. **For each session**, capture:
   - Session name (e.g. Practice 1, Qualifying (Race 14), TTSO (Race 16), Race 14)
   - Day and time (in track-local time shown on the page)
   - Results link URL if available (e.g. `/results/2026/2026-tasmania/P5`)
4. **Map** each session to a MatchSummary JSON object following these conventions:

### Field mappings

| Field                | Value                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `supercars-2026-{round}-{session-slugified}`                                                                                                          |
| `sport`              | `"motorsport"`                                                                                                                                        |
| `summaryText`        | Session name, stripped of sponsor prefixes (e.g. "Boost Mobile Qualifying (Race 14)" → "Qualifying (Race 14)")                                        |
| `startDate`          | Track-local time converted to UTC ISO string                                                                                                          |
| `status`             | `"COMPLETED"` if past, `"UPCOMING"` if future                                                                                                         |
| `seriesName`         | Event name (e.g. "2026 Tyrepower Tasmania Super 440")                                                                                                 |
| `seriesSlug`         | `"supercars/2026"`                                                                                                                                    |
| `matchSlug`          | Full URL `https://www.supercars.com/results/2026/{slug}/{code}` for completed events; `https://www.supercars.com/events/{slug}/schedule` for upcoming |
| `roundLabel`         | `"Round {n}"`                                                                                                                                         |
| `timer`              | `"Completed"` for past events; ISO date string for upcoming                                                                                           |
| `timerDisplayColour` | `"gray"`                                                                                                                                              |
| `venue`              | Location text (e.g. "Launceston, TAS")                                                                                                                |
| `seasonId`           | `"2026"`                                                                                                                                              |
| `tournamentId`       | `"supercars"`                                                                                                                                         |
| `homeDetails`        | `{ "score": "", "name": "" }`                                                                                                                         |
| `awayDetails`        | `{ "score": "", "name": "" }`                                                                                                                         |

### Timezone reference

| Location                                                                 | Timezone | UTC offset |
| ------------------------------------------------------------------------ | -------- | ---------- |
| Sydney, Melbourne, Launceston, Ipswich, Townsville, Gold Coast, Bathurst | AEST     | +10        |
| Sydney, Melbourne, Launceston, Bathurst (Oct-Apr)                        | AEDT     | +11        |
| Darwin                                                                   | ACST     | +9:30      |
| Adelaide, Tailem Bend (Oct-Apr)                                          | ACDT     | +10:30     |
| Adelaide, Tailem Bend (Apr-Oct)                                          | ACST     | +9:30      |
| Perth                                                                    | AWST     | +8         |
| Taupō, Christchurch (Apr-Sep)                                            | NZST     | +12        |
| Taupō, Christchurch (Sep-Apr)                                            | NZDT     | +13        |

### Events without schedules

For events where the schedule page redirects back to the event overview (no "Track Schedule" tab), create a single placeholder entry with:

- `summaryText`: `"Details"`
- `startDate`: First day of the event weekend at midnight UTC
- `endDate`: Last day of the event weekend ~5pm local time in UTC
- `matchSlug`: `https://www.supercars.com/events/{slug}`

5. **Update** the JSON file `scripts/supercars-2026-events.json`, replacing placeholder entries with full session data when schedules become available
6. **Prompt** the user to review the changes before uploading
7. **Upload** to Dataverse by running: `npx tsx scripts/upload-custom-events.ts motorsport supercars 2026`

## Event list for 2026 season

| Round | Slug                       | Event                               | Location              |
| ----- | -------------------------- | ----------------------------------- | --------------------- |
| 1     | 2026-sydney                | DUNLOP Sydney 500                   | Sydney, NSW           |
| 2     | 2026-melbourne-supersprint | Melbourne SuperSprint               | Melbourne, VIC        |
| 3     | 2026-taupo                 | ITM Taupō Super 440                 | Taupō, NZ             |
| 4     | 2026-christchurch          | ITM Christchurch Super 440          | Christchurch, NZ      |
| 5     | 2026-tasmania              | Tyrepower Tasmania Super 440        | Launceston, TAS       |
| 6     | 2026-darwin                | betr Darwin Triple Crown            | Darwin, NT            |
| 7     | 2026-townsville            | NTI Townsville 500                  | Townsville, QLD       |
| 8     | 2026-perth                 | Perth Super 440                     | Perth, WA             |
| 9     | 2026-ipswich               | Century Batteries Ipswich Super 440 | Ipswich, QLD          |
| 10    | 2026-the-bend              | AirTouch 500 at The Bend            | Tailem Bend, SA       |
| 11    | 2026-bathurst-1000         | Repco Bathurst 1000                 | Bathurst, NSW         |
| 12    | 2026-gold-coast            | Boost Mobile Gold Coast 500         | Surfers Paradise, QLD |
| 13    | 2026-sandown               | Penrite Oil Sandown 500             | Melbourne, VIC        |
| 14    | 2026-adelaide              | bp Adelaide Grand Final             | Adelaide, SA          |
