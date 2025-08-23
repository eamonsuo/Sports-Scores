import { APISportsResponse } from "./misc";

export interface BaseballResponse<T> extends APISportsResponse {
  response: T[];
}

export interface BaseballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  week: number | null;
  status: Status;
  country: Country;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  scores: Scores;
}

interface Status {
  long: string; //Add values in
  short: string;
}

interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
}

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  season: number;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Innings {
  [key: string]: number | null;
}

interface ScoresDetail {
  hits: number | null;
  errors: number | null;
  innings: Innings;
  total: number | null;
}

interface Scores {
  home: ScoresDetail;
  away: ScoresDetail;
}
