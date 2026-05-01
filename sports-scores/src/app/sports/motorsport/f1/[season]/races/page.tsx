import Placeholder from "@/components/misc-ui/Placeholder";
import RaceList from "@/components/motorsport/RaceList";
import { motorsportService } from "@/services/motorsport.service";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;
  const races = await motorsportService.matchesByLeagueSeason("f1", season);

  if (races === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <RaceList data={races.fixtures.flatMap((fixture) => fixture.matches)} />
  );
}
