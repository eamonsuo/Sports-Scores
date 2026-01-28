import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { TENNIS_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.TENNIS);

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.TENNIS} leagues={TENNIS_LEAGUES} />

      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per day" />
    </div>
  );
}
