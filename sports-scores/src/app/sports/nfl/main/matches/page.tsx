import { fetchNFLFixtures } from "@/api/nfl.api";
import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { mapNFLFixtureFields } from "@/lib/dataMapping";
import { getCurrentWeek } from "@/lib/projUtils";

export default async function Page() {
  const fixtures = await fetchNFLFixtures(2024);

  if (typeof fixtures === "string") {
    return <Placeholder>{fixtures}</Placeholder>;
  }

  const mappedFixtures = mapNFLFixtureFields(fixtures);
  let curRound = getCurrentWeek(mappedFixtures);

  return <FixtureRoundList data={mappedFixtures} curRound={curRound} />;
}
