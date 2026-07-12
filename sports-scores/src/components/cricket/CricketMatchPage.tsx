import MatchDetailsHero from "@/components/all-sports/MatchDetailsHero"
import MatchPropertyList from "@/components/all-sports/MatchPropertyList"
import CricketMatchScorecard from "@/components/cricket/CricketMatchScorecard"
import Placeholder from "@/components/misc-ui/Placeholder"
import { cricketService } from "@/services/cricket.service"
import { CricketInningIncident, CricketScorecardPage } from "@/types/cricket"
import { MatchProperties } from "@/types/misc"
import { ReactNode } from "react"
import ComponentList from "../misc-ui/ComponentList"
import CricketCommentary from "./CricketCommentary"
import CricketLineups from "./CricketLineups"
import CricketStats from "./CricketStats"

export function renderCricketMatchDetailsPage(
  league: string,
  season: string,
  id: string,
) {
  return Page({ params: Promise.resolve({ league, season, id }) })
}

async function Page(props: {
  params: Promise<{ league: string; season: string; id: string }>
}) {
  const { league, season, id } = await props.params

  const pageData = await cricketService.matchDetails(id, league, season)

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>
  }

  const pageSettingsData = pageSettings(
    pageData.matchDetails,
    pageData.matchScorecard,
    pageData.matchIncidents,
  )

  return (
    <ComponentList
      labels={pageSettingsData.map((item) => item.btnLabel)}
      curItem="Scorecard"
      buttonStyle="rectangle"
    >
      {pageSettingsData.map((item) => item.component)}
    </ComponentList>
  )
}

function pageSettings(
  matchDetails: MatchProperties,
  matchScorecard: CricketScorecardPage,
  matchIncidents?: CricketInningIncident[],
): {
  btnLabel: string
  component: ReactNode
  state: string
}[] {
  return [
    {
      btnLabel: `Details`,
      component: (
        <div className="flex flex-1 flex-col overflow-y-auto pb-4">
          <MatchDetailsHero
            status={matchDetails.status}
            homeInfo={matchDetails.homeTeam}
            awayInfo={matchDetails.awayTeam}
            // summaryText={matchDetails.}
          />
          <MatchPropertyList
            startDate={matchDetails.startDate}
            endDate={matchDetails.endDate}
            properties={matchDetails.properties}
          />
        </div>
      ),
      state: "details",
    },
    {
      btnLabel: `Scorecard`,
      component: (
        <CricketMatchScorecard
          data={matchScorecard.data}
          matchState={matchScorecard.matchState}
        />
      ),
      state: "scorecard",
    },
    {
      btnLabel: `Commentary`,
      component: matchIncidents && (
        <CricketCommentary matchIncidents={matchIncidents} />
      ),
      state: "commentary",
    },
    {
      btnLabel: `Stats`,
      component: matchIncidents && (
        <CricketStats matchIncidents={matchIncidents} />
      ), //TODO: Add Stats
      state: "stats",
    },
    {
      btnLabel: `Lineups`,
      component: matchIncidents && (
        <CricketLineups matchIncidents={matchIncidents} />
      ), //TODO: Add Lineups
      state: "lineups",
    },
  ]
}
