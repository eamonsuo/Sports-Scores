import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.MOTORSPORT}
        leagues={MOTORSPORT_CATEGORIES}
      />
      {children}
      <APIStatus sport={SPORT.MOTORSPORT} />
    </div>
  );
}
