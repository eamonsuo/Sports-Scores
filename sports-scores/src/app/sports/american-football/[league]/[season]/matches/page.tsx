import FixtureRoundList from "@/components/generic/FixtureRoundList";
import Placeholder from "@/components/misc/Placeholder";
import { americanFootballMatches } from "@/services/american-football.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;

  const pageData = await americanFootballMatches(
    Number(league),
    Number(season),
  );

  if (pageData === null || pageData.fixtures.length === 0) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <FixtureRoundList
      data={pageData.fixtures}
      curRound={pageData.currentRound}
    />
  );
}
