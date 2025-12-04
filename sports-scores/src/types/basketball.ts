import { BasketballStanding } from "@/components/basketball/BasketballLadder";
import { BasketballScoreBreakdown } from "@/components/basketball/BasketballScoreBreakdown";
import { RoundDetails, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event,
  Sofascore_Incident,
  Sofascore_Standing,
} from "./sofascore.api";

export interface Basketball_BasketApi_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface Basketball_BasketApi_Match_Response {
  event: Sofascore_Event;
}

export interface Basketball_BasketApi_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface Basketball_BasketApi_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface Basketball_BasketApi_MatchSchedules_Response {
  events: Sofascore_Event[];
}

export interface BasketballFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface BasketballLadderPage {
  standings: BasketballStanding[];
  qualifyingPosition?: number;
}

export interface BasketballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: BasketballScoreBreakdown[];
  };
  // scoreEvents: ScoreDifference[];
}

export interface BasketballTodayPage {
  fixtures: RoundDetails[];
  currentRound: string;
}
