import { fetchCricketMyTeams } from "@/api/cricket.api";
import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc/Placeholder";
import { mapCricketTeamMatches } from "@/lib/dataMapping";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rawTeamDetails = await fetchCricketMyTeams();

  if (rawTeamDetails === null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  const fixtures = mapCricketTeamMatches(rawTeamDetails);

  return <CricketFixtureList data={fixtures} />;
}
