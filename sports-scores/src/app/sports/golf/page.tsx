import GolfTourHeader from "@/components/golf/GolfTourHeader";

export const dynamic = "force-dynamic";

export default async function Page() {
  // let curTournament = await fetchPGACurrentTournament();

  // let tournDetails = curTournament.tournament;
  // let top5 = curTournament.leaderboard.players.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {/* <div className="mt-4 text-black dark:text-neutral-400">
        {tournDetails.displayDate}
      </div>

      <TournamentSummaryCard
        name={tournDetails.tournamentName}
        img={tournDetails.tournamentLogo[0]}
        status={`${tournDetails.roundDisplay} - ${tournDetails.roundStatusDisplay}`}
        top5Players={top5}
        url={`/sports/golf/pga/tournaments/${tournDetails.seasonYear}/${tournDetails.tournamentName.toLowerCase().replace(" ", "-")}/${tournDetails.id}`}
      /> */}
      <GolfTourHeader href="/sports/golf/pga/schedule" tourName="PGA Tour" />
      <GolfTourHeader
        href="https://www.livgolf.com/leaderboard"
        tourName="LIV Golf"
      />
      <GolfTourHeader
        href="https://www.google.com/search?igu=1&gws_rd=ssl&q=dp+world+tour"
        tourName="DP World Tour"
      />
      <GolfTourHeader
        href="https://pga.org.au/report/?tourn=auto&class=aus"
        tourName="PGA Tour of Australasia"
      />
    </div>
  );
}
