import {
  fetchAFLGame,
  fetchAFLGameEvents,
  fetchAFLGameQuarters,
} from "@/api/afl.api";

import ScoreDetails from "@/components/match-details/ScoreDetails";
import ScoreChart from "@/components/match-details/ScoreChart";
import KeyPlayerStats from "@/components/match-details/KeyPlayerStats";

export default async function Page({ params }: { params: { id: number } }) {
  const game = await fetchAFLGame(params.id);
  const quarters = await fetchAFLGameQuarters(params.id);
  const events = await fetchAFLGameEvents(params.id);

  return (
    <div className="flex flex-col">
      <ScoreDetails gameData={game} quarterData={quarters} />
      <ScoreChart gameData={game} eventData={events} />
      <KeyPlayerStats data={""} />
    </div>
  );
}
