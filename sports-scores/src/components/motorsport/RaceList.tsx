"use client"

import { cn } from "@/lib/utils"
import React, { useEffect } from "react"
import { MatchSummary } from "../../types/misc"
import LeagueHeader from "../all-sports/LeagueHeader"
import SectionDate from "../all-sports/SectionDate"
import SessionSummaryCard from "./SessionSummaryCard"

export default function RaceList({ data }: { data: MatchSummary[] }) {
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

  const current_date: Date = new Date(Date.now())

  let startDate: Date = new Date("2000-01-01")
  let displayDate: boolean = false
  let currentMatch: boolean = false
  let currentDateFlag: boolean = false
  let curGrandPrix = ""

  if (data.length === 0) {
    return <>NO DATA</>
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {data.map((item: MatchSummary, index: number) => {
        let raceDate = new Date(
          data.find(
            (s) => s.leagueName === item.leagueName && s.summaryText === "Race",
          )?.startDate ?? "",
        )

        displayDate = false
        if (curGrandPrix !== item.leagueName) {
          curGrandPrix = item.leagueName ?? ""
          startDate = new Date(item.startDate) //Assumes data variable is sorted by date
          displayDate = true
        }

        if (currentMatch) {
          currentMatch = false
        }

        if (!currentDateFlag && current_date.getTime() <= raceDate.getTime()) {
          currentMatch = true
          currentDateFlag = true
        }

        return (
          <React.Fragment key={item.id}>
            {displayDate && (
              <React.Fragment>
                <SectionDate
                  sectionDate={startDate}
                  sectionDateEnd={raceDate}
                  currentDate={currentMatch}
                />
                <LeagueHeader
                  href={`${item.leagueSlug}`}
                  seriesName={item.leagueName ?? ""}
                  img={item.leagueImg}
                  className="p-4 dark:text-neutral-400"
                />
              </React.Fragment>
            )}

            <SessionSummaryCard
              href={`${item.matchSlug}`}
              event={item}
              className={cn(
                "mt-0",
                index === data.length - 1 && "rounded-b-md",
              )}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}
