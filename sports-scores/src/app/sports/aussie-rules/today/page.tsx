import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { getClientDate } from "@/lib/serverUtils";
import { aussieRulesCurrentMatches } from "@/services/aussie-rules.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const curDate = await getClientDate();
  const pageData = await aussieRulesCurrentMatches(curDate);

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
