import Placeholder from "@/components/misc-ui/Placeholder";
import RaceList from "@/components/motorsport/RaceList";
import { f1EventSchedule } from "@/services/motorsport.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;
  const races = await f1EventSchedule(Number(season));

  if (races === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <RaceList data={races.sessions} />;
}
