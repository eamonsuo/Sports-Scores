import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.GOLF);
  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/golf",
            label: "Current Tournaments",
            page: "home",
          },
        ]}
      />
      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per month" />
    </div>
  );
}
