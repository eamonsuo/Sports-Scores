import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

export const GOLF_TOURS = [
  {
    name: "PGA Tour",
    slug: "pga",
    seasons: [{ name: "2025", slug: "" }],
  },
  {
    name: "LIV Golf",
    slug: "liv",
    seasons: [{ name: "2025", slug: "" }],
  },
  {
    name: "LPGA Tour",
    slug: "lpga",
    seasons: [{ name: "2025", slug: "" }],
  },
  {
    name: "DP World Tour",
    slug: "dpworld",
    seasons: [{ name: "2025", slug: "" }],
  },
  {
    name: "PGA Tour Australasia",
    slug: "australasia",
    seasons: [{ name: "2025", slug: "" }],
  },
  {
    name: "OWGR",
    slug: "owgr",
    seasons: [{ name: "Current", slug: "" }],
  },
];

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
