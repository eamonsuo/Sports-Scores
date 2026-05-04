import LeagueLayout from "@/components/all-sports/LeagueLayout";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sport: string; league: string; season: string }>;
}) {
  const { sport, league, season } = await params;
  return (
    <LeagueLayout sport={sport as SPORT} league={league} season={season}>
      {children}
    </LeagueLayout>
  );
}
