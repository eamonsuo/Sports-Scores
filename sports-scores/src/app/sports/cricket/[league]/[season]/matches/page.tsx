import FixtureList from "@/components/all-sports/FixtureList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { cricketSeriesDetails } from "@/services/cricket.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;

  let matches = await cricketSeriesDetails(league, season);

  if (matches == null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <FixtureList data={matches} />
    </div>
  );
}
