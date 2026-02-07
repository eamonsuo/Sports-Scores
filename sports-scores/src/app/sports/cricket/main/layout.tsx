import APIStatus from "@/components/misc-ui/ApiStatus";
import NavButtonGroup from "@/components/misc-ui/NavButtonGroup";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.CRICKET);

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/cricket/main/myteams#current-date",
            label: "My Teams",
            page: "myteams",
          },
          {
            href: "/sports/cricket/main/matches#current-date",
            label: "All Matches",
            page: "matches",
          },
          {
            href: "/sports/cricket/main/seriesList",
            label: "Series",
            page: "series",
          },
        ]}
      />
      {children}
      <APIStatus status={quota?.percentUsed ?? "N/A"} reset="per month" />
    </div>
  );
}
