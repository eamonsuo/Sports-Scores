"use client"
import {
  loadExcludedFromToday,
  useOrderPreference,
} from "@/lib/orderPreferences"
import { leagueOrderStorageKey } from "@/lib/storageKeys"
import { FixtureRound, SPORT } from "@/types/misc"
import { useEffect, useState } from "react"
import FixtureRoundList from "./FixtureRoundList"

// A sport's league config, needed to resolve its own excludedFromToday preference
// independently of this list's own storageKey/groupBy (used by groupBy="sport" pages
// that combine matches from many sports, each with its own per-league preference).
type SportLeagueExclusionConfig = {
  sport: SPORT
  leagueIds: string[]
  defaultExcludedFromToday: string[]
}

type OrderedFixtureRoundListProps = {
  data: FixtureRound[]
  storageKey: string
  defaultOrder: string[]
  // Field to group/sort rounds by - a function prop can't cross the server/client boundary.
  groupBy: "sport" | "roundLabel" | "leagueSlug"
  pinnedRoundLabel?: string
  // When set, hides rounds whose groupKey the user has hidden via the customize dialog.
  filterHidden?: boolean
  // Leagues excluded from Today by default (only meaningful for groupBy="leagueSlug").
  defaultExcludedFromToday?: string[]
  // Per-sport excludedFromToday preferences to apply on top of groupBy/storageKey filtering
  // (used by the combined, all-sports Today page).
  perSportLeagueExclusion?: SportLeagueExclusionConfig[]
}

// Generic sort of FixtureRound groups (sports, leagues, etc.) by a persisted order preference,
// with an optional round (e.g. "My Teams") always pinned first.
export default function OrderedFixtureRoundList({
  data,
  storageKey,
  defaultOrder,
  groupBy,
  pinnedRoundLabel,
  filterHidden = false,
  defaultExcludedFromToday = [],
  perSportLeagueExclusion,
}: OrderedFixtureRoundListProps) {
  const { order, hidden, excludedFromToday } = useOrderPreference(
    storageKey,
    defaultOrder,
    defaultExcludedFromToday,
  )
  const rank = new Map(order.map((id, index) => [id, index]))
  const isLeagueGrouping = groupBy === "leagueSlug"
  // On the Today view, a league that's hidden from the league list or excluded from
  // Today should both drop its matches.
  const hiddenIds = new Set(
    isLeagueGrouping ? [...hidden, ...excludedFromToday] : hidden,
  )

  // Each sport's excludedFromToday preference lives under its own storageKey, so it's
  // read directly from localStorage rather than via useOrderPreference (can't call a hook
  // per sport in a loop).
  const [sportExclusions, setSportExclusions] = useState<
    Record<string, Set<string>>
  >({})
  useEffect(() => {
    if (!perSportLeagueExclusion) return
    const next: Record<string, Set<string>> = {}
    for (const config of perSportLeagueExclusion) {
      next[config.sport] = new Set(
        loadExcludedFromToday(
          leagueOrderStorageKey(config.sport),
          config.leagueIds,
          config.defaultExcludedFromToday,
        ),
      )
    }
    setSportExclusions(next)
  }, [perSportLeagueExclusion])

  const pinnedRound = pinnedRoundLabel
    ? data.find((item) => item.roundLabel === pinnedRoundLabel)
    : undefined
  const rest = pinnedRoundLabel
    ? data.filter((item) => item.roundLabel !== pinnedRoundLabel)
    : data

  // A round (grouped by round name) can contain matches from several leagues, so
  // hiding/ranking is resolved per-match rather than by a single key for the round.
  const visibleRest = rest
    .map((round) => {
      if (!filterHidden) return round
      const matches = round.matches.filter((match) => {
        if (isLeagueGrouping && match.leagueId && hiddenIds.has(match.leagueId))
          return false
        const excludedForSport = sportExclusions[match.sport]
        if (
          excludedForSport &&
          match.leagueId &&
          excludedForSport.has(match.leagueId)
        )
          return false
        return true
      })
      return matches.length === round.matches.length
        ? round
        : { ...round, matches }
    })
    .filter((round) => {
      if (!filterHidden) return true
      if (isLeagueGrouping) return round.matches.length > 0
      const key = round[groupBy]
      if (key !== undefined && hiddenIds.has(key)) return false
      return perSportLeagueExclusion ? round.matches.length > 0 : true
    })

  const roundRank = (round: FixtureRound) => {
    if (!isLeagueGrouping) {
      const key = round[groupBy]
      return key !== undefined ? (rank.get(key) ?? Infinity) : Infinity
    }
    return round.matches.reduce((best, match) => {
      const leagueRank = match.leagueId
        ? (rank.get(match.leagueId) ?? Infinity)
        : Infinity
      return Math.min(best, leagueRank)
    }, Infinity)
  }

  const orderedRest = [...visibleRest].sort(
    (a, b) => roundRank(a) - roundRank(b),
  )
  const orderedData = pinnedRound ? [pinnedRound, ...orderedRest] : orderedRest

  return (
    <FixtureRoundList
      data={orderedData}
      curRound={orderedData[0]?.roundLabel ?? ""}
    />
  )
}
