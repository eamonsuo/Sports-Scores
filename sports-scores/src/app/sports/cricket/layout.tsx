import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle";
import APIStatus from "@/components/misc-ui/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { CRICKET_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.CRICKET);

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.CRICKET} leagues={CRICKET_LEAGUES} />

      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per month" />
    </div>
  );
}
