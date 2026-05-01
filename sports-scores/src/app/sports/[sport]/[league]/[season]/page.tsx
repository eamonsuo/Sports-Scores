import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { getSportConfigurations } from "@/lib/projUtils";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ league: string; season: string; sport: string }>;
}) {
  const { league, season, sport } = await props.params;
  const config = SPORT_ROUTE_CONFIG[sport as SPORT];

  const { leagueConfig } = getSportConfigurations(
    config.leagues,
    league,
    season,
  );

  if (season === "wiki" && leagueConfig?.externalURL) {
    return <iframe src={leagueConfig.externalURL} className="h-full" />;
  } else if (season === "external" && leagueConfig?.externalURL) {
    redirect(leagueConfig.externalURL);
  }

  const pageData = await config.service.matchesByLeagueSeason(league, season);

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
