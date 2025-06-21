import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

export default function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.AFL);

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/afl/matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "/sports/afl/ladder",
            label: "Ladder",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per month" />
    </div>
  );
}
