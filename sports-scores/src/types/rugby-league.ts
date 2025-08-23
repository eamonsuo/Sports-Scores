import { ScoreDifference } from "@/components/generic/ScoreChart";
import { RugbyLeagueStanding } from "@/components/rugby-league/NRLLadder";
import { RugbyLeagueScoreBreakdown } from "@/components/rugby-league/NRLScoreBreakdown";
import { RoundDetails, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event,
  Sofascore_Incident,
  Sofascore_Standing,
} from "./sofascore.api";

export interface RugbyLeague_RugbyAPI2_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface RugbyLeague_RugbyAPI2_Match_Response {
  event: Sofascore_Event;
}

export interface RugbyLeague_RugbyAPI2_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface RugbyLeague_RugbyAPI2_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface RugbyLeague_RugbyAPI2_CategorySchedules_Response {
  events: Sofascore_Event[];
}

export interface RugbyLeagueFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface RugbyLeagueLadderPage {
  standings: RugbyLeagueStanding[];
}

export interface RugbyLeagueMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: RugbyLeagueScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface RugbyLeagueTodayPage {
  fixtures: RoundDetails[];
  currentRound: string;
}
