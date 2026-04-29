import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";

export default async function Page(props: {
  params: Promise<{ league: string; season: string; sport: string }>;
}) {
  const { league, season, sport } = await props.params;
  const config = SPORT_ROUTE_CONFIG[sport as SPORT];

  const pageData = await config.service.matchesByLeagueSeason(
    Number(league),
    Number(season),
  );

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
