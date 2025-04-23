import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc/Placeholder";
import { fetchCricketSeriesMatches } from "@/endpoints/cricket.api";
import { mapCricketSeriesMatches } from "@/lib/dataMapping";

export default async function Page(props: {
  params: Promise<{ ccd: string; scd: string }>;
}) {
  const params = await props.params;

  let rawMatches = await fetchCricketSeriesMatches(params.ccd, params.scd);

  if (rawMatches == undefined || rawMatches.Stages == undefined) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  let fixtures = mapCricketSeriesMatches(rawMatches);

  return <CricketFixtureList data={fixtures} />;
}
