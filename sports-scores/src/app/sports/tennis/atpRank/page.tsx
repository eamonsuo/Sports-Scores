import Placeholder from "@/components/misc-ui/Placeholder";
import RankingsLeaderboard from "@/components/tennis/RankingsLeaderboard";
import { tennisService } from "@/services/tennis.service";
import { RankingList } from "@/types/tennis";

export default async function Page() {
  const pageData = await tennisService.TennisWorldRankings(RankingList.ATP);

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <RankingsLeaderboard players={pageData.players} />
    </div>
  );
}
