import SectionDate from "@/components/all-sports/SectionDate";
import { MatchSummary } from "@/types/misc";
import React from "react";
import SectionDateRange from "../all-sports/SectionDateRange";
import CricketMatchSummaryCard from "./CricketMatchSummaryCard";
import CricketSeriesHeader from "./CricketSeriesHeader";

// Assumes data prop is already sorted in desired order
export default function CricketFixtureList({ data }: { data: MatchSummary[] }) {
  const current_date = new Date(Date.now());

  let sectionDate = new Date("2000-01-01");
  let sectionSeries = "";
  let displayDate = false;
  let displaySeries = false;
  let currentMatch = false;
  let currentDateFlag = false;

  if (data.length === 0) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 px-4">
      {data.map((item: MatchSummary) => {
        let item_date = new Date(item.startDate);
        displayDate = false;
        displaySeries = false;

        if (sectionDate.toDateString() !== item_date.toDateString()) {
          sectionDate = item_date;
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
          (current_date.toDateString() === sectionDate.toDateString() ||
            current_date.getTime() <= sectionDate.getTime())
        ) {
          currentMatch = true;
          currentDateFlag = true;
        }

        return (
          <React.Fragment key={item.id}>
            {displayDate &&
              (item?.endDate?.getUTCDate() === item.startDate.getUTCDate() ? (
                <SectionDate
                  sectionDate={sectionDate}
                  currentDate={currentMatch}
                />
              ) : (
                <SectionDateRange
                  dateFrom={item.startDate}
                  dateTo={item?.endDate ?? item.startDate}
                  currentDate={currentMatch}
                />
              ))}
            {(displaySeries || displayDate) && (
              <CricketSeriesHeader
                href={`/sports/cricket/series/${item.seriesSlug}/matches#current-date`}
                seriesName={item.seriesName ?? ""}
              />
            )}
            <CricketMatchSummaryCard
              id={item.id}
              hrefMatch={`/sports/cricket/match/${item.matchSlug}`}
              homeInfo={
                Array.isArray(item.homeDetails)
                  ? item.homeDetails[0]
                  : item.homeDetails
              }
              awayInfo={
                Array.isArray(item.awayDetails)
                  ? item.awayDetails[0]
                  : item.awayDetails
              }
              matchSummary={item.summaryText}
              bottomInfo={item.otherDetail}
              venue={item.venue}
              timer={item.timer}
              topInfo={undefined}
              hrefSeries=""
              seriesName={item.seriesName ?? ""}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
