import ScoreSummaryCard from "@/components/ScoreSummaryCard"
import { setMatchStatusCricket } from "@/js/utils";

export default async function Page() {
  const current_date: Date = new Date(Date.now());
  const query_start_date: Date = new Date(current_date);
  query_start_date.setDate(query_start_date.getDate() - 7);
  const query_end_date: Date = new Date(query_start_date);
  query_end_date.setFullYear(query_end_date.getFullYear() + 1);

  
  const rawFixtures = await fetch(`https://cricket.sportmonks.com/api/v2.0/fixtures?sort=starting_at&filter[starts_between]=${query_start_date.getFullYear()}-${query_start_date.getMonth()+1}-${query_start_date.getDate()},${query_end_date.getFullYear()}-${query_end_date.getMonth()+1}-${query_end_date.getDate()}&include=runs,venue,localteam,visitorteam&api_token=${process.env.SportsMonksAPIKey}`);
  // console.log(query_start_date, '---', query_start_date.getMonth());
  const fixtures = await rawFixtures.json();
  let sectionDate: Date = new Date(query_start_date);
  let displayDate: boolean = false;
  

  function SectionDate({sectionDate, display}: any) {
    if (display) {
      return (<div className="text-black mt-2">{sectionDate.toDateString()}</div>)
    }
    return null
  }
  
  return (
    <div className="items-center h-[84vh] overflow-auto px-4 bg-white">
      {fixtures.data.map((item: any)=> 
        {
        let item_date: Date = new Date(item.starting_at);
        if (sectionDate.getTime() < item_date.getTime()) {
          sectionDate = item_date;
          displayDate = true
        }
        // console.log(item.note);
        return <><SectionDate key={item.id} sectionDate={sectionDate} display={displayDate}></SectionDate> <ScoreSummaryCard 
          key={item.id} 
          matchDetails={{
            venue: `${item.venue.name}, ${item.venue.city}`,
            status: setMatchStatusCricket(item.status),
            summary: item.status === 'NS' ? `Starts at ${item_date.toLocaleTimeString()} ` : item.note,
            otherDetail: item.round
          }} 
          homeDetails={{
            img: item.localteam.image_path,
            score: `${item.runs[0]?.wickets ? item.runs[0]?.wickets : '0'}/${item.runs[0]?.score ? item.runs[0]?.score : '0'}`,
            name: item.localteam.name
          }} 
          awayDetails={{
            img: item.visitorteam.image_path,
            score: `${item.runs[1]?.wickets ? item.runs[1]?.wickets : '0'}/${item.runs[1]?.score ? item.runs[1]?.score : '0'}`,
            name: item.visitorteam.name
          }}>
        </ScoreSummaryCard></>;})
      }
    </div>
  );
}
