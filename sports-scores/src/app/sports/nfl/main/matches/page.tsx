import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { NFLMatches } from "@/services/nfl.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await NFLMatches();

  if (pageData === null || pageData.fixtures.length === 0) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <FixtureRoundList
      data={pageData.fixtures}
      curRound={pageData.currentRound}
    />
  );
}
