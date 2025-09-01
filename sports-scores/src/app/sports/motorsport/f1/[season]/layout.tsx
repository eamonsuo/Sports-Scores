import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex h-full flex-col">
        <NavButtonGroup
          buttons={[
            {
              href: `/sports/${SPORT.MOTORSPORT}/f1/${season}/races`,
              label: "Races",
              page: "races",
            },
            {
              href: `/sports/${SPORT.MOTORSPORT}/f1/${season}/drivers`,
              label: "Drivers",
              page: "drivers",
            },
            {
              href: `/sports/${SPORT.MOTORSPORT}/f1/${season}/teams`,
              label: "Teams",
              page: "teams",
            },
          ]}
        />
        {children}
      </div>
    </div>
  );
}
