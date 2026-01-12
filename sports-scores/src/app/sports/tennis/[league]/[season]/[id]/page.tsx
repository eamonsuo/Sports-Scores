import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import Placeholder from "@/components/misc/Placeholder";
import TennisScoreBreakdown from "@/components/tennis/TennisScoreBreakdown";
import { TennisMatchDetails } from "@/services/tennis.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string; id: string }>;
}) {
  const { league, season, id } = await props.params;
  const pageData = await TennisMatchDetails(Number(id));

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
      <TennisScoreBreakdown
        scoreData={pageData.matchDetails.scoreBreakdown}
        homeLogo={pageData.matchDetails.homeTeam.img}
        awayLogo={pageData.matchDetails.awayTeam.img}
      />
      {/* {pageData.scoreEvents && (
        <ScoreChart
          scoreDifference={pageData.scoreEvents}
          homeLogo={pageData.matchDetails.homeTeam.img}
          awayLogo={pageData.matchDetails.awayTeam.img}
        />
      )} */}
    </div>
  );
}
