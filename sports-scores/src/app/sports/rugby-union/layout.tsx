import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { RUGBY_UNION_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.RUGBY_LEAGUE);

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.RUGBY_UNION}
        leagues={RUGBY_UNION_LEAGUES}
      />

      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per day" />
    </div>
  );
}
