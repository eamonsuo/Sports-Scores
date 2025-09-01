import { F1DriverStandings } from "@/components/motorsport/f1/F1DriverStandings";
import { F1SessionResults } from "@/components/motorsport/f1/F1SessionStandings";
import { F1TeamStandings } from "@/components/motorsport/f1/F1TeamStandings";
import { APISportsResponse } from "./misc";

// Page Types
export interface F1RacesPage {
  sessions: SessionSummary[];
}

export interface F1SessionPage {
  results: F1SessionResults[];
  sessionName: string;
}

export interface F1DriverStandingsPage {
  standings: F1DriverStandings[];
}

export interface F1ConstructorStandingsPage {
  standings: F1TeamStandings[];
}

// Jolpica API Types
export interface F1_Jolpica_Races_Response {
  MRData: Jolpica_MRData_Races;
}

export interface F1_Jolpica_DriverStandings_Response {
  MRData: Jolpica_MRData_Standings;
}

export interface F1_Jolpica_ConstructorStandings_Response {
  MRData: Jolpica_MRData_ConstructorStandings;
}

export interface F1_Jolpica_RaceResults_Response {
  MRData: Jolpica_MRData_RacesResults;
}

export interface F1_Jolpica_QualifyingResults_Response {
  MRData: Jolpica_MRData_QualifyingResults;
}

export interface F1_Jolpica_SprintResults_Response {
  MRData: Jolpica_MRData_SprintResults;
}

//Response is an array
export interface F1_OpenF1_Positions_Response {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

//Response is an array
export interface F1_OpenF1_Drivers_Response {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
}

//Response is an array
export interface F1_OpenF1_Meetings_Response {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

//Response is an array
export interface F1_OpenF1_Sessions_Response {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
}

export interface Jolpica_MRData_SprintResults {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable: Jolpica_RaceTable_SprintResults;
}

export interface Jolpica_RaceTable_SprintResults {
  season: string;
  Races: Jolpica_Race_SprintResults[];
}

export interface Jolpica_Race_SprintResults {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Jolpica_Circuit;
  date: string;
  time: string;
  SprintResults: Jolpica_SprintResult[];
}

export interface Jolpica_SprintResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Jolpica_Driver;
  Constructor: Jolpica_Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: Jolpica_Time;
  FastestLap?: Jolpica_FastestLap;
}

export interface Jolpica_Time {
  millis?: string;
  time: string;
}

export interface Jolpica_FastestLap {
  rank: string;
  lap: string;
  Time: Jolpica_Time;
}

export interface Jolpica_MRData_QualifyingResults {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable: Jolpica_RaceTable_QualifyingResults;
}

export interface Jolpica_RaceTable_QualifyingResults {
  season: string;
  Races: Jolpica_Race_QualifyingResults[];
}

export interface Jolpica_Race_QualifyingResults {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Jolpica_Circuit;
  date: string;
  time: string;
  QualifyingResults: Jolpica_QualifyingResult[];
}

export interface Jolpica_QualifyingResult {
  number: string;
  position: string;
  Driver: Jolpica_Driver;
  Constructor: Jolpica_Constructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface Jolpica_MRData_RacesResults {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable: Jolpica_RaceTableResults;
}

export interface Jolpica_RaceTableResults {
  season: string;
  Races: Jolpica_RaceResult[];
}

export interface Jolpica_RaceResult {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Jolpica_Circuit;
  date: string;
  time: string;
  Results: Jolpica_Result[];
}

export interface Jolpica_Result {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Jolpica_Driver;
  Constructor: Jolpica_Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: Jolpica_Time;
  FastestLap?: Jolpica_FastestLap;
}

export interface Jolpica_Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Jolpica_Time {
  millis?: string;
  time: string;
}

export interface Jolpica_FastestLap {
  rank: string;
  lap: string;
  Time: Jolpica_Time;
}

export interface Jolpica_MRData_ConstructorStandings {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  StandingsTable: Jolpica_ConstructorStandingsTable;
}

export interface Jolpica_ConstructorStandingsTable {
  season: string;
  round: string;
  StandingsLists: Jolpica_ConstructorStandingsList[];
}

export interface Jolpica_ConstructorStandingsList {
  season: string;
  round: string;
  ConstructorStandings: Jolpica_ConstructorStanding[];
}

export interface Jolpica_ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Jolpica_Constructor; // Reusing the existing `Jolpica_Constructor` type from f1.ts
}

export interface Jolpica_MRData_Standings {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  StandingsTable: Jolpica_StandingsTable;
}

export interface Jolpica_StandingsTable {
  season: string;
  round: string;
  StandingsLists: Jolpica_StandingsList[];
}

export interface Jolpica_StandingsList {
  season: string;
  round: string;
  DriverStandings: Jolpica_DriverStanding[];
}

export interface Jolpica_DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Jolpica_Driver; // Reusing the existing `Driver` type from f1.ts
  Constructors: Jolpica_Constructor[];
}

export interface Jolpica_Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface Jolpica_MRData_Races {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable: Jolpica_RaceTable;
}

export interface Jolpica_RaceTable {
  season: string;
  Races: Jolpica_Race[];
}

export interface Jolpica_Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Jolpica_Circuit;
  date: string;
  time: string;
  FirstPractice?: Jolpica_Session;
  SecondPractice?: Jolpica_Session;
  ThirdPractice?: Jolpica_Session;
  Qualifying?: Jolpica_Session;
  Sprint?: Jolpica_Session;
  SprintQualifying?: Jolpica_Session;
}

export interface Jolpica_Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Jolpica_Location;
}

export interface Jolpica_Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface Jolpica_Session {
  date: string;
  time: string;
}

//Old API Response
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

export type SessionSummary = {
  round: number;
  grandPrixName: string;
  logo?: string;
  status: string;
  sessionType: F1SessionType;
  sessionName?: string;
  startDate: Date;
  sport: string;
  sessionSlug?: string;
};

export enum F1SessionType {
  Practice1 = "Practice-1",
  Practice2 = "Practice-2",
  Practice3 = "Practice-3",
  Qualifying = "Qualifying",
  Sprint = "Sprint",
  SprintQualifying = "Sprint-Qualifying",
  Race = "Race",
}
