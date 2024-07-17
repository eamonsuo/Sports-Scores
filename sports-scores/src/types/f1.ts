import { APISportsResponse } from "./misc";

export interface F1Response<T> extends APISportsResponse {
  response: T[];
}

export type F1Session = {
  id: number;
  competition: Competition;
  circuit: Circuit;
  season: number;
  type: string;
  laps: Laps;
  fastest_lap: FastestLap;
  distance: string | null;
  timezone: string;
  date: string;
  weather: any;
  status: string;
};

export type F1SessionResults = {
  race: { id: number };
  driver: Driver;
  team: Team;
  position: number;
  time: string;
  laps: number;
  grid: string;
  pits: number;
  gap: string | null;
};

export type F1TeamStandings = {
  position: number;
  team: Team;
  points: number;
  season: number;
};

export type F1DriverStandings = {
  position: number;
  driver: Driver;
  team: Team;
  points: number;
  wins: number;
  behind: number | null;
  season: number;
};

type Competition = {
  id: number;
  name: string;
  location: { country: string; city: string };
};

type Circuit = {
  id: number;
  name: string;
  image: string;
};

type Laps = {
  current: number | null;
  total: number | null;
};

type FastestLap = {
  driver: { id: number | null };
  time: string | null;
};

type Driver = {
  id: number;
  name: string;
  abbr: string;
  number: number;
  image: string;
};

type Team = {
  id: number;
  name: string;
  logo: string;
};

type SessionSummary = {
  id: number;
  name: string;
  logo: string;
  status: string;
  type: string;
  startDate: string;
  sport: string;
};
