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
            href: "matches#current-date",
            label: "Matches",
            page: "matches",
          },
          {
            href: "ladder",
            label: "Standings/Result",
            page: "ladder",
          },
          {
            href: "/sports/cricket/main/seriesList",
            label: "All Series",
            page: "seriesList",
          },
        ]}
      />
      {children}
      <APIStatus status={`${CRICKET_REQUEST_USED}% used`} />
    </div>
  );
}
