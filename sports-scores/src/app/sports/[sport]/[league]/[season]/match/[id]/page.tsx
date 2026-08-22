import LadderGroupList from "@/components/all-sports/LadderGroupList"
import MatchDetailsHero from "@/components/all-sports/MatchDetailsHero"
import MatchLineups from "@/components/all-sports/MatchLineups"
import MatchPropertyList from "@/components/all-sports/MatchPropertyList"
import ScoreBreakdown from "@/components/all-sports/ScoreBreakdown"
import ScoreChart from "@/components/all-sports/ScoreChart"
import ComponentList from "@/components/misc-ui/ComponentList"
import Placeholder from "@/components/misc-ui/Placeholder"
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { MatchDetail, MatchDetailComponents, SPORT } from "@/types/misc"
import { Fragment } from "react"

export default async function Page(props: {
  params: Promise<{
    league: string
    season: string
    id: string
    sport: string
  }>
}) {
  const { league, season, id, sport } = await props.params
  const config = SPORT_ROUTE_CONFIG[sport as SPORT]

  const pageData = await config.service.matchDetails(id, league, season)

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>
  }

  let pageComponents: MatchDetailComponents[] = []

  if (!config.matchDetailsPageComponents) {
    pageComponents = defaultPageComponents(pageData)
  } else {
    pageComponents = config.matchDetailsPageComponents(pageData)
  }

  return (
    <ComponentList
      labels={pageComponents.map((item) => item.btnLabel)}
      curItem={pageComponents[0]?.btnLabel}
      buttonStyle="rectangle"
    >
      {pageComponents.map((item) => (
        <Fragment key={item.btnLabel.toLowerCase()}>
          {item.component === false || item.component === undefined ? (
            <Placeholder>NO DATA</Placeholder>
          ) : (
            item.component
          )}
        </Fragment>
      ))}
    </ComponentList>
  )
}

function defaultPageComponents(
  matchDetails: MatchDetail,
): MatchDetailComponents[] {
  if ("standings" in matchDetails && matchDetails.standings !== null) {
    return [
      {
        btnLabel: `Standings`,
        component: (
          <LadderGroupList
            data={matchDetails.standings}
            curGroup={matchDetails.standings[0].label ?? ""}
          />
        ),
      },
    ]
  } else if (
    "matchDetails" in matchDetails &&
    matchDetails.matchDetails !== null
  ) {
    return [
      {
        btnLabel: `Details`,
        component: (
          <div className="flex flex-1 flex-col overflow-y-auto">
            <MatchDetailsHero
              homeInfo={matchDetails.matchDetails.homeTeam}
              awayInfo={matchDetails.matchDetails.awayTeam}
              status={matchDetails.matchDetails.status}
            />
            {matchDetails.scoreBreakdown && (
              <ScoreBreakdown
                scoreData={matchDetails.scoreBreakdown}
                homeLogo={matchDetails.matchDetails.homeTeam.img}
                awayLogo={matchDetails.matchDetails.awayTeam.img}
              />
            )}
            {matchDetails.scoreEvents && (
              <ScoreChart
                scoreDifference={matchDetails.scoreEvents}
                homeLogo={matchDetails.matchDetails.homeTeam.img}
                awayLogo={matchDetails.matchDetails.awayTeam.img}
              />
            )}
            <MatchPropertyList
              startDate={matchDetails.matchDetails.startDate}
              endDate={matchDetails.matchDetails.endDate}
              properties={matchDetails.matchDetails.properties}
            />
          </div>
        ),
      },
      {
        btnLabel: `Stats`,
        component: matchDetails.matchIncidents &&
          matchDetails.matchIncidents.length > 0 && (
            <Placeholder>Stats</Placeholder>
          ),
      },
      {
        btnLabel: `Lineups`,
        component: matchDetails.matchLineups && (
          <MatchLineups matchLineups={matchDetails.matchLineups} />
        ),
      },
    ]
  }
  return []
}
