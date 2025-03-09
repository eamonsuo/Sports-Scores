import { fetchCricketCurrentMatches } from "@/api/cricket.api";
import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc/Placeholder";
import { mapCricketCurrentMatches } from "@/lib/dataMapping";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rawMatches = await fetchCricketCurrentMatches();

  if (rawMatches === null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  const fixtures = mapCricketCurrentMatches(rawMatches);

  return <CricketFixtureList data={fixtures} />;
}
