"use client";

import MatchSummaryCard from "@/components/all-sports/MatchSummaryCard";
import TennisMatchCard from "@/components/tennis/TennisMatchCard";
import { formatTime } from "@/lib/projUtils";
import { CardVariant, MatchSummary } from "@/types/misc";
import React from "react";
import Placeholder from "../misc-ui/Placeholder";
import LeagueSeriesHeader from "./LeagueSeriesHeader";
import SectionDate from "./SectionDate";

// Assumes data prop is already sorted in desired order
export default function FixtureList({
  data,
  cardVariant = "default",
}: {
  data: MatchSummary[];
  cardVariant?: CardVariant;
}) {
  const CardComponent =
    cardVariant === "tennis" ? TennisMatchCard : MatchSummaryCard;

  const currentDate: Date = new Date(Date.now());

  let sectionDate = new Date("2000-01-01");
  let sectionSeries = "";
  let displayDate = false;
  let displaySeries = false;
  let currentMatch = false;
  let currentDateFlag = false;

  if (data.length === 0) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {data.map((item: MatchSummary) => {
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
              <LeagueSeriesHeader
                href={`/sports/${item.sport}/${item.seriesSlug}`}
                seriesName={item.seriesName ?? ""}
              />
            )}
            <CardComponent
              className={item.seriesName ? "mt-0 rounded-b-md" : "rounded-md"}
              id={item.id}
              href={`/sports/${item.sport}/${item.matchSlug ?? item.id}`}
              homeInfo={item.homeDetails}
              awayInfo={item.awayDetails}
              matchSummary={item.summaryText}
              bottomInfo={item.otherDetail}
              venue={item.venue ?? ""}
              timer={{
                display:
                  item.timer instanceof Date
                    ? formatTime(item.timer)
                    : (item.timer ?? ""),
                displayColour: item.timerDisplayColour,
              }}
              topInfo={undefined}
              winner={item.winner}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
