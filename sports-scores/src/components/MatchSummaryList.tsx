import ScoreSummaryCard from "@/components/ScoreSummaryCard"
import { calculateAFLMatchResult } from "@/js/utils";
import { MATCHSTATUSAFL, SPORT } from "@/js/constants";
import { fetchSportSummaryData } from "@/js/externalAPI"

function SectionDate({sectionDate, display, currentDate}: any) {
  if (display) {
    if (currentDate) {
      return (<div id="current-date" className="text-black mt-2">{sectionDate.toDateString()}</div>);
    }
    return (<div className="text-black mt-2">{sectionDate.toDateString()}</div>);
  }
  return null;
}

export default async function MatchSummaryList({sport}: {sport: string}) {
  const current_date: Date = new Date(Date.now());

  const fixtures: MatchSummary[] = await fetchSportSummaryData(sport);

  // console.log(fixtures);
  let sectionDate: Date = new Date("2024-01-01");
  let displayDate: boolean = false;
  let currentMatch: boolean = false;
  let currentDateFlag: boolean = false;
  
  return (<div className="flex-1 overflow-y-auto px-4">
      {fixtures.map((item: MatchSummary)=> {
        
        let item_date: Date = new Date(item.startDate);
        displayDate = false;
        if (sectionDate.toDateString() !== item_date.toDateString()) {
          sectionDate = item_date;
          displayDate = true;
        }

        if (currentMatch) {
          currentMatch = false;
        }
        if (!currentDateFlag && (current_date.toDateString() === sectionDate.toDateString() || current_date.getTime() <= sectionDate.getTime())) {
          currentMatch = true;
          currentDateFlag = true;
        }
        
        return <>
        <SectionDate 
        key={item.id} sectionDate={sectionDate} display={displayDate} currentDate={currentMatch}>
        </SectionDate>
        <ScoreSummaryCard 
          key={item.id} 
          matchDetails={item.details?.matchDetails} 
          homeDetails={item.details?.homeDetails} 
          awayDetails={item.details?.awayDetails}>
        </ScoreSummaryCard></>;})
      }
  </div> );
}
