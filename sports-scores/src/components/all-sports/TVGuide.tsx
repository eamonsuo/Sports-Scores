"use client"

import { FALLBACK_IMAGE } from "@/lib/constants"
import { resolveSportImage } from "@/lib/imageMapping"
import { cn } from "@/lib/utils"
import { MatchStatus, MatchSummary, TVChannel, TVDetails } from "@/types/misc"
import { format } from "date-fns/format"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef } from "react"

// ─── Fixed channel display order ────────────────────────────────────────────
const CHANNEL_ORDER: TVChannel[] = [
  TVChannel.KAYO,
  TVChannel.NINE,
  TVChannel.NINE_NOW,
  TVChannel.NINE_GEM,
  TVChannel.NINE_GO,
  TVChannel.SEVEN,
  TVChannel.SEVEN_PLUS,
  TVChannel.SEVEN_MATE,
  TVChannel.TEN,
  TVChannel.TEN_PLAY,
  TVChannel.TEN_BOLD,
  TVChannel.ABC,
  TVChannel.ABC_IVIEW,
  TVChannel.SBS,
  TVChannel.SBS_ON_DEMAND,
  TVChannel.ESPN,
  TVChannel.DISNEY_PLUS,
  TVChannel.BEIN_SPORTS,
  TVChannel.DAZN,
]

// ─── Layout constants ───────────────────────────────────────────────────────
const CHANNEL_COL_WIDTH = 70 // px – fixed left column
const PX_PER_MIN = 3 // px per minute → 180 px per hour
const HOUR_WIDTH = PX_PER_MIN * 60 // 180 px
const ROW_HEIGHT = 70 // px per channel row
const HEADER_HEIGHT = 40 // px for time ruler

const TOTAL_WIDTH = 24 * HOUR_WIDTH // full-day canvas

type ChannelEvent = { match: MatchSummary; tv: TVDetails }

type AssignedEvent = ChannelEvent & {
  startMins: number
  endMins: number
  lane: number
}

type ChannelData = {
  events: AssignedEvent[]
  laneCount: number
}

function minsFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

function resolveEventTimes(e: ChannelEvent): {
  startMins: number
  endMins: number
} {
  const startTime = e.tv.startTime
    ? new Date(e.tv.startTime)
    : new Date(e.match.startDate)
  const endTime = e.tv.endTime
    ? new Date(e.tv.endTime)
    : e.match.endDate
      ? new Date(e.match.endDate)
      : null
  const startMins = minsFromMidnight(startTime)
  const endMins = endTime ? minsFromMidnight(endTime) : startMins + 90
  return { startMins, endMins: Math.max(endMins, startMins + 30) }
}

/**
 * Greedy lane-packing with same-league affinity.
 * Priority order for placing an event:
 *   1. A free lane already associated with the same leagueId
 *   2. Any other free lane
 *   3. A new lane (opened when all existing lanes are busy)
 * Lanes are associated with the leagueId of their first event and never
 * reassigned, so same-league events keep gravitating to the same row.
 */
function assignLanes(events: ChannelEvent[]): ChannelData {
  const timed = events
    .map((e) => ({ ...e, ...resolveEventTimes(e) }))
    .sort((a, b) => a.startMins - b.startMins)

  const laneEndTimes: number[] = []
  const laneLeague: (string | undefined)[] = []

  const assigned: AssignedEvent[] = timed.map((event) => {
    const leagueId = event.match.leagueId
    let lane = -1

    // 1. Prefer a free lane already belonging to the same league
    if (leagueId !== undefined) {
      lane = laneLeague.findIndex(
        (id, i) => id === leagueId && laneEndTimes[i] <= event.startMins,
      )
    }

    // 2. Fall back to any free lane
    if (lane === -1) {
      lane = laneEndTimes.findIndex((end) => end <= event.startMins)
    }

    // 3. Open a new lane
    if (lane === -1) {
      lane = laneEndTimes.length
      laneEndTimes.push(0)
      laneLeague.push(leagueId)
    }

    laneEndTimes[lane] = event.endMins
    return { ...event, lane }
  })

  return { events: assigned, laneCount: Math.max(laneEndTimes.length, 1) }
}

export default function TVGuide({ data }: { data: MatchSummary[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Build per-channel data with lane assignments
  const channelMap = useMemo(() => {
    const raw = new Map<TVChannel, ChannelEvent[]>()
    for (const match of data) {
      if (!match.tv?.length) continue
      for (const tv of match.tv) {
        if (!raw.has(tv.channel)) raw.set(tv.channel, [])
        raw.get(tv.channel)!.push({ match, tv })
      }
    }
    const result = new Map<TVChannel, ChannelData>()
    for (const [channel, events] of raw) {
      result.set(channel, assignLanes(events))
    }
    return result
  }, [data])

  const channels = useMemo(
    () =>
      Array.from(channelMap.keys()).sort((a, b) => {
        const ai = CHANNEL_ORDER.indexOf(a)
        const bi = CHANNEL_ORDER.indexOf(b)
        const aPos = ai === -1 ? CHANNEL_ORDER.length : ai
        const bPos = bi === -1 ? CHANNEL_ORDER.length : bi
        return aPos - bPos
      }),
    [channelMap],
  )

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (!scrollRef.current) return
    const mins = minsFromMidnight(new Date())
    scrollRef.current.scrollLeft = Math.max(0, mins * PX_PER_MIN - 120)
  }, [])

  const nowMins = useMemo(() => minsFromMidnight(new Date()), [])

  const hours = Array.from({ length: 24 }, (_, i) => i)

  if (channels.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 text-sm text-gray-500 dark:text-neutral-400">
        No TV listings for today
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      className="hideScroll overflow-auto bg-white dark:bg-neutral-950 max-lg:landscape:fixed max-lg:landscape:inset-0 max-lg:landscape:z-[100]"
    >
      {/* Inner canvas — wider than viewport */}
      <div
        className="relative"
        style={{ width: CHANNEL_COL_WIDTH + TOTAL_WIDTH }}
      >
        {/* ── Current-time indicator ──────────────────────────── */}
        <div
          className="pointer-events-none absolute bottom-0 top-0 z-[9] w-0.5 bg-red-500/80"
          style={{ left: CHANNEL_COL_WIDTH + nowMins * PX_PER_MIN }}
        />
        {/* ── Time ruler row ──────────────────────────────────── */}
        <div
          className="sticky top-0 z-20 flex border-b border-gray-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900"
          style={{ height: HEADER_HEIGHT }}
        >
          {/* Corner cell */}
          <div
            className="sticky left-0 z-30 shrink-0 border-r border-gray-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900"
            style={{ width: CHANNEL_COL_WIDTH }}
          />
          {/* Hour ticks */}
          <div className="relative shrink-0" style={{ width: TOTAL_WIDTH }}>
            {hours.map((h) => (
              <div
                key={h}
                className="absolute top-0 flex h-full items-center border-r border-gray-200 px-2 dark:border-neutral-800"
                style={{ left: h * HOUR_WIDTH, width: HOUR_WIDTH }}
              >
                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">
                  {format(new Date(new Date().setHours(h, 0, 0, 0)), "h:mm a")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Channel rows ────────────────────────────────────── */}
        {channels.map((channel) => {
          const { events, laneCount } = channelMap.get(channel)!
          const rowHeight = ROW_HEIGHT * laneCount
          const laneHeight = ROW_HEIGHT
          return (
            <div
              key={channel}
              className="flex border-b border-gray-200 dark:border-neutral-800"
              style={{ height: rowHeight }}
            >
              {/* Channel label — sticks to left edge while scrolling */}
              <div
                className="sticky left-0 z-10 flex shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 px-2 dark:border-neutral-700 dark:bg-neutral-900"
                style={{ width: CHANNEL_COL_WIDTH, height: rowHeight }}
              >
                <Image
                  src={resolveSportImage(channel)}
                  alt={channel}
                  width={100}
                  height={100}
                  style={{
                    width: 40,
                    height: "auto",
                  }}
                />
              </div>

              {/* Event track */}
              <div
                className="relative shrink-0"
                style={{ width: TOTAL_WIDTH, height: rowHeight }}
              >
                {/* Hour grid lines */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="absolute bottom-0 top-0 border-r border-gray-100 dark:border-neutral-800/60"
                    style={{ left: h * HOUR_WIDTH }}
                  />
                ))}

                {/* Match blocks */}
                {events.map(({ match, tv, startMins, endMins, lane }) => {
                  const startTime = tv.startTime
                    ? new Date(tv.startTime)
                    : new Date(match.startDate)

                  const width = (endMins - startMins) * PX_PER_MIN - 2
                  const left = startMins * PX_PER_MIN
                  const top = lane * laneHeight + 4
                  const height = laneHeight - 8

                  return (
                    <Link
                      key={`${match.id}-${channel}`}
                      href={match.matchSlug ?? "#"}
                      className={cn(
                        "absolute flex overflow-hidden rounded-sm text-white transition-opacity hover:opacity-90",
                        "bg-blue-600 dark:bg-slate-700",
                        match.status === MatchStatus.LIVE &&
                          "dark:bg-green-700",
                      )}
                      style={{ left, width, top, height }}
                    >
                      {/* League image — left strip */}
                      {match.leagueImg && (
                        <div
                          className={cn(
                            "flex w-9 shrink-0 items-center justify-center bg-blue-700/60 dark:bg-slate-800/60",
                          )}
                        >
                          <Image
                            src={match.leagueImg ?? FALLBACK_IMAGE}
                            alt={match.leagueName ?? "League"}
                            width={24}
                            height={24}
                            style={{
                              width: 24,
                              height: "auto",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}

                      {/* Text details */}
                      <div className="flex min-w-0 flex-col justify-center gap-0.5 px-2 py-1">
                        {match.leagueName && (
                          <span className="truncate text-[10px] font-semibold leading-tight">
                            {match.leagueName}
                          </span>
                        )}
                        <span className="truncate text-[10px] leading-tight opacity-75">
                          {format(startTime, "h:mm a")}
                        </span>
                        {match.competitorDetails.length > 0 && (
                          <span className="truncate text-[10px] leading-tight opacity-65">
                            {match.competitorDetails
                              .map((c) => c.name)
                              .join(" v ")}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
