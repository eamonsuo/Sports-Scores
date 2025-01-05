import { fetchPGACurrentTournament } from "@/api/golf.api";
import GolfTourHeader from "@/components/golf/GolfTourHeader";

export default async function Page() {
  let curTournament = await fetchPGACurrentTournament();

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <GolfTourHeader href="/sports/golf/pga/schedule" tourName="PGA Tour" />
    </div>
  );
}
