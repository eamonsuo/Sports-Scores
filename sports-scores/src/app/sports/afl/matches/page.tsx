import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { AFLMatches } from "@/services/afl.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await AFLMatches();

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <FixtureRoundList
      data={pageData.fixtures}
      curRound={pageData.currentRound}
    />
  );
}
