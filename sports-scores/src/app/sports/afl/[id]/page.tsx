import {
  fetchAFLGame,
  fetchAFLGameEvents,
  fetchAFLGameQuarters,
} from "@/api/afl.api";

import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import { mapAflFixtureFields } from "@/lib/utils";
import AFLScoreBreakdown from "@/components/afl/AFLScoreBreakdown";
import AFLScoreChart from "@/components/afl/AFLScoreChart";
import AFLKeyPlayerStats from "@/components/afl/AFLKeyPlayerStats";

export default async function Page({ params }: { params: { id: number } }) {
  const game = await fetchAFLGame(params.id);
  const quarters = await fetchAFLGameQuarters(params.id);
  const events = await fetchAFLGameEvents(params.id);

  let matchSum = mapAflFixtureFields([game])[0];

  return (
    <div className="flex flex-col">
      <MatchDetailsHero data={matchSum} />
      <AFLScoreBreakdown
        quarterData={quarters}
        homeLogo={game.teams.home.logo}
        awayLogo={game.teams.away.logo}
      />
      <AFLScoreChart gameData={game} eventData={events} />
      <AFLKeyPlayerStats data={""} />
    </div>
  );
}
