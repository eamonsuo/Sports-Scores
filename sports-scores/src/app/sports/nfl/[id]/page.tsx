import { fetchNFLGame, fetchNFLGameEvents } from "@/api/nfl.api";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import ScoreChart from "@/components/generic/ScoreChart";
import NFLScoreBreakdown from "@/components/nfl/NFLScoreBreakdown";
import { MATCHSTATUSNFL } from "@/lib/constants";
import { mapNFLFixtureFields } from "@/lib/dataMapping";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const game = await fetchNFLGame(params.id);
  const events = await fetchNFLGameEvents(params.id);

  //TODO: Fix error handling for rate limit
  if (game === null) {
    redirect("/misc/rateLimit");
  }

  let gameStarted =
    game.game.status.short === MATCHSTATUSNFL.SHORT_NS ? false : true;
  let scores = [0];

  if (gameStarted) {
    scores = events.map((item) => item.score.home - item.score.away);
  }

  return (
    <div className="flex flex-col">
      <MatchDetailsHero data={mapNFLFixtureFields([game])[0]} />
      {gameStarted ? (
        <>
          <NFLScoreBreakdown
            data={game}
            homeLogo={game.teams.home.logo}
            awayLogo={game.teams.away.logo}
          />
          <ScoreChart
            scoreDifference={scores}
            homeLogo={game.teams.home.logo}
            awayLogo={game.teams.away.logo}
          />
          {/* <NFLKeyPlayerStats data={""} /> */}
        </>
      ) : null}
    </div>
  );
}
