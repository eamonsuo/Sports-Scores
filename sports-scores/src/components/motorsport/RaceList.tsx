"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { MatchSummary } from "../../types/misc";
import LeagueHeader from "../all-sports/LeagueHeader";
import SectionDate from "../all-sports/SectionDate";
import SessionSummaryCard from "./SessionSummaryCard";

export default function RaceList({ data }: { data: MatchSummary[] }) {
  useEffect(() => {
    const scrollToAnchor = () => {
      const element = document.getElementById("current-date");
      if (element) {
        element.scrollIntoView(true);
        return true;
      }
      return false;
    };

    // Wait a bit longer for layout to complete before scrolling
    const timer = setTimeout(() => {
      if (!scrollToAnchor()) {
        // If not found, retry with intervals
        const maxRetries = 10;
        let retryCount = 0;

        const retryInterval = setInterval(() => {
          if (scrollToAnchor() || retryCount >= maxRetries) {
            clearInterval(retryInterval);
          }
          retryCount++;
        }, 100);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const current_date: Date = new Date(Date.now());

  let startDate: Date = new Date("2000-01-01");
  let displayDate: boolean = false;
  let currentMatch: boolean = false;
  let currentDateFlag: boolean = false;
  let curGrandPrix = "";

  if (data.length === 0) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {data.map((item: MatchSummary, index: number) => {
        let raceDate = new Date(
          data.find(
            (s) => s.seriesName === item.seriesName && s.summaryText === "Race",
          )?.startDate ?? "",
        );

        displayDate = false;
        if (curGrandPrix !== item.seriesName) {
          curGrandPrix = item.seriesName ?? "";
          startDate = new Date(item.startDate); //Assumes data variable is sorted by date
          displayDate = true;
        }

        if (currentMatch) {
          currentMatch = false;
        }

        if (!currentDateFlag && current_date.getTime() <= raceDate.getTime()) {
          currentMatch = true;
          currentDateFlag = true;
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
                  href={`/sports/${item.sport}/${item.seriesSlug}`}
                  seriesName={item.seriesName ?? ""}
                  img={item.seriesImg}
                  className="p-4 dark:text-neutral-400"
                />
              </React.Fragment>
            )}

            <SessionSummaryCard
              href={`/sports/${item.sport}/${item.matchSlug}`}
              event={item}
              className={cn(
                "mt-0",
                index === data.length - 1 && "rounded-b-md",
              )}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
