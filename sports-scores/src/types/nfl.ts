import { ScoreDifference } from "@/components/generic/ScoreChart";
import { NFLStanding } from "@/components/nfl/NFLLadder";
import { NFLScoreBreakdown } from "@/components/nfl/NFLScoreBreakdown";
import { APISportsResponse, MatchSummary, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event,
  Sofascore_Incident,
  Sofascore_Standing,
} from "./sofascore.api";

export interface NFL_AmericanFootballApi_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface NFL_AmericanFootballApi_Match_Response {
  event: Sofascore_Event;
}

export interface NFL_AmericanFootballApi_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface NFL_AmericanFootballApi_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface NFLFixturesPage {
  fixtures: MatchSummary[];
}

export interface NFLLadderPage {
  tables: NFLStanding[];
}

export interface NFLMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: NFLScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface NFLResponse<T> extends APISportsResponse {
  response: T[];
}

export type NFLGame = {
  game: {
    id: number;
    stage: string;
    week: string;
    date: {
      timezone: string;
      date: string;
      time: string;
      timestamp: number;
    };
    venue: {
      name: string | null;
      city: string | null;
    };
    status: {
      short:
        | "NS"
        | "Q1"
        | "Q2"
        | "Q3"
        | "Q4"
        | "OT"
        | "FT"
        | "HT"
        | "AOT"
        | "CANC"
        | "PST";
      long:
        | "Not Started"
        | "First Quarter"
        | "Second Quarter"
        | "Third Quarter"
        | "Fourth Quarter"
        | "Overtime"
        | "After Over Time"
        | "Finished"
        | "Halftime"
        | "Cancelled"
        | "Postponed";
      timer: string | null;
    };
  };
  league: NFLLeagueDetails;
  teams: {
    home: {
      id: number;
      name: string | null;
      logo: string;
    };
    away: {
      id: number;
      name: string | null;
      logo: string;
    };
  };
  scores: {
    home: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      overtime: number | null;
      total: number | null;
    };
    away: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      overtime: number | null;
      total: number | null;
    };
  };
};

export type NFLGameEvents = {
  quarter: string;
  minute: string;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
    image: string;
  };
  type: string;
  comment: string;
  score: {
    home: number;
    away: number;
  };
};

type NFLLeagueDetails = {
  id: number;
  name: string;
  season: number;
  logo: string;
  country: {
    name: string;
    code: string;
    flag: string;
  };
};
