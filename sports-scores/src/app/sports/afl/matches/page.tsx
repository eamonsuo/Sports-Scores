import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { getCurrentWeek } from "@/lib/projUtils";
import { AFLMatches } from "@/services/afl.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await AFLMatches();

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  let curRound = getCurrentWeek(pageData.fixtures);

  return <FixtureRoundList data={pageData.fixtures} curRound={curRound} />;
}
