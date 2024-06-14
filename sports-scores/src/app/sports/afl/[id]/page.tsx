import {
  fetchAFLGame,
  fetchAFLGameEvents,
  fetchAFLGameQuarters,
} from "@/api/afl.api";

export default async function Page({ params }: { params: { id: number } }) {
  const game = await fetchAFLGame(params.id);
  const quarters = await fetchAFLGameQuarters(params.id);
  const events = await fetchAFLGameEvents(params.id);

  return (
    <div>
      Match Details Quarter #:
      {quarters[0].teams.home.points}
    </div>
  );
}
