import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { GOLF_TOURS } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.GOLF);
  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.GOLF} leagues={GOLF_TOURS} />
      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per month" />
    </div>
  );
}
