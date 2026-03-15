import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { ICE_HOCKEY_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.ICE_HOCKEY}
        leagues={ICE_HOCKEY_LEAGUES}
      />

      {children}
      <APIStatus sport={SPORT.ICE_HOCKEY} />
    </div>
  );
}
