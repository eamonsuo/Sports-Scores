// Plain (non "use client") storage-key helpers, so Server Components can compute
// these keys directly without importing client-only code from footerPreferences.ts.

export const FOOTER_ORDER_STORAGE_KEY = "sportsScoresFooterOrder.v1"

// A sport's league order/hide preference is shared between the league dropdown
// (LeagueSeasonToggle) and the per-sport today page's "Customize Leagues" dialog.
export function leagueOrderStorageKey(sport: string) {
  return `sportsScoresLeagueOrder.${sport}.v1`
}
