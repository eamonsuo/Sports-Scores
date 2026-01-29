import MatchSummaryCard from "@/components/all-sports/MatchSummaryCard";
import TennisMatchCard from "@/components/tennis/TennisMatchCard";
import { MatchSummary } from "@/types/misc";
import React from "react";
import SectionDate from "./SectionDate";

// Assumes data prop is already sorted in desired order
export default function FixtureList({
  data,
  cardVariant = "default",
}: {
  data: MatchSummary[];
  cardVariant?: "tennis" | "default";
}) {
  const CardComponent =
    cardVariant === "tennis" ? TennisMatchCard : MatchSummaryCard;

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
            <CardComponent
              id={item.id}
              href={`/sports/${item.sport}/${item.matchSlug ?? item.id}`}
              homeInfo={item.homeDetails}
              awayInfo={item.awayDetails}
              matchSummary={item.summaryText}
              bottomInfo={item.otherDetail}
              venue={item.venue}
              timer={{
                display: item.timer,
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
