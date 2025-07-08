"use client";

import { GolfSchedule } from "@/types/golf";
import React, { useEffect } from "react";
import SectionDateRange from "../generic/SectionDateRange";
import TournamentSummaryCard from "./TournamentSummaryCardSchedule";

// Assumes data prop is already sorted in desired order
export default function GolfScheduleList({ data }: { data: GolfSchedule[] }) {
  useEffect(() => {
    const scrollToAnchor = () => {
      const element = document.getElementById("current-date");
      if (element) {
        element.scrollIntoView(true);
        return true;
      }
      return false;
    };

    // Try immediately
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
  }, []);

  const current_date: Date = new Date(Date.now());

  let sectionDate: Date = new Date("2000-01-01");
  let displayDate: boolean = false;
  let currentMatch: boolean = false;
  let currentDateFlag: boolean = false;

  if (data.length === 0) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {data.map((item: GolfSchedule) => {
        let item_date = item.endDate;
        displayDate = false;
        if (sectionDate.toDateString() !== item_date.toDateString()) {
          sectionDate = item_date;
          displayDate = true;
        }

        if (currentMatch) {
          currentMatch = false;
        }
        if (
          !currentDateFlag &&
          (current_date.toDateString() === sectionDate.toDateString() ||
            current_date.getTime() <= sectionDate.getTime())
        ) {
          currentMatch = true;
          currentDateFlag = true;
        }

        return (
          <React.Fragment key={item.id}>
            {displayDate && (
              <SectionDateRange
                dateFrom={item.startDate}
                dateTo={item.endDate}
                currentDate={currentMatch}
              />
            )}
            <TournamentSummaryCard
              img={item.img}
              name={item.name}
              status={item.status}
              leader={item.leader}
              location={item.location}
              url={`/sports/golf/${item.tourName}/tournament/${item.id}`}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
