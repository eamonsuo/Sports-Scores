import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { TENNIS_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.TENNIS} leagues={TENNIS_LEAGUES} />

      {children}
      <APIStatus sport={SPORT.TENNIS} />
    </div>
  );
}
