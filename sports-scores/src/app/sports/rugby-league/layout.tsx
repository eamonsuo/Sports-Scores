import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { RUGBY_LEAGUE_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.RUGBY_LEAGUE}
        leagues={RUGBY_LEAGUE_LEAGUES}
      />

      {children}
      <APIStatus sport={SPORT.RUGBY_LEAGUE} />
    </div>
  );
}
