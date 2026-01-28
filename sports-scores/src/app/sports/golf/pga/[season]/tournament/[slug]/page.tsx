import TournamentLeaderboard from "@/components/golf/TournamentLeaderboard";
import Placeholder from "@/components/misc-ui/Placeholder";
import { golfPGATournamentLeaderboard } from "@/services/golf.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ season: string; slug: string }>;
}) {
  const { season, slug } = await props.params;
  const leaderboard = await golfPGATournamentLeaderboard(slug, season);

  if (!leaderboard) {
    return <Placeholder>No Data</Placeholder>;
  }
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <TournamentLeaderboard players={leaderboard?.playerPositions} />
    </div>
  );
}
