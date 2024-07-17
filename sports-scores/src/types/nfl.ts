import { APISportsResponse } from "./misc";

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

export type NFLStanding = {
  league: NFLLeagueDetails;
  conference: string;
  division: string;
  position: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  won: number;
  lost: number;
  ties: number;
  points: {
    for: number;
    against: number;
    difference: number;
  };
  records: {
    home: string;
    road: string;
    conference: string;
    division: string;
  };
  streak: string;
  ncaa_conference: {
    won: number | null;
    lost: number | null;
    points: {
      for: number | null;
      against: number | null;
    };
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
