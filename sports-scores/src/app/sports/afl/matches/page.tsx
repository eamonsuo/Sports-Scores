import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { fetchAFLFixtures } from "@/endpoints/afl.api";
import { mapAFLFixtureFields } from "@/lib/dataMapping";
import { getCurrentWeek } from "@/lib/projUtils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const fixtures = await fetchAFLFixtures(2023);

  if (typeof fixtures === "string") {
    return <Placeholder>{fixtures}</Placeholder>;
  }

  const mappedFixtures = mapAFLFixtureFields(fixtures);

  let curRound = getCurrentWeek(mappedFixtures);

  return <FixtureRoundList data={mappedFixtures} curRound={curRound} />;
}
