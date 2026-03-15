import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { GOLF_TOURS } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.GOLF} leagues={GOLF_TOURS} />
      {children}
      <APIStatus sport={SPORT.GOLF} />
    </div>
  );
}
