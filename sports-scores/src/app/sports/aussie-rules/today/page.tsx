import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { aussieRulesCurrentMatches } from "@/services/aussie-rules.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await aussieRulesCurrentMatches("TODAY");

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <>
      <span className="mt-4"></span>
      <FixtureRoundList
        data={pageData.fixtures}
        curRound={pageData.currentRound}
      />
    </>
  );
}
