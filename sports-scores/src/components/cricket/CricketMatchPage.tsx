import MatchDetailsHero from "@/components/all-sports/MatchDetailsHero"
import MatchPropertyList from "@/components/all-sports/MatchPropertyList"
import CricketMatchScorecard from "@/components/cricket/CricketMatchScorecard"
import { CricketMatchDetails } from "@/types/cricket"
import { MatchDetailComponents } from "@/types/misc"
import MatchLineups from "../all-sports/MatchLineups"
import CricketCommentary from "./CricketCommentary"
import CricketStats from "./CricketStats"

export function cricketMatchDetailComponents(
  matchDetails: CricketMatchDetails,
): MatchDetailComponents[] {
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
