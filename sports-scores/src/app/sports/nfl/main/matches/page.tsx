import { fetchNFLFixtures } from "@/api/nfl.api";
import FixtureRoundList from "@/components/generic/FixtureRoundList";
import { mapNFLFixtureFields } from "@/lib/dataMapping";
import { getCurrentWeek } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const fixtures = await fetchNFLFixtures(2024);

  if (fixtures === null) {
    redirect("/misc/apiError");
  }

  const mappedFixtures = mapNFLFixtureFields(fixtures);
  let curRound = getCurrentWeek(mappedFixtures);

  return <FixtureRoundList data={mappedFixtures} curRound={curRound} />;
}
