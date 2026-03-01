import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { netballMatchesByDate } from "@/services/netball.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await netballMatchesByDate(new Date());

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
