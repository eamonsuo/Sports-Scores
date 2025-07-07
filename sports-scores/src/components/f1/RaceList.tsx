"use client";

import { toShortTimeString } from "@/lib/projUtils";
import { SessionSummary } from "@/types/f1";
import React, { useEffect } from "react";
import SectionDateRange from "../generic/SectionDateRange";
import SessionSummaryCard from "./SessionSummaryCard";
import WeekendSummaryCard from "./WeekendSummaryCard";

export default function RaceList({ data }: { data: SessionSummary[] }) {
  useEffect(() => {
    const scrollToAnchor = () => {
      const element = document.getElementById("current-date");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
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
      {data.map((item: SessionSummary) => {
        let raceDate = new Date(
          data.find(
            (s) =>
              s.grandPrixName === item.grandPrixName &&
              s.sessionType === "Race",
          )?.startDate ?? "",
        );

        displayDate = false;
        if (curGrandPrix !== item.grandPrixName) {
          curGrandPrix = item.grandPrixName;
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
          <React.Fragment key={item.sessionType + item.grandPrixName}>
            {displayDate && (
              <React.Fragment>
                <SectionDateRange
                  dateFrom={startDate}
                  dateTo={raceDate}
                  currentDate={currentMatch}
                />
                <WeekendSummaryCard
                  grandPrix={item.grandPrixName}
                  img={item.logo}
                  status={""}
                />
              </React.Fragment>
            )}

            <SessionSummaryCard
              href={`/sports/${item.sport}/${item.round}/${item.sessionType}`}
              sessionType={item.sessionName ?? item.sessionType}
              status={toShortTimeString(item.startDate)}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
