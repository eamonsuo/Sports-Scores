export interface Sofascore_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface Sofascore_Match_Response {
  event: Sofascore_Event;
}
export interface Sofascore_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface Sofascore_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface Sofascore_ScheduledEvents_Response {
  events: Sofascore_Event[];
}

export interface Sofascore_Event {
  tournament: Sofascore_Tournament;
  season: Sofascore_Season;
  roundInfo?: Sofascore_RoundInfo;
  customId: string;
  status: Sofascore_Status;
  winnerCode: number;
  venue: Sofascore_Venue;
  referee: Sofascore_Referee;
  homeTeam: Sofascore_Team;
  awayTeam: Sofascore_Team;
  homeScore: Sofascore_Score;
  awayScore: Sofascore_Score;
  time: Sofascore_Time;
  changes: Sofascore_Changes;
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

export interface Sofascore_Tournament {
  name: string;
  slug: string;
  category: Sofascore_Category;
  uniqueTournament: Sofascore_UniqueTournament;
  priority: number;
  isGroup: boolean;
  isLive: boolean;
  id: number;
  fieldTranslations: Sofascore_FieldTranslations;
}

export interface Sofascore_Category {
  id: number;
  country: Sofascore_Country;
  name: string;
  slug: string;
  sport: Sofascore_Sport;
  flag: string;
  fieldTranslations: Sofascore_FieldTranslations;
}

export interface Sofascore_Country {
  alpha2?: string;
  alpha3?: string;
  name?: string;
  slug?: string;
}

export interface Sofascore_Sport {
  name: string;
  slug: string;
  id: number;
}

export interface Sofascore_FieldTranslations {
  nameTranslation: { [key: string]: string };
  shortNameTranslation: { [key: string]: string };
}

export interface Sofascore_UniqueTournament {
  name: string;
  slug: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  category: Sofascore_Category;
  userCount: number;
  hasPerformanceGraphFeature: boolean;
  id: number;
  country: Sofascore_Country;
  hasEventPlayerStatistics: boolean;
  displayInverseHomeAwayTeams: boolean;
  fieldTranslations: Sofascore_FieldTranslations;
}

export interface Sofascore_Season {
  name: string;
  year: string;
  editor: boolean;
  id: number;
}

export interface Sofascore_RoundInfo {
  round: number;
  name?: string;
  cupRoundType?: string;
}

export interface Sofascore_Status {
  code: number;
  description: string;
  type: string;
}

export interface Sofascore_Team {
  id: number;
  country: Sofascore_Country;
  name: string;
  slug: string;
  shortName: string;
  gender: string;
  sport: Sofascore_Sport;
  userCount: number;
  nameCode: string;
  disabled: boolean;
  national: boolean;
  type: number;
  entityType: string;
  subTeams: any[];
  teamColors: Sofascore_TeamColors;
  fieldTranslations: Sofascore_FieldTranslations;
}

export interface Sofascore_TeamColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface Sofascore_Score {
  current: number;
  display: number;
  period1: number;
  period2: number;
  period3?: number;
  period4?: number;
  period5?: number;
  period6?: number;
  period7?: number;
  period8?: number;
  period9?: number;
  overtime?: number;
  normaltime: number;
}

export interface Sofascore_Time {
  played: number;
  periodLength: number;
  overtimeLength: number;
  totalPeriodCount: number;
  currentPeriodStartTimestamp: number;
}

export interface Sofascore_Changes {
  changes: string[];
  changeTimestamp: number;
}

export interface Sofascore_Venue {
  city: Sofascore_City;
  hidden: boolean;
  slug: string;
  name: string;
  capacity: number;
  id: number;
  country: Sofascore_Country;
  fieldTranslations: Sofascore_FieldTranslations;
  stadium: Sofascore_Stadium;
}

export interface Sofascore_City {
  name: string;
}

export interface Sofascore_Stadium {
  name: string;
  capacity: number;
}

export interface Sofascore_Referee {
  name: string;
  slug: string;
  yellowCards: number;
  redCards: number;
  yellowRedCards: number;
  games: number;
  sport: Sofascore_Sport;
  id: number;
  country: Sofascore_Country;
  fieldTranslations: Sofascore_FieldTranslations;
}

export interface Sofascore_Standing {
  tournament: Sofascore_Tournament;
  name: string;
  type: string;
  descriptions: any[];
  tieBreakingRule?: { text: string; id: number };
  rows: Sofascore_Row[];
  id: number;
  updatedAtTimestamp: number;
}

export interface Sofascore_Row {
  team: Sofascore_Team;
  descriptions: any[];
  promotion?: Sofascore_Promotion;
  position: number;
  matches: number;
  wins: number;
  scoresFor: number;
  scoresAgainst: number;
  id: number;
  losses: number;
  draws?: number;
  points?: number;
  percentage?: number;
  streak?: number;
  scoreDiffFormatted: string;
}

export interface Sofascore_Promotion {
  text: string;
  id: number;
}

export interface Sofascore_Incident {
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
  playerIn?: Sofascore_Player;
  playerOut?: Sofascore_Player;
  player?: Sofascore_Player; // For incidents involving a single player
  id: number;
  injury?: boolean;
  isHome?: boolean;
  incidentClass?: string; // e.g., "regular", "try", "yellow"
  from?: string; // e.g., "try", "twopoints"
  rescinded?: boolean; // For card incidents
}

export interface Sofascore_Player {
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
  fieldTranslations?: Sofascore_FieldTranslations;
}

export interface Sofascore_CupTrees {
  id: number;
  name: string;
}
