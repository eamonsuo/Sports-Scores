import NavButtonGroup from "@/components/misc-ui/NavButtonGroup";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";

const DEFAULT_NAV_BUTTONS = [
  { href: "./matches#current-date", label: "Matches", page: "matches" },
  { href: "./ladder", label: "Standings", page: "ladder" },
];

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  const config = SPORT_ROUTE_CONFIG[sport as SPORT];
  const buttons = config.navButtons ?? DEFAULT_NAV_BUTTONS;

  return (
    <>
      <NavButtonGroup buttons={buttons} />
      {children}
    </>
  );
}
