import { ScoreDifference } from "@/components/all-sports/ScoreChart";
import { Match as BracketMatch } from "@/components/bracket/types";
import { FootballStanding } from "@/components/football/FootballLadder";
import { FootballScoreBreakdown } from "@/components/football/FootballScoreBreakdown";
import { FixtureRound, MatchSummary, TeamScoreDetails } from "./misc";
import {
  Sofascore_CupTree,
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "./sofascore";

export interface Football_FootApi_FixturePage_Response
  extends Sofascore_EventPage_Response {}

export interface Football_FootApi_Match_Response
  extends Sofascore_Event_Response {}

export interface Football_FootApi_LeagueTotalStandings_Response
  extends Sofascore_TotalStandings_Response {}

export interface Football_FootApi_MatchIncidents_Response
  extends Sofascore_EventIncidents_Response {}

export interface Football_FootApi_MatchSchedules_Response
  extends Sofascore_Events_Response {}

export interface Football_FootApi_LeagueCupTrees_Response {
  cupTrees: Sofascore_CupTree[];
}

export interface FootballFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface FootballTeamFixturesPage {
  fixtures: MatchSummary[];
}

export interface FootballLadderPage {
  tables: FootballStanding[];
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
  fixtures: FixtureRound[];
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
