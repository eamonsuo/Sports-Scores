import { SessionSummary } from "@/types/f1";
import React from "react";
import SectionDateRange from "../generic/SectionDateRange";
import SessionSummaryCard from "./SessionSummaryCard";
import WeekendSummaryCard from "./WeekendSummaryCard";

export default function RaceList({ data }: { data: SessionSummary[] }) {
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
        let itemDate = new Date(item.startDate);
        let raceDate = new Date(
          data.find((s) => s.name === item.name && s.type === "Race")
            ?.startDate ?? "",
        );

        displayDate = false;
        if (curGrandPrix !== item.name) {
          curGrandPrix = item.name;
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
          <React.Fragment key={item.id}>
            {displayDate && (
              <React.Fragment>
                <SectionDateRange
                  dateFrom={startDate}
                  dateTo={raceDate}
                  currentDate={currentMatch}
                />
                <WeekendSummaryCard
                  grandPrix={item.name}
                  img={item.logo}
                  status={""}
                />
              </React.Fragment>
            )}

            <SessionSummaryCard
              href={`/sports/${item.sport}/${item.id}`}
              sessionType={item.type}
              img={item.logo}
              status={item.status}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
