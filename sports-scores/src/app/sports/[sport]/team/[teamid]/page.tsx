import ClientSportsPage from "@/components/all-sports/ClientSportsPage"
import FixtureList from "@/components/all-sports/FixtureList"
import FixtureRoundList from "@/components/all-sports/FixtureRoundList"
import Placeholder from "@/components/misc-ui/Placeholder"
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { Matches, SPORT } from "@/types/misc"
import { ReactNode } from "react"

export default async function Page(props: {
  params: Promise<{ teamid: string; sport: string }>
}) {
  const { teamid, sport } = await props.params
  const config = SPORT_ROUTE_CONFIG[sport as SPORT]

  const pageData = await config.service.matchesByTeam(teamid)

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ClientSportsPage options={pageSettings(pageData)} defaultState="list" />
    </div>
  )
}

function pageSettings(data: Matches): {
  btnLabel: string
  component: ReactNode
  state: string
}[] {
  const fixtureList = data.fixtures
    .flatMap((item) => item.matches)
    .sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })

  return [
    {
      btnLabel: `Matches By League`,
      component: (
        <FixtureRoundList data={data.fixtures} curRound={data.currentRound} />
      ),
      state: "league",
    },
    {
      btnLabel: `Matches List`,
      component: (
        <FixtureList
          data={fixtureList}
          cardVariant={data.fixtures[0].cardVariant}
        />
      ),
      state: "list",
    },
  ]
}
