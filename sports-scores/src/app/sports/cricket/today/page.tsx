import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { cricketMatchesByDate } from "@/services/cricket.service";
import { addDays } from "date-fns/addDays";

export const dynamic = "force-dynamic";

export default async function Page() {
  const curDate = new Date();
  const yesterday = await cricketMatchesByDate(addDays(curDate, -1));
  const today = await cricketMatchesByDate(curDate);

  if (yesterday === null && today === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <CricketFixtureList data={yesterday?.concat(today ?? []) ?? []} />;
}
