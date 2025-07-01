import ClientSportsPage from "@/components/generic/ClientSportsPage";
import TournamentLeaderboard from "@/components/golf/TournamentLeaderboard";
import Placeholder from "@/components/misc/Placeholder";
import { golfLIVTournamentLeaderboard } from "@/services/golf.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const leaderboard = await golfLIVTournamentLeaderboard(params.slug);

  if (!leaderboard) {
    return <Placeholder>No Data</Placeholder>;
  }

  const pageSettings = [
    {
      btnLabel: `Players`,
      component: (
        <div className="overflow-y-auto px-4">
          <TournamentLeaderboard
            players={leaderboard?.playerLeaderboard.playerPositions}
          />
        </div>
      ),
      state: "players",
    },
    {
      btnLabel: `Teams`,
      component: (
        <div className="overflow-y-auto px-4">
          <TournamentLeaderboard players={leaderboard?.teamLeaderboard} />
        </div>
      ),
      state: "teams",
    },
  ];

  return (
    <div className="overflow-y-auto">
      <ClientSportsPage
        apiStatus={<></>}
        options={pageSettings}
        defaultState="players"
      />
    </div>
  );
}
