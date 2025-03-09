import { CRICKET_REQUEST_USED } from "@/api/cricket.api";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";

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
            href: "myteams#current-date",
            label: "My Teams",
            page: "myteams",
          },
          {
            href: "matches#current-date",
            label: "All Matches",
            page: "matches",
          },
          {
            href: "seriesList",
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
