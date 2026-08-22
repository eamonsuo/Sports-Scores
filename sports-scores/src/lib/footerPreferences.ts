"use client"
import { arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"

const STORAGE_KEY = "sportsScoresFooterOrder.v1"

export type FooterPreferences = {
  order: string[]
  hidden: string[]
}

// Drops ids no longer offered and appends any new ones to the end, defaulting to visible.
function reconcile(
  prefs: FooterPreferences,
  defaultOrder: string[],
): FooterPreferences {
  const knownIds = new Set(defaultOrder)
  const order = prefs.order.filter((id) => knownIds.has(id))
  const seen = new Set(order)
  for (const id of defaultOrder) {
    if (!seen.has(id)) order.push(id)
  }
  const hidden = prefs.hidden.filter((id) => knownIds.has(id))
  return { order, hidden }
}

function loadFooterPreferences(defaultOrder: string[]): FooterPreferences {
  if (typeof window === "undefined") return { order: defaultOrder, hidden: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { order: defaultOrder, hidden: [] }
    const parsed = JSON.parse(raw) as Partial<FooterPreferences>
    return reconcile(
      { order: parsed.order ?? [], hidden: parsed.hidden ?? [] },
      defaultOrder,
    )
  } catch {
    return { order: defaultOrder, hidden: [] }
  }
}

function saveFooterPreferences(prefs: FooterPreferences) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // localStorage unavailable (private browsing, quota) - personalization simply won't persist
  }
}

export function useFooterOrder(defaultOrder: string[]) {
  const [prefs, setPrefs] = useState<FooterPreferences>({
    order: defaultOrder,
    hidden: [],
  })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setPrefs(loadFooterPreferences(defaultOrder))
    setIsHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Skip the pre-hydration default render so it can't clobber a real saved preference.
    if (!isHydrated) return
    saveFooterPreferences(prefs)
  }, [isHydrated, prefs])

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

  const reset = () => setPrefs({ order: defaultOrder, hidden: [] })

  return {
    order: prefs.order,
    hidden: prefs.hidden,
    reorder,
    toggleHidden,
    reset,
  }
}
