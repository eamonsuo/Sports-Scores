import { fetchAFLFixtures } from "@/api/afl.api";
import FixtureRoundList from "@/components/generic/FixtureRoundList";
import { mapAFLFixtureFields } from "@/lib/dataMapping";
import { getCurrentWeek } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const fixtures = await fetchAFLFixtures(2024);

  if (fixtures === null) {
    redirect("/misc/apiError");
  }

  const mappedFixtures = mapAFLFixtureFields(fixtures);

  let curRound = getCurrentWeek(mappedFixtures);

  return <FixtureRoundList data={mappedFixtures} curRound={curRound} />;
}
