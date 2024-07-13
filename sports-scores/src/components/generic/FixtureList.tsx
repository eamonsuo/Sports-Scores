import MatchSummaryCard from "@/components/generic/MatchSummaryCard";
import { MatchSummary } from "@/types/misc";

function SectionDate({
  sectionDate,
  display,
  currentDate,
}: {
  sectionDate: Date;
  display: boolean;
  currentDate: boolean;
}) {
  if (display) {
    if (currentDate) {
      return (
        <div id="current-date" className="mt-4 text-black">
          {sectionDate.toDateString()}
        </div>
      );
    }
    return <div className="mt-4 text-black">{sectionDate.toDateString()}</div>;
  }
  return null;
}

export default function FixtureList({ data }: { data: MatchSummary[] }) {
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
          <div key={item.id}>
            <SectionDate
              sectionDate={sectionDate}
              display={displayDate}
              currentDate={currentMatch}
            />
            <MatchSummaryCard data={item} />
          </div>
        );
      })}
    </div>
  );
}
