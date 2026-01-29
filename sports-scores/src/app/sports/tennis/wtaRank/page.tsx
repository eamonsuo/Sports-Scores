import Placeholder from "@/components/misc-ui/Placeholder";
import RankingsLeaderboard from "@/components/tennis/RankingsLeaderboard";
import { TennisWorldRankings } from "@/services/tennis.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await TennisWorldRankings("wta");

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <RankingsLeaderboard players={pageData.players} />
    </div>
  );
}
