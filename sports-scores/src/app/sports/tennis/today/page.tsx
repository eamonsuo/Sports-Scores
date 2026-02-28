import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { TennisMatchesByDate } from "@/services/tennis.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const curDate = new Date();
  const pageData = await TennisMatchesByDate(curDate);
  // const pageData = await TESTTennisMatchesByDate(curDate);

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    // <GenericRoundList
    //   data={pageData.fixtures.map((round) => ({
    //     roundLabel: round.tourLabel,
    //     component: (
    //       <FixtureRoundList
    //         data={round.tournament}
    //         curRound={round.tournament[0].roundLabel}
    //       />
    //     ),
    //   }))}
    //   curRound={"ATP"}
    // ></GenericRoundList>
    <FixtureRoundList
      data={pageData.fixtures}
      curRound={pageData.currentRound}
    />
  );
}
