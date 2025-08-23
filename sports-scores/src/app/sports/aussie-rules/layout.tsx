import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { AUSSIE_RULES_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.AUSSIE_RULES);

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.AUSSIE_RULES}
        leagues={AUSSIE_RULES_LEAGUES}
      />

      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per month" />
    </div>
  );
}
