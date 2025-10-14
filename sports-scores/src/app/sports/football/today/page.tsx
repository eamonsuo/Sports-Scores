import Placeholder from "@/components/misc/Placeholder";

export const dynamic = "force-dynamic";

export default async function Page() {
  // const pageData = await rugbyLeagueCurrentMatches("TODAY");

  // if (pageData === null) {
  //   return <Placeholder>NO DATA</Placeholder>;
  // }

  return (
    <Placeholder>Not implemented</Placeholder>
    // <>
    //   <span className="mt-4"></span>
    //   <FixtureRoundList
    //     data={pageData.fixtures}
    //     curRound={pageData.currentRound}
    //   />
    // </>
  );
}
