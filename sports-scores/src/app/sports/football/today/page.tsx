import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { footballCurrentMatches } from "@/services/football.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const curDate = new Date();
  const pageData = await footballCurrentMatches(curDate);

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
