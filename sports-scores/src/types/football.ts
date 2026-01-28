import { ScoreDifference } from "@/components/all-sports/ScoreChart";
import { Match as BracketMatch } from "@/components/bracket/types";
import { FootballStanding } from "@/components/football/FootballLadder";
import { FootballScoreBreakdown } from "@/components/football/FootballScoreBreakdown";
import { MatchSummary, RoundDetails, TeamScoreDetails } from "./misc";
import {
  Sofascore_CupTree,
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

export interface Football_FootApi_LeagueCupTrees_Response {
  cupTrees: Sofascore_CupTree[];
}

export interface FootballFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface FootballTeamFixturesPage {
  fixtures: MatchSummary[];
}

export interface FootballLadderPage {
  standings: FootballStanding[];
  qualifyingPosition: number;
}

export interface FootballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: FootballScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface FootballTodayPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface FootballBracketPage {
  brackets: {
    id: number;
    name: string;
    currentRound: number;
    matches: BracketMatch[];
  }[];
}

export interface BracketRounds {
  id: number;
  name: string;
  matches: MatchSummary[];
}
