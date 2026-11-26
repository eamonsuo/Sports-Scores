// ── Team identity ──
export type PlayoffPictureTeam = {
  id: string | number
  name: string
  logo?: string
  position?: number
  positionDisplay?: string | number
}

// ── Generic standing row: the normalized input from any data source ──
export type PlayoffPictureStanding<
  T extends Record<string, number> = Record<string, number>,
> = {
  team: PlayoffPictureTeam
  position: number
  played: number
  totalSeasonGames: number
  wins: number
  losses: number
  draws: number
  tiebreakers?: T
}

// ── Config: tells the system how to rank and lay out ──
export type PlayoffPictureConfig = {
  rankingSystem: PlayoffPictureSystem
  pointsPerWin?: number
  pointsPerDraw?: number
  totalSeasonGames: number
  qualifyingPositions: number
  structure: PlayoffPictureStructure
  dataverseGUID?: string
}

export enum PlayoffPictureSystem {
  POINTS = "points",
  PERCENTAGE = "percentage",
}

export enum PlayoffPictureStructure {
  Top8 = "top8",
  Top10 = "top10",
  NFL = "nfl",
  NBA = "nba",
  NHL = "nhl",
  MLB = "mlb",
}

// ── Output types (consumed by the component) ──
export type PlayoffPictureSection = {
  title: string
  teams: PlayoffPictureTeam[] | [PlayoffPictureTeam, PlayoffPictureTeam][]
}

export type PlayoffPictureGroup = {
  conferenceMatches: PlayoffPictureSection[]
  name?: string
  colour?: string
}

// ── Input: grouped standings from any data source ──
export type PlayoffPictureStandingTables = {
  name?: string
  standings: PlayoffPictureStanding[]
}
