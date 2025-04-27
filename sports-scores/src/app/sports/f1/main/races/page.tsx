import RaceList from "@/components/f1/RaceList";
import Placeholder from "@/components/misc/Placeholder";
import { f1EventSchedule } from "@/services/f1.service";
import { SessionSummary } from "@/types/f1";

export const dynamic = "force-dynamic";

export default async function Page() {
  const races = await f1EventSchedule(2025);

  if (races === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <RaceList data={races.sessions} />;
}

function compareF1Sessions(a: SessionSummary, b: SessionSummary) {
  let aDate = new Date(a.startDate);
  let bDate = new Date(b.startDate);

  if (aDate < bDate) {
    return -1;
  } else if (aDate > bDate) {
    return 1;
  }
  return 0;
}
