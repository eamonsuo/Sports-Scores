interface F1Response<T> extends APISportsResponse {
  response: T[];
}

interface F1Session {
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
}

interface F1SessionResults {
  race: { id: number };
  driver: Driver;
  team: Team;
  position: number;
  time: string;
  laps: number;
  grid: string;
  pits: number;
  gap: string | null;
  time: string | null;
}

interface F1TeamStandings {
  position: number;
  team: Team;
  points: number;
  season: number;
}

interface F1DriverStandings {
  position: number;
  driver: Driver;
  team: Team;
  points: number;
  wins: number;
  behind: number | null;
  season: number;
}

interface Competition {
  id: number;
  name: string;
  location: { country: string; city: string };
}

interface Circuit {
  id: number;
  name: string;
  image: string;
}

interface Laps {
  current: number | null;
  total: number | null;
}

interface FastestLap {
  driver: { id: number | null };
  time: string | null;
}

interface Driver {
  id: number;
  name: string;
  abbr: string;
  number: number;
  image: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface SessionSummary {
  id: number;
  name: string;
  logo: string;
  status: string;
  type: string;
  startDate: string;
  sport: string;
}
