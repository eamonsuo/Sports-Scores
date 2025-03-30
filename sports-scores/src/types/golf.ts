export interface Golf_SlashGolfAPI_Schedule {
  _id: string;
  orgId: string;
  year: string;
  schedule: Tournament[];
  timestamp: string;
}

export interface Tournament {
  tournId: string;
  name: string;
  date: TournamentDate;
  format?: string;
  purse?: number;
  winnersShare?: number;
  fedexCupPoints?: number;
}

export interface TournamentDate {
  start: string;
  end: string;
  weekNumber: string | number;
}

export interface Golf_SlashGolfAPI_Stats {
  _id: string;
  name: string;
  year: string;
  weekNum: number;
  rankings: PlayerRanking[];
  timestamp: string;
}

export interface PlayerRanking {
  lastName: string;
  firstName: string;
  fullName: string;
  playerId: string;
  rank: number;
  previousRank: number;
  events: number;
  totalPoints: number;
  avgPoints: number;
  pointsLost: number;
  pointsGained: number;
}

export interface Golf_SlashGolfAPI_Leaderboard {
  _id: string;
  orgId: string;
  year: string;
  tournId: string;
  status: string;
  roundId: number;
  roundStatus: string;
  lastUpdated: string;
  timestamp: string;
  cutLines: CutLine[];
  leaderboardRows: LeaderboardRow[];
}

export interface CutLine {
  cutCount: number;
  cutScore: string;
}

export interface LeaderboardRow {
  lastName: string;
  firstName: string;
  playerId: string;
  isAmateur: boolean;
  courseId: string;
  status: string;
  position: string;
  total: string;
  currentRoundScore: string;
  totalStrokesFromCompletedRounds: string;
  currentHole: number;
  startingHole: number;
  roundComplete: boolean;
  rounds: Round[];
  thru: string;
  currentRound: number;
  teeTime: string;
  teeTimeTimestamp: string;
}

export interface Round {
  scoreToPar: string;
  roundId: number;
  strokes: number;
  courseId: string;
  courseName: string;
}
