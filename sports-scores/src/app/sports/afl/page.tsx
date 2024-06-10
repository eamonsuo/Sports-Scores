import MatchSummaryList from "@/components/MatchSummaryList"
import NavButtonGroup from "@/components/NavButtonGroup"
import { SPORT } from "@/js/constants";
import { fetchAflData } from "@/js/externalAPI";

export default async function Page() {
  let buttonList: NavButtonGroupProps = [
    {label: "Matches", link: "/misc/coming"}, 
    {label: "Ladder", link: "/misc/coming"}];

    const res = await fetchAflData("status");

  return (
  <div className="flex flex-col h-full">
      <NavButtonGroup buttons={buttonList}></NavButtonGroup>
      <MatchSummaryList sport={SPORT.AFL}></MatchSummaryList>
      <div className="m-2">API Counter: {res.response.requests.current} out of {res.response.requests.limit_day}</div>
  </div>);
}
