import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { NRLMatches } from "@/services/nrl.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await NRLMatches();

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
