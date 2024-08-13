import { fetchNFLGame, fetchNFLGameEvents } from "@/api/nfl.api";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import ScoreChart from "@/components/generic/ScoreChart";
import NFLScoreBreakdown from "@/components/nfl/NFLScoreBreakdown";
import { MATCHSTATUSNFL } from "@/lib/constants";
import { mapNFLFixtureFields } from "@/lib/dataMapping";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const rawGame = await fetchNFLGame(params.id);
  const events = await fetchNFLGameEvents(params.id);

  if (rawGame === null) {
    redirect("/misc/apiError");
  }

  let gameStarted =
    rawGame.game.status.short === MATCHSTATUSNFL.SHORT_NS ? false : true;
  let scores = [0];

  if (events !== null) {
    scores = events.map((item) => item.score.home - item.score.away);
  }

  let game = mapNFLFixtureFields([rawGame])[0];

  return (
    <div className="flex flex-col">
      <MatchDetailsHero
        homeInfo={game.homeDetails}
        awayInfo={game.awayDetails}
        status={game.status}
      />
      {gameStarted ? (
        <>
          <NFLScoreBreakdown
            data={rawGame}
            homeLogo={rawGame.teams.home.logo}
            awayLogo={rawGame.teams.away.logo}
          />
          <ScoreChart
            scoreDifference={scores}
            homeLogo={rawGame.teams.home.logo}
            awayLogo={rawGame.teams.away.logo}
          />
          {/* <NFLKeyPlayerStats data={""} /> */}
        </>
      ) : null}
    </div>
  );
}
