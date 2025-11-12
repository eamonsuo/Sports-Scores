import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { baseballCurrentMatches } from "@/services/baseball.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const curDate = new Date();
  const pageData = await baseballCurrentMatches(curDate);

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
