import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.MOTORSPORT);
  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle
        sport={SPORT.MOTORSPORT}
        leagues={MOTORSPORT_CATEGORIES}
      />
      {children}
      <APIStatus status={"N/A"} />
    </div>
  );
}
