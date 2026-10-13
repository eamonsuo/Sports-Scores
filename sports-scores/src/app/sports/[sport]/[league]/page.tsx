import Placeholder from "@/components/misc-ui/Placeholder"
import { getSportConfigurations } from "@/lib/projUtils"
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { SPORT } from "@/types/misc"
import { redirect } from "next/navigation"

export default async function Page(props: {
  params: Promise<{ sport: string; league: string }>
}) {
  const { sport, league } = await props.params
  const config = SPORT_ROUTE_CONFIG[sport as SPORT]

  // Get configs for sport
  const { leagueConfig } = getSportConfigurations(config.leagues, league)

  if (!leagueConfig) {
    return <Placeholder>Please choose a season</Placeholder>
  }

  redirect(
    `/sports/${sport}/${leagueConfig.slug}/${leagueConfig?.seasons[0].slug}`,
  )
}
