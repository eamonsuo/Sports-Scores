import NavButtonGroup from "@/components/misc-ui/NavButtonGroup";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavButtonGroup
        buttons={SPORT_ROUTE_CONFIG[SPORT.FOOTBALL].navButtons ?? []}
      />
      {children}
    </>
  );
}
