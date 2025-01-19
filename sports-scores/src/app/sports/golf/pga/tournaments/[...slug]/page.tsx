import Placeholder from "@/components/misc/Placeholder";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  let url =
    "https://www.pgatour.com/tournaments/" +
    params.slug.join("/") +
    "/leaderboard";
  // let scrape = await fetchPGATournamentLeaderboard(url);

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <Placeholder>page waiting</Placeholder>
      {/* <TournamentLeaderboard players={scrape.leaderboard.players} /> */}
    </div>
  );
}
