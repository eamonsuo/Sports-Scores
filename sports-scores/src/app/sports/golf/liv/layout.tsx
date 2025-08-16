import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex h-full flex-col">
        <NavButtonGroup
          buttons={[
            {
              href: "/sports/golf/liv/schedule#current-date",
              label: "Schedule",
              page: "schedule",
            },
            {
              // href: "/sports/golf/liv/standings/team",
              href: "https://www.livgolf.com/standings",
              label: "Player Stnd",
              page: "team",
            },
            {
              // href: "/sports/golf/liv/standings/player",
              href: "http://www.livgolf.com/standings",
              label: "Team Stnd",
              page: "player",
            },
          ]}
        />
        {children}
      </div>
    </div>
  );
}
