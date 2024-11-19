import { SessionSummary } from "@/types/f1";
import React from "react";
import SectionDate from "../generic/SectionDate";
import RaceSummaryCard from "./RaceSummaryCard";

export default function RaceList({ data }: { data: SessionSummary[] }) {
  const current_date: Date = new Date(Date.now());

  // console.log(fixtures);
  let sectionDate: Date = new Date("2000-01-01");
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
        let item_date = new Date(item.startDate);
        displayDate = false;
        if (
          sectionDate.toDateString() !== item_date.toDateString() &&
          curGrandPrix !== item.name
        ) {
          sectionDate = item_date;
          curGrandPrix = item.name;
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
              <React.Fragment>
                <SectionDate
                  sectionDate={sectionDate}
                  currentDate={currentMatch}
                />
                <RaceSummaryCard
                  id={item.id}
                  href={`/sports/${item.sport}/${item.id}`}
                  grandPrix={item.name}
                  sessionType={""}
                  img={item.logo}
                  status={item.status}
                />
              </React.Fragment>
            )}

            <RaceSummaryCard
              id={item.id}
              href={`/sports/${item.sport}/${item.id}`}
              grandPrix={""}
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
