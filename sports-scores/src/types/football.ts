import { ScoreDifference } from "@/components/generic/ScoreChart";
import { RoundDetails, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event,
  Sofascore_Incident,
  Sofascore_Standing,
} from "./sofascore.api";

export interface Football_FootApi_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface Football_FootApi_Match_Response {
  event: Sofascore_Event;
}

export interface Football_FootApi_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface Football_FootApi_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface Football_FootApi_MatchSchedules_Response {
  events: Sofascore_Event[];
}

export interface FootballFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface FootballLadderPage {
  standings: any[]; //TODO: FootballStanding[];
  qualifyingPosition: number;
}

export interface FootballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: any[]; //TODO: FootballScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface FootballTodayPage {
  fixtures: RoundDetails[];
  currentRound: string;
}
