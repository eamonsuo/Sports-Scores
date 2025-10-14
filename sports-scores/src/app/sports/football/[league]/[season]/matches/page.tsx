import Placeholder from "@/components/misc/Placeholder";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  // const pageData = await footballLeagueMatches(league, season);

  // if (pageData === null) {
  //   return <Placeholder>NO DATA</Placeholder>;
  // }

  return (
    <Placeholder>Not implemented</Placeholder>
    // <FixtureRoundList
    //   data={pageData.fixtures}
    //   curRound={pageData.currentRound}
    // />
  );
}
