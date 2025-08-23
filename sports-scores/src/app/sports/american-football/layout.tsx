import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { AMERICAN_FOOTBALL_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.AMERICAN_FOOTBALL);

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.AMERICAN_FOOTBALL}
        leagues={AMERICAN_FOOTBALL_LEAGUES}
      />

      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per month" />
    </div>
  );
}
