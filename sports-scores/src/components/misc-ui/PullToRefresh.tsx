"use client"

import { cn } from "@/lib/shadcnUtils"
import { ReactNode, useEffect, useRef, useState } from "react"

const PULL_THRESHOLD = 70 // px of pull needed to release into a refresh
const MAX_PULL = 100 // visual cap so dragging doesn't feel infinite
const RESISTANCE = 0.5 // rubber-band feel while dragging

const RING_SIZE = 24
const RING_STROKE = 3
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

// Walks up from the gesture container to find the ancestor that actually
// scrolls (in this app that's the root layout's <main>), since the
// container itself never overflows.
function getScrollParent(node: HTMLElement | null): HTMLElement {
  let el = node?.parentElement ?? null
  while (el && el !== document.body) {
    const { overflowY } = getComputedStyle(el)
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight
    ) {
      return el
    }
    el = el.parentElement
  }
  return (document.scrollingElement as HTMLElement) ?? document.documentElement
}

export default function PullToRefresh({
  children,
  onRefresh,
  refreshing,
  className,
}: {
  children: ReactNode
  onRefresh: () => void
  refreshing: boolean
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollParentRef = useRef<HTMLElement | null>(null)
  const startY = useRef<number | null>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [dragging, setDragging] = useState(false)

  // Attached natively (rather than via React's passive onTouchMove) so
  // preventDefault can stop the page rubber-banding while dragging.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleTouchMove(e: TouchEvent) {
      if (startY.current === null) return

      const delta = e.touches[0].clientY - startY.current
      const atTop = (scrollParentRef.current?.scrollTop ?? 0) <= 0
      if (delta <= 0 || !atTop) {
        startY.current = null
        setDragging(false)
        setPullDistance(0)
        return
      }

      e.preventDefault()
      setPullDistance(Math.min(delta * RESISTANCE, MAX_PULL))
    }

    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    })
    return () => container.removeEventListener("touchmove", handleTouchMove)
  }, [])

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    if (refreshing) return
    // Re-resolved per gesture: content can mount after this component does
    // (e.g. the dev-only dynamic import in FixtureRoundList), so a value
    // cached once at mount can point at the wrong (non-scrolling) ancestor.
    scrollParentRef.current = getScrollParent(containerRef.current)
    const atTop = (scrollParentRef.current?.scrollTop ?? 0) <= 0
    startY.current = atTop ? e.touches[0].clientY : null
    setDragging(atTop)
  }

  function handleTouchEnd() {
    if (!refreshing && pullDistance >= PULL_THRESHOLD) onRefresh()
    startY.current = null
    setDragging(false)
    setPullDistance(0)
  }

  const indicatorHeight = refreshing ? PULL_THRESHOLD : pullDistance
  // Ring fill tracks how close the pull is to the release threshold, capped at 100%.
  const progress = refreshing ? 1 : Math.min(pullDistance / PULL_THRESHOLD, 1)

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden",
          !dragging && "transition-[height] duration-200 ease-out",
        )}
        style={{ height: indicatorHeight }}
      >
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className={cn(refreshing && "animate-spin")}
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            strokeWidth={RING_STROKE}
            className="stroke-gray-300 dark:stroke-neutral-700"
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
            className="origin-center -rotate-90 stroke-gray-600 dark:stroke-neutral-300"
          />
        </svg>
      </div>
      {children}
    </div>
  )
}
