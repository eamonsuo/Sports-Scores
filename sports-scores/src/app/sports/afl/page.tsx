import MatchSummaryList from "@/components/MatchSummaryList"
import NavButtonGroup from "@/components/NavButtonGroup"

export default async function Page() {
  
  return (
  <div className="flex flex-col h-full">
      <NavButtonGroup></NavButtonGroup>
      <MatchSummaryList></MatchSummaryList>
  </div>);
}
