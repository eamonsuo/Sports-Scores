import {
  fetchAFLGame,
  fetchAFLGameEvents,
  fetchAFLGameQuarters,
} from "@/api/afl.api";

import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import { mapAFLFixtureFields } from "@/lib/dataMapping";
import AFLScoreBreakdown from "@/components/afl/AFLScoreBreakdown";
import ScoreChart from "@/components/generic/ScoreChart";
import AFLKeyPlayerStats from "@/components/afl/AFLKeyPlayerStats";
import { MATCHSTATUSAFL } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const rawGame = await fetchAFLGame(params.id);
  const quarters = await fetchAFLGameQuarters(params.id);
  const events = await fetchAFLGameEvents(params.id);

  //TODO: Fix error handling for rate limit
  if (rawGame === null) {
    redirect("/misc/rateLimit");
  }

  let gameStarted =
    rawGame.status.short === MATCHSTATUSAFL.SHORT_NS ? false : true;
  let scores = [0];

  if (gameStarted) {
    let difference = 0;
    scores = events.events.flatMap((item) => {
      if (item.team.id == rawGame.teams.home.id) {
        item.type === "behind" ? (difference += 1) : (difference += 6);
      } else {
        item.type === "behind" ? (difference -= 1) : (difference -= 6);
      }
      return difference;
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
      {gameStarted ? (
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
