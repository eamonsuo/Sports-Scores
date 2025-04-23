import {
  fetchAFLGame,
  fetchAFLGameEvents,
  fetchAFLGameQuarters,
} from "@/endpoints/afl.api";

import AFLScoreBreakdown from "@/components/afl/AFLScoreBreakdown";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import ScoreChart from "@/components/generic/ScoreChart";
import Placeholder from "@/components/misc/Placeholder";
import { MATCHSTATUSAFL } from "@/lib/constants";
import { mapAFLFixtureFields } from "@/lib/dataMapping";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const rawGame = await fetchAFLGame(params.id);
  const quarters = await fetchAFLGameQuarters(params.id);
  const events = await fetchAFLGameEvents(params.id);

  if (typeof rawGame === "string") {
    return <Placeholder>{rawGame}</Placeholder>;
  }

  let gameStarted =
    rawGame.status.short === MATCHSTATUSAFL.SHORT_NS ? false : true;
  let scores: { event: string; difference: number }[] = [];

  if (typeof events !== "string") {
    let diff = 0;
    scores = events.events.flatMap((item: any) => {
      if (item.team.id == rawGame.teams.home.id) {
        item.type === "behind" ? (diff += 1) : (diff += 6);
      } else {
        item.type === "behind" ? (diff -= 1) : (diff -= 6);
      }
      return { event: item.type, difference: diff };
    });
  }

  let game = mapAFLFixtureFields([rawGame])[0];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto pb-4">
      <MatchDetailsHero
        homeInfo={game.homeDetails}
        awayInfo={game.awayDetails}
        status={game.status}
      />
      {gameStarted && typeof quarters !== "string" ? (
        <>
          <AFLScoreBreakdown
            quarterData={quarters}
            homeLogo={rawGame.teams.home.logo}
            awayLogo={rawGame.teams.away.logo}
          />
          <ScoreChart
            scoreDifference={scores}
            homeLogo={rawGame.teams.home.logo}
            awayLogo={rawGame.teams.away.logo}
          />
          {/* <AFLKeyPlayerStats data={""} /> */}
        </>
      ) : null}
    </div>
  );
}
