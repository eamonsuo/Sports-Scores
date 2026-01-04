import RankingsLeaderboard from "@/components/golf/RankingsLeaderboard";
import { golfFedExRankings } from "@/services/golf.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;

  var pageData = await golfFedExRankings(season);

  if (pageData === null) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <RankingsLeaderboard players={pageData.rankings} type="fedex" />
    </div>
  );
}
