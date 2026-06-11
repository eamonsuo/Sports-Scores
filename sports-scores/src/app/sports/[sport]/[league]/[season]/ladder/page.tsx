import LadderGroupList from "@/components/all-sports/LadderGroupList"
import PlayoffPicture from "@/components/all-sports/PlayoffPicture"
import Placeholder from "@/components/misc-ui/Placeholder"
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { SPORT } from "@/types/misc"

export default async function Page(props: {
  params: Promise<{ league: string; season: string; sport: string }>
}) {
  const { league, season, sport } = await props.params
  const config = SPORT_ROUTE_CONFIG[sport as SPORT]

  const pageData = await config.service.standings(league, season)

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.playoffPicture && (
        <PlayoffPicture
          data={pageData.playoffPicture}
          buttonLabel="Finals Series"
        />
      )}{" "}
      <LadderGroupList
        data={pageData.standings}
        curGroup={pageData.standings[0].label ?? ""}
      />
    </div>
  )
}
