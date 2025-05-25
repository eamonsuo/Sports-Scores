import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.NFL);

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/nfl/main/matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "/sports/nfl/main/ladder",
            label: "Standings",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per day" />
    </div>
  );
}
