import { fetchPGATournamentLeaderboard } from "@/api/golf.api";
import TournamentLeaderboard from "@/components/golf/TournamentLeaderboard";

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  let url =
    "https://www.pgatour.com/tournaments/" +
    params.slug.join("/") +
    "/leaderboard";
  let scrape = await fetchPGATournamentLeaderboard(url);

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <TournamentLeaderboard players={scrape.leaderboard.players} />
    </div>
  );
}
