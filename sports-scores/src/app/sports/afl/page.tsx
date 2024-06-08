import MatchSummaryList from "@/components/MatchSummaryList"
import NavButtonGroup from "@/components/NavButtonGroup"

export default async function Page() {
  let buttonList: NavButtonGroupProps = [
    {label: "Matches", link: "/misc/coming"}, 
    {label: "Ladder", link: "/misc/coming"}];

  return (
  <div className="flex flex-col h-full">
      <NavButtonGroup buttons={buttonList}></NavButtonGroup>
      <MatchSummaryList></MatchSummaryList>
      <div className="m-2">API Counter: </div>
  </div>);
}
