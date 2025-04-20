import { GolfTournament } from "@/types/golf";
import React from "react";
import SectionDateRange from "../generic/SectionDateRange";
import TournamentSummaryCard from "./TournamentSummaryCard";

// Assumes data prop is already sorted in desired order
export default function GolfSchedule({ data }: { data: GolfTournament[] }) {
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
      {data.map((item: GolfTournament) => {
        let item_date = item.startDate;
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
              img="/vercel.svg"
              name={item.name}
              status={item.status}
              top5Players={[]}
              url={`/sports/golf/${item.tourName}/tournament/${item.id}`}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
