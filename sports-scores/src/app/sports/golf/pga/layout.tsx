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
            href="/sports/golf/pga/schedule"
            tourName="PGA Tour"
          />
        </div>
        <NavButtonGroup
          buttons={[
            {
              href: "/sports/golf/pga/schedule#current-date",
              label: "Schedule",
              page: "schedule",
            },
            {
              href: "/sports/golf/pga/fedexcup",
              label: "FedEx Cup",
              page: "fedexcup",
            },
          ]}
        />
        {children}
      </div>
    </div>
  );
}
