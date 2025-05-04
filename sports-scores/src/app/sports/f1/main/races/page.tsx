import RaceList from "@/components/f1/RaceList";
import Placeholder from "@/components/misc/Placeholder";
import { f1EventSchedule } from "@/services/f1.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const races = await f1EventSchedule(2025);

  if (races === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <RaceList data={races.sessions} />;
}
