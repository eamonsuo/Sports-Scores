import GolfTourHeader from "@/components/golf/GolfTourHeader";
import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex h-full flex-col">
        <div className="px-4">
          {" "}
          <GolfTourHeader
            href="/sports/golf/liv/schedule"
            tourName="LIV Tour"
          />
        </div>
        <NavButtonGroup
          buttons={[
            {
              href: "/sports/golf/liv/schedule#current-date",
              label: "Schedule",
              page: "schedule",
            },
            {
              href: "/sports/golf/liv/standings/team",
              label: "Player Standings",
              page: "team",
            },
            {
              href: "/sports/golf/liv/standings/player",
              label: "Team Standings",
              page: "player",
            },
          ]}
        />
        {children}
      </div>
    </div>
  );
}
