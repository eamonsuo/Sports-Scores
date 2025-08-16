import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { rugbyLeagueMatches } from "@/services/rugby-league.service";

// export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ league: string; year: string }>;
}) {
  const { league, year } = await props.params;
  const pageData = await rugbyLeagueMatches(Number(league), Number(year));

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
