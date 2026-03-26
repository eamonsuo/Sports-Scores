"use client";

import { GolfSchedule } from "@/types/golf";
import React, { useEffect } from "react";
import SectionDate from "../all-sports/SectionDate";
import TournamentSummaryCard from "./TournamentSummaryCardSchedule";

// Assumes data prop is already sorted in desired order
export default function GolfScheduleList({
  data,
  season,
}: {
  data: GolfSchedule[];
  season: string;
}) {
  useEffect(() => {
    const scrollToAnchor = () => {
      const element = document.getElementById("current-date");
      if (element) {
        // Use block: 'nearest' to avoid over-scrolling past the element on mobile
        // This will scroll the minimum amount needed to bring the element into view
        element.scrollIntoView({
          behavior: "auto",
          block: "start",
          inline: "nearest",
        });
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
    }, 500);

    return () => clearTimeout(timer);
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
              <SectionDate
                sectionDate={item.startDate}
                sectionDateEnd={item.endDate}
                currentDate={currentMatch}
              />
            )}
            <TournamentSummaryCard
              img={item.img}
              name={item.name}
              status={item.status}
              leader={item.leader}
              location={item.location}
              url={`/sports/golf/${item.tourName}/${season}/${item.id}`}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
