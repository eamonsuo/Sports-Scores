"use client";

import { SessionSummary } from "@/types/f1";
import { format } from "date-fns";
import React, { useEffect } from "react";
import SectionDate from "../all-sports/SectionDate";
import SessionSummaryCard from "./SessionSummaryCard";
import WeekendSummaryCard from "./WeekendSummaryCard";

export default function RaceList({ data }: { data: SessionSummary[] }) {
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
                <SectionDate
                  sectionDate={startDate}
                  sectionDateEnd={raceDate}
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
              href={`/sports/${item.sport}/${item.sessionSlug}`}
              sessionType={item.sessionName ?? item.sessionType}
              status={item.status ?? format(item.startDate, "E h:mm a ")}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
