import { AmericanFootballStanding } from "@/components/american-football/AmericanFootballLadder";
import { AmericanFootballScoreBreakdown } from "@/components/american-football/AmericanFootballScoreBreakdown";
import { ScoreDifference } from "@/components/generic/ScoreChart";
import { APISportsResponse, RoundDetails, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event,
  Sofascore_Incident,
  Sofascore_Standing,
} from "./sofascore.api";

export interface AmericanFootball_Sofascore_Event extends Sofascore_Event {
  homeTeamSeasonHistoricalForm: {
    wins: number;
    losses: number;
    ties: number;
  };
  awayTeamSeasonHistoricalForm: {
    wins: number;
    losses: number;
    ties: number;
  };
}

export interface AmericanFootball_AmericanFootballApi_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface AmericanFootball_AmericanFootballApi_Match_Response {
  event: Sofascore_Event;
}

export interface AmericanFootball_AmericanFootballApi_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface AmericanFootball_AmericanFootballApi_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface AmericanFootball_AmericanFootballApi_CategorySchedule_Response {
  events: AmericanFootball_Sofascore_Event[];
}

export interface AmericanFootballFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface AmericanFootballLadderPage {
  tables: AmericanFootballStanding[];
}

export interface AmericanFootballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: AmericanFootballScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface AmericanFootballResponse<T> extends APISportsResponse {
  response: T[];
}

export type AmericanFootballGame = {
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
  league: AmericanFootballLeagueDetails;
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

export type AmericanFootballGameEvents = {
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

type AmericanFootballLeagueDetails = {
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
