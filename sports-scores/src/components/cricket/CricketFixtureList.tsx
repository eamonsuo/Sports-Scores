import SectionDate from "@/components/generic/SectionDate";
import { MatchSummary } from "@/types/misc";
import React from "react";
import CricketMatchSummaryCard from "./CricketMatchSummaryCard";
import CricketSeriesHeader from "./CricketSeriesHeader";

// Assumes data prop is already sorted in desired order
export default function CricketFixtureList({ data }: { data: MatchSummary[] }) {
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
      {data.map((item: MatchSummary) => {
        let item_date = new Date(item.startDate);
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
                sectionDate={sectionDate}
                currentDate={currentMatch}
              />
            )}
            <CricketSeriesHeader
              href={`/sports/cricket/series/${item.seriesSlug}/matches#current-date`}
              seriesName={item.seriesName ?? ""}
            />
            <CricketMatchSummaryCard
              id={item.id}
              hrefMatch={`/sports/${item.sport}/match/${item.seriesSlug}/${item.matchSlug}`}
              homeInfo={item.homeDetails}
              awayInfo={item.awayDetails}
              matchSummary={item.summary}
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
