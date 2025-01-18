import { fetchNFLFixtures, fetchNFLStandings } from "@/api/nfl.api";
import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { CURRENTSEASON } from "@/lib/constants";
import { mapNFLFixtureFields } from "@/lib/dataMapping";
import { getCurrentWeek } from "@/lib/projUtils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const fixtures = await fetchNFLFixtures(CURRENTSEASON.NFL);
  const standings = await fetchNFLStandings(CURRENTSEASON.NFL);

  if (typeof fixtures === "string") {
    return <Placeholder>{fixtures}</Placeholder>;
  }
  if (typeof standings === "string") {
    return <Placeholder>{standings}</Placeholder>;
  }

  const mappedFixtures = mapNFLFixtureFields(fixtures, standings);
  let curRound = getCurrentWeek(mappedFixtures);

  return <FixtureRoundList data={mappedFixtures} curRound={curRound} />;
}
