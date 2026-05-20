import NavButtonGroup from "@/components/misc-ui/NavButtonGroup"
import { DEFAULT_NAV_BUTTONS, SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { SPORT } from "@/types/misc"
import { RankingList } from "@/types/tennis"

export default async function SportsLayout({
  children,
  sport,
  league,
  season,
}: {
  children: React.ReactNode
  sport: string
  league: string
  season: string
}) {
  const config = SPORT_ROUTE_CONFIG[sport as SPORT]
  const basePath = `/sports/${sport}/${league}/${season}`
  const rawButtons =
    config.navButtonsByLeague?.[league] ??
    config.navButtons ??
    DEFAULT_NAV_BUTTONS
  const buttons = rawButtons.map((btn) => ({
    ...btn,
    href: btn.href.startsWith("/")
      ? btn.href
      : `${basePath}/${btn.href.replace(/^\.\//, "")}`,
  }))

  return (
    <>
      {season !== "wiki" &&
        !Object.values(RankingList).includes(league as RankingList) && (
          <NavButtonGroup buttons={buttons} />
        )}
      {children}
    </>
  )
}
