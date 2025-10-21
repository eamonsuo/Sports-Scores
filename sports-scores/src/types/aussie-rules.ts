import { ScoreDifference } from "@/components/generic/ScoreChart";
import { RoundDetails, TeamScoreDetails } from "./misc";

export interface AussieRulesFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface AussieRulesLadderPage {
  standings: AussieRulesStanding[];
  qualifyingPosition: number;
}

export interface AussieRulesMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: AussieRulesGameQuarter[];
  };
  scoreEvents: ScoreDifference[];
}

export type AussieRulesGame = {
  game: {
    id: number;
  };
  league: {
    id: number;
    season: number;
  };
  date: string;
  time: string;
  timestamp: string;
  timezone: string;
  round: string;
  week: number;
  venue: string;
  attendance: number;
  status: {
    long:
      | "Not Started"
      | "1st Quarter"
      | "2nd Quarter"
      | "3rd Quarter"
      | "4th Quarter"
      | "Quarter Time"
      | "End Of Regulation"
      | "Full Time"
      | "Half Time"
      | "Cancelled"
      | "Postponed";
    short:
      | "NS"
      | "Q1"
      | "Q2"
      | "Q3"
      | "Q4"
      | "QT"
      | "ER"
      | "FT"
      | "HT"
      | "CANC"
      | "PST";
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  scores: {
    home: {
      score: number;
      goals: number;
      behinds: number;
      psgoals: number;
      psbehinds: number;
    };
    away: {
      score: number;
      goals: number;
      behinds: number;
      psgoals: number;
      psbehinds: number;
    };
  };
};

export type AussieRulesGameQuarter = {
  quarter: number;
  teams: {
    home: TeamQuarterStats;
    away: TeamQuarterStats;
  };
};

type TeamQuarterStats = {
  id: number;
  goals?: number;
  behinds?: number;
  points: number;
};

export type AussieRulesGameEvents = {
  game: {
    id: number;
  };
  events: [
    {
      team: {
        id: number;
      };
      player: {
        id: number;
      };
      period: number;
      minute: number;
      type: "goal" | "behind";
    },
  ];
};

export type AussieRulesStanding = {
  position: number;
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  pts: number;
  games: {
    played: number;
    win: number;
    drawn: number;
    lost: number;
  };
  scores: {
    for: number;
    against: number;
  };
  last_5: string;
};

export interface AussieRulesTodayPage {
  fixtures: RoundDetails[];
  currentRound: string;
}
