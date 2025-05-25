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
            href: "/sports/f1/main/races#current-date",
            label: "Races",
            page: "races",
          },
          {
            href: "/sports/f1/main/drivers",
            label: "Drivers",
            page: "drivers",
          },
          {
            href: "/sports/f1/main/teams",
            label: "Teams",
            page: "teams",
          },
        ]}
      />
      {children}
      <APIStatus status="0" />
    </div>
  );
}
