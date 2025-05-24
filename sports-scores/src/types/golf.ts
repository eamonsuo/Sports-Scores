import { GolfRankingsPlayerRow } from "@/components/golf/RankingsLeaderboard";

export interface Golf_SlashGolfAPI_Schedule {
  _id: string;
  orgId: string;
  year: string;
  schedule: SlashGolf_Tournament[];
  timestamp: string;
}

export interface SlashGolf_Tournament {
  tournId: string;
  name: string;
  date: SlashGolf_TournamentDate;
  format?: string;
  purse?: number;
  winnersShare?: number;
  fedexCupPoints?: number;
}

export interface SlashGolf_TournamentDate {
  start: { $date: { $numberLong: number } };
  end: { $date: { $numberLong: number } };
  weekNumber: string | number;
}

export interface Golf_SlashGolfAPI_Stats {
  _id: string;
  name: string;
  year: string;
  weekNum: number;
  rankings: SlashGolf_PlayerRanking_FedExCup[] | SlashGolf_PlayerRanking_OWGR[];
  timestamp: string;
}

export interface SlashGolf_PlayerRanking_FedExCup {
  lastName: string;
  firstName: string;
  fullName: string;
  playerId: string;
  rank: { $numberInt: number };
  previousRank: number;
  events: number;
  totalPoints: number;
  avgPoints: number;
  pointsLost: number;
  pointsGained: number;
  pointsBehind?: string;
}

export interface SlashGolf_PlayerRanking_OWGR {
  lastName: string;
  firstName: string;
  fullName: string;
  playerId: string;
  rank: { $numberInt: number };
  previousRank: { $numberInt: number };
  events: number;
  totalPoints: { $numberDouble: number };
  avgPoints: { $numberDouble: number };
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
  cutLines: SlashGolf_CutLine[];
  leaderboardRows: SlashGolf_LeaderboardRow[];
}

export interface SlashGolf_CutLine {
  cutCount: number;
  cutScore: string;
}

export interface SlashGolf_LeaderboardRow {
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
  rounds: SlashGolf_Round[];
  thru: string;
  currentRound: number;
  teeTime: string;
  teeTimeTimestamp: string;
  players: {
    playerId: string;
    firstName: string;
    lastName: string;
    isAmateur: boolean;
  }[];
}

export interface SlashGolf_Round {
  scoreToPar: string;
  roundId: number;
  strokes: number;
  courseId: string;
  courseName: string;
}

export interface GolfSchedule {
  id: string;
  name: string;
  img: string;
  startDate: Date;
  endDate: Date;
  sport: string;
  course: string[];
  status: string;
  leader: string;
  location: string;
  tourName: string; //Used for url navigation
}

export interface GolfSchedulePage {
  schedule: GolfSchedule[];
}

export interface GolfRankingsPage {
  rankings: GolfRankingsPlayerRow[];
}
