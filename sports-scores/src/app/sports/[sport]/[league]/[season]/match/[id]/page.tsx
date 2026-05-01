import MatchDetailsHero from "@/components/all-sports/MatchDetailsHero";
import ScoreBreakdown from "@/components/all-sports/ScoreBreakdown";
import ScoreChart from "@/components/all-sports/ScoreChart";
import Placeholder from "@/components/misc-ui/Placeholder";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";

export default async function Page(props: {
  params: Promise<{
    league: string;
    season: string;
    id: string;
    sport: string;
  }>;
}) {
  const { league, season, id, sport } = await props.params;
  const config = SPORT_ROUTE_CONFIG[sport as SPORT];

  const pageData = await config.service.matchDetails(id);

  if (pageData === null || pageData.matchDetails === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto pb-4">
      <MatchDetailsHero
        homeInfo={pageData.matchDetails.homeTeam}
        awayInfo={pageData.matchDetails.awayTeam}
        status={pageData.matchDetails.status}
      />
      <ScoreBreakdown
        scoreData={pageData.scoreBreakdown}
        homeLogo={pageData.matchDetails.homeTeam.img}
        awayLogo={pageData.matchDetails.awayTeam.img}
      />
      {pageData.scoreEvents && (
        <ScoreChart
          scoreDifference={pageData.scoreEvents}
          homeLogo={pageData.matchDetails.homeTeam.img}
          awayLogo={pageData.matchDetails.awayTeam.img}
        />
      )}
    </div>
  );
}
