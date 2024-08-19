import {
  fetchAFLGame,
  fetchAFLGameEvents,
  fetchAFLGameQuarters,
} from "@/api/afl.api";

import AFLKeyPlayerStats from "@/components/afl/AFLKeyPlayerStats";
import AFLScoreBreakdown from "@/components/afl/AFLScoreBreakdown";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import ScoreChart from "@/components/generic/ScoreChart";
import Placeholder from "@/components/misc/Placeholder";
import { MATCHSTATUSAFL, REVALIDATE } from "@/lib/constants";
import { mapAFLFixtureFields } from "@/lib/dataMapping";

export default async function Page({ params }: { params: { id: number } }) {
  const rawGame = await fetchAFLGame(params.id, REVALIDATE);
  const quarters = await fetchAFLGameQuarters(params.id, REVALIDATE);
  const events = await fetchAFLGameEvents(params.id, REVALIDATE);

  if (typeof rawGame === "string") {
    return <Placeholder>{rawGame}</Placeholder>;
  }

  let gameStarted =
    rawGame.status.short === MATCHSTATUSAFL.SHORT_NS ? false : true;
  let scores: { event: string; difference: number }[] = [];

  //  if (typeof quarters === "string" && gameStarted) {
  //   return <Placeholder>{quarters}</Placeholder>;
  // } else if (typeof events === "string" && gameStarted) {
  //   return <Placeholder>{events}</Placeholder>;
  // }

  if (typeof events !== "string") {
    let diff = 0;
    scores = events.events.flatMap((item) => {
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
    <div className="flex flex-col">
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
          <AFLKeyPlayerStats data={""} />
        </>
      ) : null}
    </div>
  );
}
