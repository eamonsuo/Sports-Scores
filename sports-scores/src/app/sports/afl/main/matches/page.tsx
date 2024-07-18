import { fetchAFLFixtures } from "@/api/afl.api";
import FixtureRoundList from "@/components/generic/FixtureRoundList";
import { mapAFLFixtureFields } from "@/lib/dataMapping";
import { getCurrentWeek } from "@/lib/utils";

export default async function Page() {
  const fixtures = await fetchAFLFixtures(2024);
  const mappedFixtures = mapAFLFixtureFields(fixtures);
  let curRound = getCurrentWeek(mappedFixtures);

  return <FixtureRoundList data={mappedFixtures} curRound={curRound} />;
}
