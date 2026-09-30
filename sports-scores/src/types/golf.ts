import { FixtureRound, StageMatchDetail } from "./misc"

export interface GolfMatchDetail extends StageMatchDetail {
  // For Team events/matchplay
  matches: FixtureRound[]
}

export interface Golf_SlashGolfAPI_Schedule {
  _id: string
  orgId: string
  year: string
  schedule: SlashGolf_Tournament[]
  timestamp: string
}

export interface SlashGolf_Tournament {
  tournId: string
  name: string
  date: SlashGolf_TournamentDate
  format?: string
  purse?: number
  winnersShare?: number
  fedexCupPoints?: number
}

export interface SlashGolf_TournamentDate {
  start: string
  end: string
  weekNumber: string | number
}

export interface Golf_SlashGolfAPI_Stats {
  _id: string
  name: string
  year: string
  weekNum: number
  rankings: SlashGolf_PlayerRanking[]
  timestamp: string
}

export interface SlashGolf_PlayerRanking {
  lastName: string
  firstName: string
  fullName: string
  playerId: string
  rank: number
  previousRank: number
  events: number
  totalPoints: number
  avgPoints: number
  pointsLost: number
  pointsGained: number
  pointsBehind?: string
}

export interface Golf_SlashGolfAPI_Leaderboard {
  _id: string
  orgId: string
  year: string
  tournId: string
  status: string
  roundId: number
  roundStatus: string
  lastUpdated: string
  timestamp: string
  cutLines?: SlashGolf_CutLine[]
  leaderboardRows: SlashGolf_LeaderboardRow[]
  teams?: SlashGolf_LeaderboardTeams[]
  // Team match play competitions only e.g. Presidents Cup, Ryder Cup
  rounds?: SlashGolf_MatchPlayRound[]
}

export interface SlashGolf_LeaderboardTeams {
  teamId: string
  name: string
  totalScore: string
  position: string
}

export interface SlashGolf_CutLine {
  cutCount: number
  cutScore: string
}

export interface SlashGolf_LeaderboardRow {
  lastName: string
  firstName: string
  playerId: string
  isAmateur: boolean
  courseId: string
  status: string
  position: string
  total: string
  currentRoundScore: string
  totalStrokesFromCompletedRounds: string
  currentHole: number
  startingHole: number
  roundComplete: boolean
  rounds: SlashGolf_Round[]
  thru: string
  currentRound: number
  teeTime: string
  teeTimeTimestamp: string
  players: {
    playerId: string
    firstName: string
    lastName: string
    isAmateur: boolean
  }[]
  //Team match play competitions only e.g. Presidents Cup, Ryder Cup
  teamId?: string
  teamScore?: number
}

export interface SlashGolf_Round {
  scoreToPar: string
  roundId: number
  strokes: number
  courseId: string
  courseName: string
}

// Team match play competitions only e.g. Presidents Cup, Ryder Cup
export interface SlashGolf_MatchPlayRound {
  roundId: number
  format: string
  matches: SlashGolf_MatchPlayMatch[]
}

export interface SlashGolf_MatchPlayMatch {
  matchId: number
  status: string
  currentScore: string
  finalScore: string
  teeTime?: string
  matchLeader: string
  matchWinner: string
  teams: SlashGolf_MatchPlayTeam[]
}

export interface SlashGolf_MatchPlayTeam {
  teamId: string
  country: string
  players: SlashGolf_MatchPlayPlayer[]
}

export interface SlashGolf_MatchPlayPlayer {
  playerId: string
  firstName: string
  lastName: string
  displayName: string
  shortName: string
  results: SlashGolf_MatchPlayPlayerResults
  color: string
}

export interface SlashGolf_MatchPlayPlayerResults {
  wins: string
  losses: string
  ties: string
  total: string
}
