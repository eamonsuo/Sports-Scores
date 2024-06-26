import {
  fetchAFLGame,
  fetchAFLGameEvents,
  fetchAFLGameQuarters,
} from "@/api/afl.api";

import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import { mapAflFixtureFields } from "@/lib/utils";
import AFLScoreBreakdown from "@/components/afl/AFLScoreBreakdown";
import ScoreChart from "@/components/generic/ScoreChart";
import AFLKeyPlayerStats from "@/components/afl/AFLKeyPlayerStats";

export default async function Page({ params }: { params: { id: number } }) {
  const game = await fetchAFLGame(params.id);
  const quarters = await fetchAFLGameQuarters(params.id);
  const events = await fetchAFLGameEvents(params.id);

  let difference = 0;
  let scores = events.events.flatMap((item) => {
    if (item.team.id == game.teams.home.id) {
      item.type === "behind" ? (difference += 1) : (difference += 6);
    } else {
      item.type === "behind" ? (difference -= 1) : (difference -= 6);
    }
    return difference;
  });

  return (
    <div className="flex flex-col">
      <MatchDetailsHero data={mapAflFixtureFields([game])[0]} />
      <AFLScoreBreakdown
        quarterData={quarters}
        homeLogo={game.teams.home.logo}
        awayLogo={game.teams.away.logo}
      />
      <ScoreChart
        scoreDifference={scores}
        homeLogo={game.teams.home.logo}
        awayLogo={game.teams.away.logo}
      />
      <AFLKeyPlayerStats data={""} />
    </div>
  );
}
