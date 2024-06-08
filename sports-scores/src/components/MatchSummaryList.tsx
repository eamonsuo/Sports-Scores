import ScoreSummaryCard from "@/components/ScoreSummaryCard"
import { calculateAFLMatchResult } from "@/js/utils";
import { MATCHSTATUSAFL } from "@/js/constants";

function SectionDate({sectionDate, display, currentDate}: any) {
  if (display) {
    if (currentDate) {
      return (<div id="current-date" className="text-black mt-2">{sectionDate.toDateString()}</div>);
    }
    return (<div className="text-black mt-2">{sectionDate.toDateString()}</div>);
  }
  return null;
}

export default async function MatchSummaryList() {
  const current_date: Date = new Date(Date.now());

  const reqHeaders: Headers = new Headers();
  reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);
  //TODO: make reusable
  //TODO: build api library
  const rawFixtures = await fetch(`https://v1.afl.api-sports.io/games?season=2024&league=1`, {headers: reqHeaders});
  const fixtures: APISportsGameAfl = await rawFixtures.json();

  // console.log(fixtures);
  let sectionDate: Date = new Date("2024-01-01");
  let displayDate: boolean = false;
  let currentMatch: boolean = false;
  let currentDateFlag: boolean = false;
  
  return (<div className="flex-1 overflow-y-auto px-4">
      {fixtures.response.map((item: APISportsMatchResponseAfl)=> {
        
        let item_date: Date = new Date(item.date);
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
        
        return <><SectionDate key={item.game.id} sectionDate={sectionDate} display={displayDate} currentDate={currentMatch}></SectionDate> <ScoreSummaryCard 
          key={item.game.id} 
          matchDetails={{
            venue: item.venue,
            status: item.status.long,
            //TODO: Add an option in for during the game
            summary: item.status.short === MATCHSTATUSAFL.SHORT_NS ? `Starts at ${item_date.toLocaleTimeString()} ` : calculateAFLMatchResult(item.teams.home.name, item.scores.home.score, item.teams.away.name, item.scores.away.score),
            otherDetail: `Round ${item.week}`
          }} 
          homeDetails={{
            img: item.teams.home.logo,
            score: item.scores.home.score.toString(),
            name: item.teams.home.name
          }} 
          awayDetails={{
            img: item.teams.away.logo,
            score: item.scores.away.score.toString(),
            name: item.teams.away.name
          }}>
        </ScoreSummaryCard></>;})
      }
  </div> );
}
