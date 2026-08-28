"use client"
import { arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"

export type OrderPreferences = {
  order: string[]
  hidden: string[]
  excludedFromToday: string[]
}

// Drops ids no longer offered and appends any new ones to the end, defaulting to visible.
function reconcile(
  prefs: OrderPreferences,
  defaultOrder: string[],
): OrderPreferences {
  const knownIds = new Set(defaultOrder)
  const order = prefs.order.filter((id) => knownIds.has(id))
  const seen = new Set(order)
  for (const id of defaultOrder) {
    if (!seen.has(id)) order.push(id)
  }
  const hidden = prefs.hidden.filter((id) => knownIds.has(id))
  const excludedFromToday = prefs.excludedFromToday.filter((id) =>
    knownIds.has(id),
  )
  return { order, hidden, excludedFromToday }
}

function loadOrderPreferences(
  storageKey: string,
  defaultOrder: string[],
  defaultExcludedFromToday: string[],
): OrderPreferences {
  if (typeof window === "undefined")
    return { order: defaultOrder, hidden: [], excludedFromToday: [] }
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw)
      return {
        order: defaultOrder,
        hidden: [],
        excludedFromToday: defaultExcludedFromToday,
      }
    const parsed = JSON.parse(raw) as Partial<OrderPreferences>
    return reconcile(
      {
        order: parsed.order ?? [],
        hidden: parsed.hidden ?? [],
        // Missing key means this preference predates the feature, so fall back to the
        // current constants-driven default rather than treating it as "none excluded".
        excludedFromToday: parsed.excludedFromToday ?? defaultExcludedFromToday,
      },
      defaultOrder,
    )
  } catch {
    return { order: defaultOrder, hidden: [], excludedFromToday: [] }
  }
}

function saveOrderPreferences(storageKey: string, prefs: OrderPreferences) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(prefs))
  } catch {
    // localStorage unavailable (private browsing, quota) - personalization simply won't persist
  }
}

// Plain (non-hook) read of a single sport's excludedFromToday preference, for components
// that need to check several sports' preferences at once (can't call a hook in a loop).
export function loadExcludedFromToday(
  storageKey: string,
  knownLeagueIds: string[],
  defaultExcludedFromToday: string[],
): string[] {
  if (typeof window === "undefined") return defaultExcludedFromToday
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return defaultExcludedFromToday
    const parsed = JSON.parse(raw) as Partial<OrderPreferences>
    const knownIds = new Set(knownLeagueIds)
    return (parsed.excludedFromToday ?? defaultExcludedFromToday).filter((id) =>
      knownIds.has(id),
    )
  } catch {
    return defaultExcludedFromToday
  }
}

// Generic per-device, localStorage-backed order/hide preference, keyed by storageKey so
// unrelated lists (footer icons, a sport's leagues, etc.) can each persist independently.
export function useOrderPreference(
  storageKey: string,
  defaultOrder: string[],
  defaultExcludedFromToday: string[] = [],
) {
  const [prefs, setPrefs] = useState<OrderPreferences>({
    order: defaultOrder,
    hidden: [],
    excludedFromToday: defaultExcludedFromToday,
  })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setPrefs(
      loadOrderPreferences(storageKey, defaultOrder, defaultExcludedFromToday),
    )
    setIsHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    // Skip the pre-hydration default render so it can't clobber a real saved preference.
    if (!isHydrated) return
    saveOrderPreferences(storageKey, prefs)
  }, [storageKey, isHydrated, prefs])

  const reorder = (activeId: string, overId: string) => {
    setPrefs((prev) => {
      const oldIndex = prev.order.indexOf(activeId)
      const newIndex = prev.order.indexOf(overId)
      if (oldIndex === -1 || newIndex === -1) return prev
      return { ...prev, order: arrayMove(prev.order, oldIndex, newIndex) }
    })
  }

  const toggleHidden = (id: string) => {
    setPrefs((prev) => ({
      ...prev,
      hidden: prev.hidden.includes(id)
        ? prev.hidden.filter((hiddenId) => hiddenId !== id)
        : [...prev.hidden, id],
    }))
  }

  const toggleExcludedFromToday = (id: string) => {
    setPrefs((prev) => ({
      ...prev,
      excludedFromToday: prev.excludedFromToday.includes(id)
        ? prev.excludedFromToday.filter((excludedId) => excludedId !== id)
        : [...prev.excludedFromToday, id],
    }))
  }

  const reset = () =>
    setPrefs({
      order: defaultOrder,
      hidden: [],
      excludedFromToday: defaultExcludedFromToday,
    })

  return {
    order: prefs.order,
    hidden: prefs.hidden,
    excludedFromToday: prefs.excludedFromToday,
    reorder,
    toggleHidden,
    toggleExcludedFromToday,
    reset,
  }
}
