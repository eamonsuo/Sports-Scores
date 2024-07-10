import { fetchNFLFixtures } from "@/api/nfl.api";
import FixtureRoundList from "@/components/generic/FixtureRoundList";
import { mapNFLFixtureFields } from "@/lib/dataMapping";
import { getCurrentWeek } from "@/lib/utils";

export default async function Page() {
  const fixtures = await fetchNFLFixtures(2024);
  const mappedFixtures = mapNFLFixtureFields(fixtures);
  let curRound = getCurrentWeek(mappedFixtures);

  return <FixtureRoundList data={mappedFixtures} curRound={curRound} />;
}
