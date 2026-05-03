import { NetballScoreBreakdown } from "@/components/netball/NetballScoreBreakdown";
import { FixtureRound, ScoreDifference, TeamScoreDetails } from "./misc";

export interface Netball_SportsDB_LeagueTotalStandings_Response {}

export interface Netball_SportsDB_MatchIncidents_Response {}

export interface NetballFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface NetballLadderPage {
  standings: any[][];
  qualifyingPosition: number;
}

export interface NetballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: NetballScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface NetballTodayPage {
  fixtures: FixtureRound[];
  currentRound: string;
}
