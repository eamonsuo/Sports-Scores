import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc/Placeholder";
import { cricketMyTeamsMatches } from "@/services/cricket.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const matches = await cricketMyTeamsMatches();

  if (matches === null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  return <CricketFixtureList data={matches} />;
}
