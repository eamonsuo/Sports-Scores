import MatchSummaryList from "@/components/MatchSummaryList"
import NavButtonGroup from "@/components/NavButtonGroup"

export default async function Page() {
  
  return (<>
  <div className="flex flex-col h-full">
    <div><NavButtonGroup></NavButtonGroup></div>
  
  <div className="flex-1 overflow-y-auto">
  <MatchSummaryList></MatchSummaryList>
  </div>
  </div>
  </>);
}
