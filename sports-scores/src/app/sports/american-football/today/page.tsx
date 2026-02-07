import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import NoData from "@/components/misc-ui/NoData";
import Placeholder from "@/components/misc-ui/Placeholder";
import { americanFootballCurrentMatches } from "@/services/american-football.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await americanFootballCurrentMatches("TODAY");

  if (pageData === null) {
    return <NoData href={"https://www.google.com/search?q=nfl"} />;
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
