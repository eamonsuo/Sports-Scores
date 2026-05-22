"use client"

import MatchSummaryCard from "@/components/all-sports/MatchSummaryCard"
import SessionSummaryCard from "@/components/motorsport/SessionSummaryCard"
import TennisMatchCard from "@/components/tennis/TennisMatchCard"
import { cn } from "@/lib/utils"
import { CardVariant, MatchSummary } from "@/types/misc"
import React, { useEffect } from "react"
import Placeholder from "../misc-ui/Placeholder"
import LeagueHeader from "./LeagueHeader"
import SectionDate from "./SectionDate"

const cardVariantMap: Record<CardVariant, typeof MatchSummaryCard> = {
  [CardVariant.TENNIS]: TennisMatchCard,
  [CardVariant.SESSION]: SessionSummaryCard,
  [CardVariant.DEFAULT]: MatchSummaryCard,
}

// Assumes data prop is already sorted in desired order
export default function FixtureList({ data }: { data: MatchSummary[] }) {
  useEffect(() => {
    let retryInterval: ReturnType<typeof setInterval> | null = null

    const scrollToAnchor = () => {
      const element = document.getElementById("current-date")
      if (element) {
        element.scrollIntoView(true)
        return true
      }
      return false
    }

    // Wait a bit longer for layout to complete before scrolling
    const timer = setTimeout(() => {
      if (!scrollToAnchor()) {
        // If not found, retry with intervals
        const maxRetries = 10
        let retryCount = 0

        retryInterval = setInterval(() => {
          if (scrollToAnchor() || retryCount >= maxRetries) {
            clearInterval(retryInterval!)
            retryInterval = null
          }
          retryCount++
        }, 100)
      }
    }, 200)

    return () => {
      clearTimeout(timer)
      if (retryInterval) clearInterval(retryInterval)
    }
  }, [])

  const currentDate: Date = new Date()

  let sectionDate = new Date("2000-01-01")
  let sectionSeries = ""
  let displayDate = false
  let displaySeries = false
  let currentMatch = false
  let currentDateFlag = false

  if (data.length === 0) {
    return <Placeholder>NO DATA</Placeholder>
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {data.map((item: MatchSummary, index) => {
        let itemDate = new Date(item.startDate)
        displayDate = displaySeries = false

        if (sectionDate.toDateString() !== itemDate.toDateString()) {
          sectionDate = itemDate
          displayDate = true
        }

        if (sectionSeries !== item.leagueName) {
          sectionSeries = item.leagueName ?? ""
          displaySeries = true
        }

        if (currentMatch) {
          currentMatch = false
        }

        const now = currentDate.getTime()
        const isCurrentDate =
          !currentDateFlag &&
          (currentDate.toDateString() === sectionDate.toDateString() ||
            now <= sectionDate.getTime() ||
            (item.endDate !== undefined &&
              now >= new Date(item.startDate).getTime() &&
              now <= item.endDate.getTime()))

        if (isCurrentDate) currentMatch = currentDateFlag = true

        const CardComponent =
          cardVariantMap[item.cardVariant] ?? MatchSummaryCard

        return (
          <React.Fragment key={item.id}>
            {displayDate && (
              <SectionDate
                sectionDate={sectionDate}
                sectionDateEnd={item.endDate}
                currentDate={currentMatch}
              />
            )}
            {(displaySeries || displayDate) && item.leagueName && (
              <LeagueHeader
                href={item.leagueSlug ?? ""}
                seriesName={item.leagueName}
                img={item.leagueImg}
              />
            )}
            <CardComponent
              className={cn(
                item.leagueName ? "mt-0" : "rounded-md",
                item.leagueName &&
                  (() => {
                    // If next item is a different series or date, round the bottom corners
                    const nextItem = data[index + 1]
                    if (!nextItem) return true
                    const nextDate = new Date(nextItem.startDate)
                    return (
                      nextDate.toDateString() !== itemDate.toDateString() ||
                      nextItem.leagueName !== item.leagueName
                    )
                  })() &&
                  "rounded-b-md",
              )}
              event={item}
              href={item.matchSlug ?? ""}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}
