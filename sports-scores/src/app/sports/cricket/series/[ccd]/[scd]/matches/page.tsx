import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { cricketSeriesDetails } from "@/services/cricket.service";

export default async function Page(props: {
  params: Promise<{ ccd: string; scd: string }>;
}) {
  const params = await props.params;

  let matches = await cricketSeriesDetails(params.ccd, params.scd);

  if (matches == null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <CricketFixtureList data={matches} />
    </div>
  );
}
