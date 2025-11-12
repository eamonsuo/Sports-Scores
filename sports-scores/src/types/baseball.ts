import { BaseballStanding } from "@/components/baseball/BaseballLadder";
import { BaseballScoreBreakdown } from "@/components/baseball/BaseballScoreBreakdown";
import { RoundDetails, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event,
  Sofascore_Incident,
  Sofascore_Standing,
} from "./sofascore.api";

export interface Baseball_BaseballApi_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface Baseball_BaseballApi_Match_Response {
  event: Sofascore_Event;
}

export interface Baseball_BaseballApi_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface Baseball_BaseballApi_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface Baseball_BaseballApi_MatchSchedules_Response {
  events: Sofascore_Event[];
}

export interface BaseballFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface BaseballLadderPage {
  tables: BaseballStanding[];
}

export interface BaseballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: BaseballScoreBreakdown[];
  };
  // scoreEvents: ScoreDifference[];
}

export interface BaseballTodayPage {
  fixtures: RoundDetails[];
  currentRound: string;
}
