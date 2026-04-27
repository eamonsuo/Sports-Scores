import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  const config = SPORT_ROUTE_CONFIG[sport as SPORT];

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={sport as SPORT} leagues={config.leagues} />

      {children}
      <APIStatus sport={sport as SPORT} />
    </div>
  );
}
