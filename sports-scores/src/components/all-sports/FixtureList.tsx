"use client";

import MatchSummaryCard from "@/components/all-sports/MatchSummaryCard";
import { cardVariantMap } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CardVariant, MatchSummary } from "@/types/misc";
import React, { useEffect } from "react";
import Placeholder from "../misc-ui/Placeholder";
import LeagueHeader from "./LeagueHeader";
import SectionDate from "./SectionDate";

// Assumes data prop is already sorted in desired order
export default function FixtureList({
  data,
  cardVariant = CardVariant.DEFAULT,
}: {
  data: MatchSummary[];
  cardVariant?: CardVariant;
}) {
  const CardComponent = cardVariantMap[cardVariant] ?? MatchSummaryCard;

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

  const currentDate: Date = new Date();

  let sectionDate = new Date("2000-01-01");
  let sectionSeries = "";
  let displayDate = false;
  let displaySeries = false;
  let currentMatch = false;
  let currentDateFlag = false;
  let roundedCardBorder = false;

  if (data.length === 0) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {data.map((item: MatchSummary, index) => {
        let itemDate = new Date(item.startDate);
        displayDate = false;
        displaySeries = false;

        if (sectionDate.toDateString() !== itemDate.toDateString()) {
          sectionDate = itemDate;
          displayDate = true;
        }

        if (sectionSeries !== item.seriesName) {
          sectionSeries = item.seriesName ?? "";
          displaySeries = true;
        }

        if (currentMatch) {
          currentMatch = false;
        }
        if (
          !currentDateFlag &&
          (currentDate.toDateString() === sectionDate.toDateString() ||
            currentDate.getTime() <= sectionDate.getTime())
        ) {
          currentMatch = true;
          currentDateFlag = true;
        }

        return (
          <React.Fragment key={item.id}>
            {displayDate && (
              <SectionDate
                sectionDate={sectionDate}
                sectionDateEnd={item.endDate}
                currentDate={currentMatch}
              />
            )}
            {(displaySeries || displayDate) && item.seriesName && (
              <LeagueHeader
                href={`/sports/${item.sport}/${item.seriesSlug}`}
                seriesName={item.seriesName}
                img={item.seriesImg}
              />
            )}
            <CardComponent
              className={cn(
                item.seriesName ? "mt-0" : "rounded-md",
                item.seriesName &&
                  (() => {
                    // If next item is a different series or date, round the bottom corners
                    const nextItem = data[index + 1];
                    if (!nextItem) return true;
                    const nextDate = new Date(nextItem.startDate);
                    return (
                      nextDate.toDateString() !== itemDate.toDateString() ||
                      nextItem.seriesName !== item.seriesName
                    );
                  })() &&
                  "rounded-b-md",
              )}
              event={item}
              href={`/sports/${item.sport}/${item.matchSlug ?? item.id}`}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
