import { fetchNFLGame, fetchNFLGameEvents } from "@/api/nfl.api";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import ScoreChart from "@/components/generic/ScoreChart";
import Placeholder from "@/components/misc/Placeholder";
import NFLScoreBreakdown from "@/components/nfl/NFLScoreBreakdown";
import { MATCHSTATUSNFL } from "@/lib/constants";
import { mapNFLFixtureFields } from "@/lib/dataMapping";

export default async function Page({ params }: { params: { id: number } }) {
  const rawGame = await fetchNFLGame(params.id);
  const events = await fetchNFLGameEvents(params.id);

  if (typeof rawGame === "string") {
    return <Placeholder>{rawGame}</Placeholder>;
  }

  let gameStarted =
    rawGame.game.status.short === MATCHSTATUSNFL.SHORT_NS ? false : true;
  let scores: { event: string; difference: number }[] = [];

  if (typeof events !== "string") {
    scores = events.map((item) => {
      return {
        event: item.type,
        difference: item.score.home - item.score.away,
      };
    });
  }

  let game = mapNFLFixtureFields([rawGame])[0];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
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
