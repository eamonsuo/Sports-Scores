import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { RUGBY_LEAGUE_LEAGUES } from "@/lib/constants";
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
        sport={SPORT.RUGBY_LEAGUE}
        leagues={RUGBY_LEAGUE_LEAGUES}
      />
      <NavButtonGroup
        buttons={[
          {
            href: "./matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "./ladder",
            label: "Ladder",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per day" />
    </div>
  );
}
