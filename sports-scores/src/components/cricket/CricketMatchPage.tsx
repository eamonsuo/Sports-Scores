import MatchDetailsHero from "@/components/all-sports/MatchDetailsHero"
import MatchPropertyList from "@/components/all-sports/MatchPropertyList"
import CricketMatchScorecard from "@/components/cricket/CricketMatchScorecard"
import Placeholder from "@/components/misc-ui/Placeholder"
import { cricketService } from "@/services/cricket.service"
import { CricketMatchDetails } from "@/types/cricket"
import { Fragment } from "react"
import MatchLineups from "../all-sports/MatchLineups"
import ComponentList from "../misc-ui/ComponentList"
import CricketCommentary from "./CricketCommentary"
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

  const pageSettingsData = pageSettings(pageData)

  return (
    <ComponentList
      labels={pageSettingsData.map((item) => item.btnLabel)}
      curItem="Scorecard"
      buttonStyle="rectangle"
    >
      {pageSettingsData.map(
        (item, index) => (
          console.log("pageSettingsData item", item),
          (
            <Fragment key={item.btnLabel.toLowerCase()}>
              {item.component === false ? (
                <Placeholder>NO DATA</Placeholder>
              ) : (
                item.component
              )}
            </Fragment>
          )
        ),
      )}
    </ComponentList>
  )
}

function pageSettings(matchDetails: CricketMatchDetails) {
  return [
    {
      btnLabel: `Details`,
      component: (
        <div className="flex flex-1 flex-col overflow-y-auto pb-4">
          <MatchDetailsHero
            status={matchDetails.matchDetails.status}
            homeInfo={matchDetails.matchDetails.homeTeam}
            awayInfo={matchDetails.matchDetails.awayTeam}
            // summaryText={matchDetails.}
          />
          <MatchPropertyList
            startDate={matchDetails.matchDetails.startDate}
            endDate={matchDetails.matchDetails.endDate}
            properties={matchDetails.matchDetails.properties}
          />
        </div>
      ),
    },
    {
      btnLabel: `Scorecard`,
      component: (
        <CricketMatchScorecard
          innings={matchDetails.matchScorecard.innings}
          matchState={matchDetails.matchScorecard.matchState}
        />
      ),
    },
    {
      btnLabel: `Commentary`,
      component: matchDetails.matchIncidents &&
        matchDetails.matchIncidents.length > 0 && (
          <CricketCommentary matchIncidents={matchDetails.matchIncidents} />
        ),
    },
    {
      btnLabel: `Stats`,
      component: matchDetails.matchIncidents &&
        matchDetails.matchIncidents.length > 0 && (
          <CricketStats matchIncidents={matchDetails.matchIncidents} />
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
