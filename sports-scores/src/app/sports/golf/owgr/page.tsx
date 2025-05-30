import GolfTourHeader from "@/components/golf/GolfTourHeader";
import RankingsLeaderboard from "@/components/golf/RankingsLeaderboard";
import { golfOWGRankings } from "@/services/golf.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  var pageData = await golfOWGRankings();

  if (pageData === null) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <GolfTourHeader
        href="/sports/golf/owgr"
        tourName="Official World Golf Rankings"
      />
      <div className="mt-4" />
      <RankingsLeaderboard players={pageData.rankings} type="owgr" />
    </div>
  );
}
