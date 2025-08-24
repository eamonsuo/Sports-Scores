import Placeholder from "@/components/misc/Placeholder";
import RaceList from "@/components/motorsport/RaceList";
import { f1EventSchedule } from "@/services/motorsport.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const races = await f1EventSchedule(2025);

  if (races === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <RaceList data={races.sessions} />;
}
