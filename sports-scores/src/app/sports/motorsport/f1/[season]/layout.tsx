import NavButtonGroup from "@/components/misc-ui/NavButtonGroup";
import { DEFAULT_NAV_BUTTONS, SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;

  const config = SPORT_ROUTE_CONFIG[SPORT.MOTORSPORT];
  const basePath = `/sports/${SPORT.MOTORSPORT}/f1/${season}`;
  const rawButtons = config.navButtons ?? DEFAULT_NAV_BUTTONS;
  const buttons = rawButtons.map((btn) => ({
    ...btn,
    href: btn.href.startsWith("/")
      ? btn.href
      : `${basePath}/${btn.href.replace(/^\.\//, "")}`,
  }));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex h-full flex-col">
        <NavButtonGroup buttons={buttons} />
        {children}
      </div>
    </div>
  );
}
