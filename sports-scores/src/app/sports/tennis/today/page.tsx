import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { TennisMatchesByDate as tennisMatchesByDate } from "@/services/tennis.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const curDate = new Date();
  const pageData = await tennisMatchesByDate(curDate);

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <FixtureRoundList
      data={pageData.fixtures}
      curRound={pageData.currentRound}
      cardVariant="tennis"
    />
  );
}
