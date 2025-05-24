import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { CRICKET_REQUEST_USED } from "@/endpoints/cricket.api";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            href: "/sports/cricket/main/matches/today",
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
      <APIStatus status={`${CRICKET_REQUEST_USED}% used`} />
    </div>
  );
}
