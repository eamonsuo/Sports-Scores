import { fetchPGACurrentTournament } from "@/api/golf.api";
import GolfTourHeader from "@/components/golf/GolfTourHeader";
import TournamentSummaryCard from "@/components/golf/TournamentSummaryCard";
import { Button } from "@/components/misc/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  let curTournament = await fetchPGACurrentTournament();

  let tournDetails = curTournament.tournament;
  let top5 = curTournament.leaderboard.players.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <Link href={`https://www.livgolf.com/leaderboard`}>
        <Button>View LIV Tour (Redirects)</Button>
      </Link>
      <Link
        href={`https://www.google.com/search?igu=1&gws_rd=ssl&q=dp+world+tour`}
      >
        <Button>View DP World Tour (Redirects)</Button>
      </Link>
      <GolfTourHeader href="/sports/golf/pga/schedule" tourName="PGA Tour" />
      <div className="mt-4 text-black dark:text-neutral-400">
        {tournDetails.displayDate}
      </div>

      <TournamentSummaryCard
        name={tournDetails.tournamentName}
        img={tournDetails.tournamentLogo[0]}
        status={`${tournDetails.roundDisplay} - ${tournDetails.roundStatusDisplay}`}
        top5Players={top5}
        url={`/sports/golf/tournaments/${tournDetails.seasonYear}/${tournDetails.tournamentName.toLowerCase().replace(" ", "-")}/${tournDetails.id}`}
      />
    </div>
  );
}
