import { SportsTable, TeamMatchDetail } from "./misc"
import { Sofascore_Player, Sofascore_Team } from "./sofascore"

export type CricketOverIncident = {
  over: number
  bowlers: string[]
  batters: string[]
  runs: number
  teamScore: string
  balls: string[]
}

export type CricketInningIncident = {
  inningLabel: string
  inningIncidents: CricketOverIncident[]
}

export type CricketMatchDetails = TeamMatchDetail & {
  matchScorecard: CricketScorecardPage
  matchIncidents?: CricketInningIncident[]
}

export type CricketScorecardBatProps = {
  batters: {
    name: string
    image?: string
    runs: string
    balls: string
    strikeRate: string
    dismissalText?: string
  }[]
  total: number
  overs: number
  wickets: number
  extras: {
    total: number
    byes: number
    legbyes: number
    wides: number
    noballs: number
  }
  runRate: string
}

export type CricketScorecardBowlProps = {
  overs: number
  runs: number
  wickets: number
  economy: number
  image?: string
  name: string
}[]

export type CricketScorecardInning = {
  inningLabel: string
  inningBatters: CricketScorecardBatProps
  inningBowlers: CricketScorecardBowlProps
  fow: SportsTable
  partnerships: SportsTable
}

export type CricketScorecardPage = {
  innings: CricketScorecardInning[]
  matchState: "LIVE" | "COMPLETED"
}

export interface Sofascore_Cricket_MatchInnings_Response {
  innings: Sofascore_Cricket_Inning[]
}

export interface Sofascore_Cricket_Incidents_Response {
  incidents: Sofascore_Cricket_Incident[]
}

export interface Sofascore_Cricket_IncidentPlayer extends Sofascore_Player {
  gender: string
  sofascoreId: string
  firstName?: string
  lastName?: string
}

export interface Sofascore_Cricket_Incident {
  number: number
  over: number
  ball: number
  runs: number
  zone?: string
  angle?: number
  length?: number
  score: string
  scored: boolean
  wicket: boolean
  missed: boolean
  bowlDetail?: string
  batsman: Sofascore_Cricket_IncidentPlayer
  bowler: Sofascore_Cricket_IncidentPlayer
  fielder?: Sofascore_Cricket_IncidentPlayer
  ballDetails: {
    pitchHit?: {
      x: number
      y: number
    }
  }
  commentary?: string
  id: number
  time: number
  inningNumber: number
  battingTeamId: number
  incidentClassLabel: string
  incidentClassColor: string
  totalRuns: number
  incidentClass: string
  incidentType: "ball"
}

interface Sofascore_Cricket_BowlingLine {
  player: Sofascore_Player
  playerName: string
  over: number
  maiden: number
  run: number
  wicket: number
  wide: number
  noBall: number
}

interface Sofascore_Cricket_BattingLine {
  player: Sofascore_Player
  playerName: string
  score: number
  balls: number
  s4: number
  s6: number
  fowScore?: number
  fowOver?: number
  wicketBowler?: Sofascore_Player
  wicketBowlerName?: string
  wicketCatch?: Sofascore_Player
  wicketCatchName?: string
  wicketTypeId: number
  wicketTypeName: string
}

interface Sofascore_Cricket_Partnership {
  player1: Sofascore_Player
  player2: Sofascore_Player
  score: number
  balls: number
}

export interface Sofascore_Cricket_Inning {
  number: number
  battingTeam: Sofascore_Team
  bowlingTeam: Sofascore_Team
  score: number
  wickets: number
  overs: number
  extra: number
  wide: number
  noBall: number
  bye: number
  legBye: number
  penalty: number
  id: number
  bowlingLine: Sofascore_Cricket_BowlingLine[]
  battingLine: Sofascore_Cricket_BattingLine[]
  partnerships: Sofascore_Cricket_Partnership[]
}

/**
 * LiveScore Types
 */

/*
// Define a reusable type for a team
export interface Team {
  Nm: string
  ID: string
  Abr: string
  tbd: number
  Gd: number
  Pids: { [key: string]: string[] }
  HasVideo: boolean
  TO?: number
}

// Define a reusable type for an event
export interface Event {
  Eid: string
  Pids: { [key: string]: string }
  Sids: { [key: string]: string }
  Tr1?: string
  Tr2?: string
  Tr1C1?: number
  Tr2C1?: number
  Tr1C2?: number
  Tr2C2?: number
  Tr1CW1?: number
  Tr2CW1?: number
  Tr1CW2?: number
  Tr2CW2?: number
  Tr1CD1?: number
  Tr2CD1?: number
  Tr1CD2?: number
  Tr2CD2?: number
  Tr1CO1?: number
  Tr2CO1?: number
  Tr1CO2?: number
  Tr2CO2?: number
  T1: Team[]
  T2: Team[]
  Eps: string
  Esid: number
  EpsL: string
  Epr: number
  Ecov: number
  ErnInf?: string
  Et: number
  EtTx: string
  ECo: string
  Ebat?: number
  TPa: number
  TCho: number
  Esd: number
  Ese: number
  Exd: number
  LuUT: number
  EO: number
  EOX: number
  Ehid: number
  Spid: number
  Pid: number
}

// Define a reusable type for league tables
export interface LeagueTable {
  L: {
    Tables: {
      LTT: number
      name?: string
      team: {
        rnk: number
        Tid: string
        win: number
        winn: string
        wot: number
        Tnm: string
        lst: number
        lstn: string
        lreg: number
        lot: number
        lap: number
        drw: number
        drwn: string
        gf: number
        ga: number
        gd: number
        ptsn: string
        Ipr: number
        pts: number
        pld: number
        nr: string
        nrr: string
        bab: string
        bob: string
        td: string
      }[]
      phrX: any[]
    }[]
  }[]
}

export interface Cricket_LiveScoreAPI_MatchesListByDate {
  Stages: {
    Sid: string
    Snm: string
    Scd: string
    Cnm: string
    CnmT: string
    Csnm: string
    Ccd: string
    Scu: number
    Events: Event[]
  }[]
}

export interface Cricket_LiveScoreAPI_LeaguesListPopular {
  Stages: {
    Sid: string
    Snm: string
    Sds: string
    Scd: string
    Cnm: string
    CnmT: string
    Ccd: string
    Cid: string
    Scu: number
    Spid: number
  }[]
}

export interface Cricket_LiveScoreAPI_TeamDetails {
  Nm: string
  ID: string
  tbd: number
  Abr: string
  Pids: { [key: string]: string[] }
  HasVideo: boolean
  national: boolean
  HasSquad: boolean
  TO: number
  Stages: {
    Sid: string
    Snm: string
    Sds: string
    Scd: string
    Cid: string
    Cnm: string
    CnmT: string
    Csnm: string
    Ccd: string
    Scu: number
    Chi: number
    Shi: number
    Spid: number
    Tid: string
    Sids: { [key: string]: string }
    Events: Event[]
  }[]
}

export interface Cricket_LiveScoreAPI_MatchesGetInnings {
  Eid: string
  SDInn: {
    Pt: number
    Wk: number
    Ov: number
    Ti: string
    Tn: number
    Inn: number
    Rr: number
    Ex: number
    B: number
    LB: number
    NB: number
    WB: number
    Pen: number
    Bat: {
      Pid: number
      Lp: number
      R: number
      $4: number
      $6: number
      B: number
      Bid: number
      Fid: number
      Sr: number
      LpTx: string
      A: number
      Pl: number
    }[]
    Bow: {
      Pid: number
      Ov: number
      Md: number
      R: number
      Wk: number
      NB: number
      WB: number
      Er: number
      A: number
    }[]
    FoW: {
      Pid: number
      Bid: number
      R: number
      B: number
      Wk: number
      WkN: number
      Co: string
    }[]
    Com: {
      Ov: number
      Aid: number
      Oid: number
      T: string
      S: string
      Sv?: string
    }[]
    Ovr: {
      OvN: number
      Onm: string
      R: number
      Wk: number
      OvS?: string
      OvT: string[]
    }[]
  }[]
  Prns: {
    Pid: string
    Fn: string
    Ln: string
    Snm: string
  }[]
}

export interface Cricket_LiveScoreAPI_MatchesGetScoreBoard {
  Eid: string
  Pids: { [key: string]: string }
  Sids: { [key: string]: string }
  Tr1: string
  Tr2: string
  Tr1C1: number
  Tr2C1: number
  Tr1C2: number
  Tr2C2: number
  Tr1CW1: number
  Tr2CW1: number
  Tr1CW2: number
  Tr2CW2: number
  Tr2CD1: number
  Tr1CD1: number
  Tr2CD2: number
  Tr1CD2: number
  Tr1CO1: number
  Tr2CO1: number
  Tr1CO2: number
  Tr2CO2: number
  T1: Team[]
  T2: Team[]
  Venue: {
    id: string
    Vnm: string
    Vneut: number
  }
  Eps: string
  Esid: number
  EpsL: string
  Epr: number
  Ecov: number
  Et: number
  EtTx: string
  ECo: string
  TPa: number
  TCho: number
  Esd: number
  Ese: number
  Exd: number
  LuUT: number
  Eact: number
  EO: number
  EOX: number
  LuC: number
  Ehid: number
  Spid: number
  Stg: {
    Sid: string
    Snm: string
    Scd: string
    Cid: string
    Cnm: string
    CnmT: string
    Csnm: string
    Ccd: string
    Scu: number
    Chi: number
    Shi: number
    Ccdiso: string
    Sdn: string
  }
  Pid: number
  Eloff: number
}

export interface Cricket_LiveScoreAPI_MatchesListByLeague {
  Stages: {
    Sid: string
    Snm: string
    Scd: string
    Cid: string
    Cnm: string
    CnmT: string
    Csnm: string
    Ccd: string
    Scu: number
    Chi: number
    Shi: number
    hasDraw: boolean
    Events: Event[]
    LeagueTable?: LeagueTable
  }[]
}
*/
