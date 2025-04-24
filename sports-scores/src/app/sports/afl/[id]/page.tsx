import AFLScoreBreakdown from "@/components/afl/AFLScoreBreakdown";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import ScoreChart from "@/components/generic/ScoreChart";
import Placeholder from "@/components/misc/Placeholder";
import { AFLMatchDetails } from "@/services/afl.service";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const pageData = await AFLMatchDetails(params.id);

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
      <AFLScoreBreakdown
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
