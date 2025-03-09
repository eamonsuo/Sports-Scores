import ClientSportsPage from "../generic/ClientSportsPage";
import Placeholder from "../misc/Placeholder";
import CricketScorecardBat, {
  CricketScorecardBatProps,
} from "./CricketScorecardBat";
import CricketScorecardBowl, {
  CricketScorecardBowlProps,
} from "./CricketScorecardBowl";

//TODO: Add fall of wickets

export default function CricketMatchScorecardPage({
  data,
  matchState,
}: {
  data: {
    inningLabel: string;
    inningBatters: CricketScorecardBatProps;
    inningBowlers: CricketScorecardBowlProps;
  }[];
  matchState: "LIVE" | "COMPLETED";
}) {
  if (data.length === 0) {
    return <Placeholder>No Scorecard Details</Placeholder>;
  }

  let scorecards = createScorecardComponents(data);
  return (
    <div className="flex-1 overflow-y-auto">
      <ClientSportsPage
        apiStatus={<></>}
        options={scorecards}
        defaultState={
          matchState === "LIVE"
            ? scorecards[scorecards.length - 1].state
            : scorecards[0].state
        }
      />
    </div>
  );
}

function createScorecardComponents(
  inningsData: {
    inningLabel: string;
    inningBatters: CricketScorecardBatProps;
    inningBowlers: CricketScorecardBowlProps;
  }[],
) {
  return inningsData.map((item) => {
    return {
      btnLabel: `${item.inningLabel}`,
      component: (
        <div className="overflow-y-auto px-4">
          <CricketScorecardBat data={item.inningBatters} />
          <div className="py-6"></div>
          <CricketScorecardBowl data={item.inningBowlers} />
        </div>
      ),
      state: item.inningLabel.toString(),
    };
  });
}
