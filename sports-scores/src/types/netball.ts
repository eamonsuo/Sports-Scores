import { ScoreDifference } from "@/components/all-sports/ScoreChart";
import { NetballScoreBreakdown } from "@/components/netball/NetballScoreBreakdown";
import { FixtureRound, TeamScoreDetails } from "./misc";
import { SportsDB_Events_Response } from "./sportsdb";

export interface Netball_SportsDB_SeasonEvent_Response
  extends SportsDB_Events_Response {}

export interface Netball_SportsDB_Match_Response
  extends SportsDB_Events_Response {}

export interface Netball_SportsDB_LeagueTotalStandings_Response {}

export interface Netball_SportsDB_MatchIncidents_Response {}

export interface Netball_SportsDB_DayEvents_Response
  extends SportsDB_Events_Response {}

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
