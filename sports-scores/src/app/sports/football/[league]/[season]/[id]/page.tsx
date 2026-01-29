import MatchDetailsHero from "@/components/all-sports/MatchDetailsHero";
import ScoreChart from "@/components/all-sports/ScoreChart";
import FootballScoreBreakdown from "@/components/football/FootballScoreBreakdown";
import Placeholder from "@/components/misc-ui/Placeholder";
import { footballMatchDetails } from "@/services/football.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string; id: string }>;
}) {
  const { league, season, id } = await props.params;
  const pageData = await footballMatchDetails(Number(id));

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
      <FootballScoreBreakdown
        scoreData={pageData.matchDetails.scoreBreakdown}
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
      <iframe
        className="mx-4 min-h-[350px]"
        src={`https://widgets.sofascore.com/embed/attackMomentum?id=${id}&widgetTheme=dark`}
      ></iframe>
      <iframe
        src={`https://widgets.sofascore.com/embed/lineups?id=${id}&widgetTheme=dark`}
        className="mx-4 min-h-[800px]"
      />
    </div>
  );
}
