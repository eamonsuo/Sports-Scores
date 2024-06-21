import ScoreSummaryCard from "@/components/generic/MatchSummaryCard";

function SectionDate({ sectionDate, display, currentDate }: any) {
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

export default function MatchSummaryList({ data }: { data: MatchSummary[] }) {
  const current_date: Date = new Date(Date.now());

  // console.log(fixtures);
  let sectionDate: Date = new Date("2024-01-01");
  let displayDate: boolean = false;
  let currentMatch: boolean = false;
  let currentDateFlag: boolean = false;

  if (data.length === 0) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {data.map((item: MatchSummary) => {
        let item_date: Date = new Date(item.startDate);
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
          <>
            <SectionDate
              key={item.id}
              sectionDate={sectionDate}
              display={displayDate}
              currentDate={currentMatch}
            />
            <ScoreSummaryCard key={item.id} data={item} />
          </>
        );
      })}
    </div>
  );
}
