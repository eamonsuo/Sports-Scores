import { GolfMatchDetail } from "@/types/golf"
import { MatchDetailComponents } from "@/types/misc"
import FixtureRoundList from "../all-sports/FixtureRoundList"
import LadderGroupList from "../all-sports/LadderGroupList"

export function GolfMatchPage(
  matchDetails: GolfMatchDetail,
): MatchDetailComponents[] {
  const matchDetailComponents = [
    {
      btnLabel: `Leaderboard`,
      component: (
        <LadderGroupList
          data={matchDetails.standings}
          curGroup={matchDetails.standings[0].label ?? ""}
        />
      ),
    },
  ]

  if (matchDetails.matches.length > 0) {
    matchDetailComponents.push({
      btnLabel: `Matches`,
      component: (
        <FixtureRoundList
          data={matchDetails.matches}
          curRound={matchDetails.matches[0].roundLabel}
        />
      ),
    })
  }

  return matchDetailComponents
}
