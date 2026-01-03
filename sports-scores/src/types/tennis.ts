import { TennisStanding } from "@/components/Tennis/TennisLadder";
import { TennisScoreBreakdown } from "@/components/Tennis/TennisScoreBreakdown";
import { ScoreDifference } from "@/components/generic/ScoreChart";
import { Match as BracketMatch } from "@/components/zz_export/types";
import { MatchSummary, RoundDetails, TeamScoreDetails } from "./misc";
import {
  Sofascore_CupTree,
  Sofascore_Event,
  Sofascore_Standing,
  Sofascore_Team,
} from "./sofascore.api";

export interface Tennis_TennisApi_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface Tennis_TennisApi_Match_Response {
  event: Sofascore_Event;
}

export interface Tennis_TennisApi_TournamentStandings_Response {
  standings: Sofascore_Standing[];
}

export interface Tennis_StatisticsItem {
  name: string;
  home: string;
  away: string;
  compareCode: number;
  statisticsType: string;
  valueType: string;
  homeValue: number;
  awayValue: number;
  renderType: number;
  key: string;
  homeTotal?: number;
  awayTotal?: number;
}

export interface Tennis_StatisticsGroup {
  groupName: string;
  statisticsItems: Tennis_StatisticsItem[];
}

export interface Tennis_Statistics {
  period: string;
  groups: Tennis_StatisticsGroup[];
}

export interface Tennis_TennisApi_MatchStatistics_Response {
  statistics: Tennis_Statistics[];
}

export interface Tennis_TennisApi_MatchSchedules_Response {
  events: Sofascore_Event[];
}

export interface Tennis_TennisApi_CupTrees_Response {
  cupTrees: Sofascore_CupTree[];
}

export interface Tennis_TennisApi_TournamentRounds_Response {
  currentRound: {
    round: number;
    name: string;
    slug: string;
  };
  rounds: {
    round: number;
    name: string;
    slug: string;
  }[];
}

export interface Tennis_TennisApi_TournamentRoundMatch_Response {
  events: Sofascore_Event[];
}

export interface Tennis_TennisApi_MatchDetails_Response {
  event: Sofascore_Event;
}

export interface Tennis_TennisApi_EventsByDate_Response {
  events: Sofascore_Event[];
}

export interface Tennis_Ranking {
  team: Sofascore_Team;
  type: number;
  rowName: string;
  ranking: number;
  points: number;
  previousRanking: number;
  bestRanking: number;
  id: number;
  country: any;
  rankingClass: string;
}

export interface Tennis_TennisApi_Rankings_Response {
  rankings: Tennis_Ranking[];
  updatedAtTimestamp: number;
}

export interface TennisFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface TennisTeamFixturesPage {
  fixtures: MatchSummary[];
}

export interface TennisLadderPage {
  standings: TennisStanding[];
  qualifyingPosition: number;
}

export interface TennisMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: TennisScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface TennisTodayPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface TennisBracketPage {
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
