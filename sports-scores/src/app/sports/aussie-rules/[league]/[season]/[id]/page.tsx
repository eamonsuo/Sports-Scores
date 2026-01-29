import MatchDetailsHero from "@/components/all-sports/MatchDetailsHero";
import ScoreChart from "@/components/all-sports/ScoreChart";
import AussieRulesScoreBreakdown from "@/components/aussie-rules/AussieRulesScoreBreakdown";
import Placeholder from "@/components/misc-ui/Placeholder";
import { aussieRulesMatchDetails } from "@/services/aussie-rules.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string; id: string }>;
}) {
  const { league, season, id } = await props.params;
  const pageData = await aussieRulesMatchDetails(Number(id));

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
      <AussieRulesScoreBreakdown
        quarterData={pageData.matchDetails.scoreBreakdown}
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
