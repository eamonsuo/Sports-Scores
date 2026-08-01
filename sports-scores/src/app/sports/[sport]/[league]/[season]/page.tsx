import FixtureRoundList from "@/components/all-sports/FixtureRoundList"
import Placeholder from "@/components/misc-ui/Placeholder"
import { getSportConfigurations } from "@/lib/projUtils"
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { SPORT } from "@/types/misc"
import { redirect } from "next/navigation"

export default async function Page(props: {
  params: Promise<{ league: string; season: string; sport: string }>
}) {
  const { league, season, sport } = await props.params
  const config = SPORT_ROUTE_CONFIG[sport as SPORT]

  // Get configs for sport
  const { leagueConfig, seasonConfig } = getSportConfigurations(
    config.leagues,
    league,
    season,
  )

  // Check if special page is required. Use season URL before league URL
  if (
    seasonConfig?.slug?.startsWith("wiki") &&
    (seasonConfig?.externalURL || leagueConfig?.externalURL)
  ) {
    return (
      <iframe
        src={seasonConfig?.externalURL ?? leagueConfig?.externalURL}
        className="h-full"
      />
    )
  } else if (
    seasonConfig?.slug?.startsWith("external") &&
    (seasonConfig?.externalURL || leagueConfig?.externalURL)
  ) {
    redirect((seasonConfig?.externalURL ?? leagueConfig?.externalURL)!)
  }

  // Implemented page - get the associated data
  const pageData = await config.service.matchesByLeagueSeason(league, season)

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>
  }

  return (
    <FixtureRoundList
      data={pageData.fixtures}
      curRound={pageData.currentRound}
    />
  )
}
