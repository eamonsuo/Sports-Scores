import { ScoreDifference } from "@/components/generic/ScoreChart";
import { NRLStanding } from "@/components/nrl/NRLLadder";
import { NRLScoreBreakdown } from "@/components/nrl/NRLScoreBreakdown";
import { MatchSummary, TeamScoreDetails } from "./misc";

export interface NRL_RugbyAPI2_FixturePage_Response {
  events: RugbyAPI2_Event[];
  hasNextPage: boolean;
}

export interface NRL_RugbyAPI2_Match_Response {
  event: RugbyAPI2_Event;
}

export interface RugbyAPI2_Event {
  tournament: RugbyAPI2_Tournament;
  season: RugbyAPI2_Season;
  roundInfo: RugbyAPI2_RoundInfo;
  customId: string;
  status: RugbyAPI2_Status;
  winnerCode: number;
  venue: RugbyAPI2_Venue;
  referee: RugbyAPI2_Referee;
  homeTeam: RugbyAPI2_Team;
  awayTeam: RugbyAPI2_Team;
  homeScore: RugbyAPI2_Score;
  awayScore: RugbyAPI2_Score;
  time: RugbyAPI2_Time;
  changes: RugbyAPI2_Changes;
  hasGlobalHighlights: boolean;
  crowdsourcingDataDisplayEnabled: boolean;
  id: number;
  defaultPeriodCount: number;
  defaultPeriodLength: number;
  slug: string;
  currentPeriodStartTimestamp: number;
  startTimestamp: number;
  defaultOvertimeLength: number;
  finalResultOnly: boolean;
  feedLocked: boolean;
  fanRatingEvent: boolean;
  showTotoPromo: boolean;
  isEditor: boolean;
}

export interface RugbyAPI2_Tournament {
  name: string;
  slug: string;
  category: RugbyAPI2_Category;
  uniqueTournament: RugbyAPI2_UniqueTournament;
  priority: number;
  isGroup: boolean;
  isLive: boolean;
  id: number;
  fieldTranslations: RugbyAPI2_FieldTranslations;
}

export interface RugbyAPI2_Category {
  id: number;
  country: RugbyAPI2_Country;
  name: string;
  slug: string;
  sport: RugbyAPI2_Sport;
  flag: string;
  fieldTranslations: RugbyAPI2_FieldTranslations;
}

export interface RugbyAPI2_Country {
  alpha2?: string;
  alpha3?: string;
  name?: string;
  slug?: string;
}

export interface RugbyAPI2_Sport {
  name: string;
  slug: string;
  id: number;
}

export interface RugbyAPI2_FieldTranslations {
  nameTranslation: { [key: string]: string };
  shortNameTranslation: { [key: string]: string };
}

export interface RugbyAPI2_UniqueTournament {
  name: string;
  slug: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  category: RugbyAPI2_Category;
  userCount: number;
  hasPerformanceGraphFeature: boolean;
  id: number;
  country: RugbyAPI2_Country;
  hasEventPlayerStatistics: boolean;
  displayInverseHomeAwayTeams: boolean;
  fieldTranslations: RugbyAPI2_FieldTranslations;
}

export interface RugbyAPI2_Season {
  name: string;
  year: string;
  editor: boolean;
  id: number;
}

export interface RugbyAPI2_RoundInfo {
  round: number;
}

export interface RugbyAPI2_Status {
  code: number;
  description: string;
  type: string;
}

export interface RugbyAPI2_Team {
  id: number;
  country: RugbyAPI2_Country;
  name: string;
  slug: string;
  shortName: string;
  gender: string;
  sport: RugbyAPI2_Sport;
  userCount: number;
  nameCode: string;
  disabled: boolean;
  national: boolean;
  type: number;
  entityType: string;
  subTeams: any[];
  teamColors: RugbyAPI2_TeamColors;
  fieldTranslations: RugbyAPI2_FieldTranslations;
}

export interface RugbyAPI2_TeamColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface RugbyAPI2_Score {
  current: number;
  display: number;
  period1: number;
  period2: number;
  normaltime: number;
}

export interface RugbyAPI2_Time {
  played: number;
  periodLength: number;
  overtimeLength: number;
  totalPeriodCount: number;
  currentPeriodStartTimestamp: number;
}

export interface RugbyAPI2_Changes {
  changes: string[];
  changeTimestamp: number;
}

export interface RugbyAPI2_Venue {
  city: RugbyAPI2_City;
  hidden: boolean;
  slug: string;
  name: string;
  capacity: number;
  id: number;
  country: RugbyAPI2_Country;
  fieldTranslations: RugbyAPI2_FieldTranslations;
  stadium: RugbyAPI2_Stadium;
}

export interface RugbyAPI2_City {
  name: string;
}

export interface RugbyAPI2_Stadium {
  name: string;
  capacity: number;
}

export interface RugbyAPI2_Referee {
  name: string;
  slug: string;
  yellowCards: number;
  redCards: number;
  yellowRedCards: number;
  games: number;
  sport: RugbyAPI2_Sport;
  id: number;
  country: RugbyAPI2_Country;
  fieldTranslations: RugbyAPI2_FieldTranslations;
}

export interface NRLFixturesPage {
  fixtures: MatchSummary[];
}

export interface NRLLadderPage {
  standings: NRLStanding[];
}

export interface NRLMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: NRLScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface NRL_RugbyAPI2_LeagueTotalStandings_Response {
  standings: RugbyAPI2_Standing[];
}

export interface RugbyAPI2_Standing {
  tournament: RugbyAPI2_Tournament;
  name: string;
  type: string;
  descriptions: any[];
  rows: RugbyAPI2_Row[];
  id: number;
  updatedAtTimestamp: number;
}

export interface RugbyAPI2_Row {
  team: RugbyAPI2_Team;
  descriptions: any[];
  promotion?: RugbyAPI2_Promotion;
  position: number;
  matches: number;
  wins: number;
  scoresFor: number;
  scoresAgainst: number;
  id: number;
  losses: number;
  draws: number;
  points: number;
  scoreDiffFormatted: string;
}

export interface RugbyAPI2_Promotion {
  text: string;
  id: number;
}

export interface NRL_RugbyAPI2_MatchIncidents_Response {
  incidents: RugbyAPI2_Incident[];
}

export interface RugbyAPI2_Incident {
  text?: string; // For incidents like "FT" or "HT"
  homeScore?: number;
  awayScore?: number;
  isLive?: boolean;
  time: number;
  addedTime?: number;
  timeSeconds: number;
  reversedPeriodTime: number;
  reversedPeriodTimeSeconds: number;
  periodTimeSeconds: number;
  incidentType: string; // e.g., "period", "substitution", "goal", "card"
  playerIn?: RugbyAPI2_Player;
  playerOut?: RugbyAPI2_Player;
  player?: RugbyAPI2_Player; // For incidents involving a single player
  id: number;
  injury?: boolean;
  isHome?: boolean;
  incidentClass?: string; // e.g., "regular", "try", "yellow"
  from?: string; // e.g., "try", "twopoints"
  rescinded?: boolean; // For card incidents
}

export interface RugbyAPI2_Player {
  name: string;
  slug: string;
  shortName: string;
  position?: string; // e.g., "BR", "FB", "PR"
  jerseyNumber?: string;
  height?: number;
  userCount: number;
  id: number;
  marketValueCurrency: string;
  dateOfBirthTimestamp?: number;
  fieldTranslations?: RugbyAPI2_FieldTranslations;
}
