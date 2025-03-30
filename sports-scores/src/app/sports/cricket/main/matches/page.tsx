import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc/Placeholder";
import { cricketCurrentMatches } from "@/services/cricket.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const matches = await cricketCurrentMatches();

  if (matches === null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  //Sort by start date??
  return <CricketFixtureList data={matches} />;
}
