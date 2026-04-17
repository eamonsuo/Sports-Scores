// ── Team identity ──
export type PlayoffPictureTeam = {
  id: string | number;
  name: string;
  logo?: string;
  position?: number;
  positionDisplay?: string | number;
};

// ── Generic standing row: the normalized input from any data source ──
export type PlayoffPictureStanding<
  T extends Record<string, number> = Record<string, number>,
> = {
  team: PlayoffPictureTeam;
  position: number;
  played: number;
  totalSeasonGames: number;
  wins: number;
  losses: number;
  draws: number;
  tiebreakers?: T;
};

// ── Config: tells the system how to rank and lay out ──
export type PlayoffPictureConfig<
  T extends Record<string, number> = Record<string, number>,
> = {
  rankingSystem: "points" | "percentage";
  pointsPerWin?: number;
  pointsPerDraw?: number;
  totalSeasonGames: number;
  qualifyingPositions: number;
  structure: PlayoffPictureStructure;
  tiebreakerOrder?: (keyof T)[];
  customRankingValue?: (team: PlayoffPictureStanding<T>) => number;
  customSort?: (
    a: PlayoffPictureStanding<T>,
    b: PlayoffPictureStanding<T>,
  ) => number;
};

export enum PlayoffPictureStructure {
  Top8 = "top8",
  Top10 = "top10",
}

// ── Output types (consumed by the component) ──
export type PlayoffPictureSection = {
  title: string;
  teams: PlayoffPictureTeam[] | [PlayoffPictureTeam, PlayoffPictureTeam][];
};

export type PlayoffPictureGroup = {
  conferenceMatches: PlayoffPictureSection[];
  name?: string;
  colour?: string;
};

// ── Input: grouped standings from any data source ──
export type PlayoffPictureStandingsGroup = {
  name?: string;
  standings: PlayoffPictureStanding[];
};
