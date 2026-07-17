import { CricketScorecardInning, CricketScorecardPage } from "@/types/cricket"
import ComponentList from "../misc-ui/ComponentList"
import DataTable from "../misc-ui/DataTable"
import Placeholder from "../misc-ui/Placeholder"
import CricketScorecardBat from "./CricketScorecardBat"
import CricketScorecardBowl from "./CricketScorecardBowl"

//TODO: Add fall of wickets

export default function CricketMatchScorecard({
  innings: data,
  matchState,
}: CricketScorecardPage) {
  if (data.length === 0) {
    return <Placeholder>No Scorecard Details</Placeholder>
  }

  let scorecards = createScorecardComponents(data)
  return (
    <ComponentList
      labels={scorecards.map((item) => item.btnLabel)}
      curItem={
        matchState === "LIVE"
          ? scorecards[scorecards.length - 1].state
          : scorecards[0].state
      }
    >
      {scorecards.map((item) => item.component)}
    </ComponentList>
  )
}

function createScorecardComponents(inningsData: CricketScorecardInning[]) {
  return inningsData.map((item) => {
    return {
      btnLabel: `${item.inningLabel}`,
      component: (
        <div className="overflow-y-auto px-4">
          <CricketScorecardBat data={item.inningBatters} />
          <div className="py-6"></div>
          <CricketScorecardBowl data={item.inningBowlers} />
          <div className="py-6"></div>
          <DataTable
            tableName={item.fow.tableName}
            data={item.fow.data}
            headings={item.fow.headings}
            columnClassName={item.fow.columnClassName}
          />
          <div className="py-6"></div>
          <DataTable
            tableName={item.partnerships.tableName}
            data={item.partnerships.data}
            headings={item.partnerships.headings}
            columnClassName={item.partnerships.columnClassName}
          />
        </div>
      ),
      state: item.inningLabel,
    }
  })
}
