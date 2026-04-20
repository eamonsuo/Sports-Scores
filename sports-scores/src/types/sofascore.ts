export interface Sofascore_Event_Response {
  event: Sofascore_Event;
}

export interface Sofascore_Events_Response {
  events: Sofascore_Event[];
}

export interface Sofascore_EventPage_Response
  extends Sofascore_Events_Response {
  hasNextPage: boolean;
}

export interface Sofascore_TotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface Sofascore_EventIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface Sofascore_TournamentCupTrees_Response {
  cupTrees: Sofascore_CupTree[];
}

export interface SofascoreAPI {
  fetchLastEvents: (
    tournamentId: number,
    seasonId: number,
    pageNumber: number,
  ) => Promise<Sofascore_EventPage_Response | null>;
  fetchNextEvents: (
    tournamentId: number,
    seasonId: number,
    pageNumber: number,
  ) => Promise<Sofascore_EventPage_Response | null>;
  fetchStandingsTotal: (
    tournamentId: number,
    seasonId: number,
  ) => Promise<Sofascore_TotalStandings_Response | null>;
  fetchEventDetails: (
    eventId: number,
  ) => Promise<Sofascore_Event_Response | null>;
  fetchEventIncidents: (
    eventId: number,
  ) => Promise<Sofascore_EventIncidents_Response | null>;
  fetchEventsByDate: (date: Date) => Promise<Sofascore_Events_Response | null>;
  fetchTeamLastEvents: (
    teamId: number,
    pageNumber?: number,
  ) => Promise<Sofascore_EventPage_Response | null>;
  fetchTeamNextEvents: (
    teamId: number,
    pageNumber?: number,
  ) => Promise<Sofascore_EventPage_Response | null>;
  fetchCupTrees: (
    tournamentId: number,
    seasonId: number,
  ) => Promise<Sofascore_TournamentCupTrees_Response | null>;
  fetchPlayerRankings: (
    rankingId: string,
  ) => Promise<Sofascore_Rankings_Response | null>;
}

interface Sofascore_Rankings_Response {
  rankingType: {
    sport: Sofascore_Sport;
    name: string;
    id: number;
    gender: string;
    lastUpdatedTimestamp: number;
    slug: string;
  };
  rankingRows: Sofascore_Ranking[];
}

export enum SofascoreSportURL {
  AMERICAN_FOOTBALL = "american-football",
  AUSSIE_RULES = "aussie-rules",
  BADMINTON = "badminton",
  BANDY = "bandy",
  BASEBALL = "baseball",
  BASKETBALL = "basketball",
  BEACH_VOLLEY = "beach-volley",
  CRICKET = "cricket",
  CYCLING = "cycling",
  DARTS = "darts",
  ESPORTS = "esports",
  FLOORBALL = "floorball",
  FOOTBALL = "football",
  FUTSAL = "futsal",
  HANDBALL = "handball",
  ICE_HOCKEY = "ice-hockey",
  MINIFOOTBALL = "minifootball",
  MMA = "mma",
  MOTORSPORT = "motorsport",
  RUGBY = "rugby",
  SNOOKER = "snooker",
  TABLE_TENNIS = "table-tennis",
  TENNIS = "tennis",
  VOLLEYBALL = "volleyball",
  WATER_POLO = "water-polo",
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
  subTeams?: Sofascore_Team[];
  note?: string;
  defaultPeriodCount: number;
  defaultPeriodLength: number;
  slug: string;
  currentPeriodStartTimestamp: number;
  startTimestamp: number;
  endTimestamp?: number;
  defaultOvertimeLength: number;
  finalResultOnly: boolean;
  feedLocked: boolean;
  fanRatingEvent: boolean;
  showTotoPromo: boolean;
  isEditor: boolean;
}

interface Sofascore_Tournament {
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

interface Sofascore_Category {
  id: number;
  country: Sofascore_Country;
  name: string;
  slug: string;
  sport: Sofascore_Sport;
  flag: string;
  fieldTranslations: Sofascore_FieldTranslations;
}

interface Sofascore_Country {
  alpha2?: string;
  alpha3?: string;
  name?: string;
  slug?: string;
}

interface Sofascore_Sport {
  name: string;
  slug: string;
  id: number;
}

interface Sofascore_FieldTranslations {
  nameTranslation: { [key: string]: string };
  shortNameTranslation: { [key: string]: string };
}

interface Sofascore_UniqueTournament {
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
  tennisPoints?: number; // Only for tennis unique tournaments, represents the level of tournament
  groundType?: string; // Only for tennis unique tournaments, e.g. "Hardcourt outdoor", "Clay", "Grass"
}

interface Sofascore_Season {
  name: string;
  year: string;
  editor: boolean;
  id: number;
}

interface Sofascore_RoundInfo {
  round: number;
  name?: string;
  cupRoundType?: string;
}

interface Sofascore_Status {
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

interface Sofascore_TeamColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface Sofascore_Score {
  current: number;
  display: number;
  period1?: number;
  period2?: number;
  period3?: number;
  period4?: number;
  period5?: number;
  period6?: number;
  period7?: number;
  period8?: number;
  period9?: number;
  period1TieBreak?: number;
  period2TieBreak?: number;
  period3TieBreak?: number;
  period4TieBreak?: number;
  period5TieBreak?: number;
  overtime?: number;
  normaltime?: number;
  innings?: {
    inning1?: Sofascore_Score_Inning;
    inning2?: Sofascore_Score_Inning;
  };
}

interface Sofascore_Score_Inning {
  score: number;
  wickets: number;
  overs: number;
  runRate: number;
}

interface Sofascore_Time {
  played: number;
  periodLength: number;
  overtimeLength: number;
  totalPeriodCount: number;
  currentPeriodStartTimestamp: number;
}

interface Sofascore_Changes {
  changes: string[];
  changeTimestamp: number;
}

interface Sofascore_Venue {
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

interface Sofascore_City {
  name: string;
}

interface Sofascore_Stadium {
  name: string;
  capacity: number;
}

interface Sofascore_Referee {
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
  rows: Sofascore_StandingRow[];
  id: number;
  updatedAtTimestamp: number;
}

export interface Sofascore_StandingRow {
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
  overtimeLosses?: number; //Ice Hockey
  scoreDiffFormatted: string;
}

interface Sofascore_Promotion {
  text: string;
  id: number;
}

interface Sofascore_Incident {
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

interface Sofascore_Player {
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

interface Sofascore_CupTrees_Response {
  cupTrees: Sofascore_CupTree[];
}

export interface Sofascore_CupTree {
  id: number;
  name: string;
  tournament: Sofascore_Tournament;
  currentRound: number;
  rounds: Sofascore_CupRound[];
  type: number;
  finalMatchCupBlock?: Sofascore_CupBlock;
  showSingleParticipantByeBlocks: boolean;
  hideRoundsWithoutParticipants: boolean;
}

interface Sofascore_CupRound {
  order: number;
  type: number;
  description: string;
  blocks: Sofascore_CupBlock[];
  id: number;
}

interface Sofascore_CupBlock {
  finished?: boolean;
  matchesInRound: number;
  order?: number;
  result?: string;
  homeTeamScore?: string;
  awayTeamScore?: string;
  participants: Sofascore_CupParticipant[];
  hasNextRoundLink?: boolean;
  eventInProgress?: boolean;
  id: number;
  events?: number[];
  blockId: number;
  seriesStartDateTimestamp?: number;
  automaticProgression: boolean;
}

interface Sofascore_CupParticipant {
  team: Sofascore_Team;
  winner: boolean;
  sourceBlockId?: number;
  order: number;
  teamSeed?: string;
  id: number;
}

interface Sofascore_Ranking {}
