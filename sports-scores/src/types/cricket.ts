export interface Cricket_LiveScoreAPI_MatchesListByDate {
  Stages: {
    Sid: string;
    Snm: string;
    Scd: string;
    Cnm: string;
    CnmT: string;
    Csnm: string;
    Ccd: string;
    Scu: number;
    Events: {
      Eid: string;
      Pids: { [key: string]: string };
      Media?: {
        [key: string]: {
          eventId: string;
          provider: string;
          type: string;
          thumbnail: string;
          allowedCountries: string[];
        }[];
      };
      Tr1: string;
      Tr2: string;
      Tr1C1?: number;
      Tr2C1?: number;
      Tr1C2?: number;
      Tr2C2?: number;
      Tr1CW1?: number;
      Tr2CW1?: number;
      Tr1CW2?: number;
      Tr2CW2?: number;
      Tr1CD1?: number;
      Tr1CD2?: number;
      Tr2CD1?: number;
      Tr2CD2?: number;
      Tr1CO1?: number;
      Tr2CO1?: number;
      Tr1CO2?: number;
      Tr2CO2?: number;
      T1: {
        ID: string;
        Nm: string;
        Abr: string;
      }[];
      T2: {
        ID: string;
        Nm: string;
        Abr: string;
      }[];
      Eps?: string;
      Esid: number;
      EpsL: string;
      Epr: number;
      Ecov: number;
      ErnInf: string;
      Et: number;
      EtTx: string;
      ECo: string;
      Ebat?: number;
      TPa: number;
      TCho: number;
      Esd: number;
      Ese: number;
      Exd: number;
      EO: number;
      EOX: number;
      Spid: number;
      Pid: number;
    }[];
  }[];
}

export interface Cricket_LiveScoreAPI_LeaguesListPopular {
  Stages: {
    Sid: string;
    Snm: string;
    Sds: string;
    Scd: string;
    Cnm: string;
    CnmT: string;
    Ccd: string;
    Cid: string;
    Scu: number;
    Spid: number;
  }[];
}

export interface Cricket_LiveScoreAPI_TeamDetails {
  Nm: string;
  ID: string;
  tbd: number;
  Abr: string;
  Pids: { [key: string]: string[] };
  HasVideo: boolean;
  national: boolean;
  HasSquad: boolean;
  TO: number;
  Stages: {
    Sid: string;
    Snm: string;
    Sds: string;
    Scd: string;
    Cid: string;
    Cnm: string;
    CnmT: string;
    Csnm: string;
    Ccd: string;
    Scu: number;
    Chi: number;
    Shi: number;
    Spid: number;
    Tid: string;
    Sids: { [key: string]: string };
    Events: {
      Eid: string;
      T1: { Nm: string; ID: string; Abr: string }[];
      T2: { Nm: string; ID: string; Abr: string }[];
      Tr1: string;
      Tr2: string;
      Esid: number;
      Eps: string;
      Epr: number;
      Esd: number;
      Sid: string;
      EO: number;
      EOX: number;
    }[];
  }[];
}

export interface Cricket_LiveScoreAPI_MatchesGetInnings {
  Eid: string;
  SDInn: {
    Pt: number;
    Wk: number;
    Ov: number;
    Ti: string;
    Tn: number;
    Inn: number;
    Rr: number;
    Ex: number;
    B: number;
    LB: number;
    NB: number;
    WB: number;
    Pen: number;
    Bat: {
      Pid: number;
      Lp: number;
      R: number;
      $4: number;
      $6: number;
      B: number;
      Bid: number;
      Fid: number;
      Sr: number;
      LpTx: string;
      A: number;
      Pl: number;
    }[];
    Bow: {
      Pid: number;
      Ov: number;
      Md: number;
      R: number;
      Wk: number;
      NB: number;
      WB: number;
      Er: number;
      A: number;
    }[];
    FoW: {
      Pid: number;
      Bid: number;
      R: number;
      B: number;
      Wk: number;
      WkN: number;
      Co: string;
    }[];
    Com: {
      Ov: number;
      Aid: number;
      Oid: number;
      T: string;
      S: string;
      Sv?: string;
    }[];
    Ovr: {
      OvN: number;
      Onm: string;
      R: number;
      Wk: number;
      OvS?: string;
      OvT: string[];
    }[];
  }[];
  Prns: {
    Pid: string;
    Fn: string;
    Ln: string;
    Snm: string;
  }[];
}

export interface Cricket_LiveScoreAPI_MatchesGetScoreBoard {
  Eid: string;
  Pids: { [key: string]: string };
  Sids: { [key: string]: string };
  Tr1: string;
  Tr2: string;
  Tr1C1: number;
  Tr2C1: number;
  Tr1C2: number;
  Tr2C2: number;
  Tr1CW1: number;
  Tr2CW1: number;
  Tr1CW2: number;
  Tr2CW2: number;
  Tr2CD1: number;
  Tr1CD1: number;
  Tr2CD2: number;
  Tr1CD2: number;
  Tr1CO1: number;
  Tr2CO1: number;
  Tr1CO2: number;
  Tr2CO2: number;
  T1: {
    Nm: string;
    ID: string;
    Abr: string;
    tbd: number;
    Gd: number;
    Pids: { [key: string]: string[] };
    HasVideo: boolean;
    TO: number;
  }[];
  T2: {
    Nm: string;
    ID: string;
    Abr: string;
    tbd: number;
    Gd: number;
    Pids: { [key: string]: string[] };
    HasVideo: boolean;
    TO: number;
  }[];
  Venue: {
    id: string;
    Vnm: string;
    Vneut: number;
  };
  Eps: string;
  Esid: number;
  EpsL: string;
  Epr: number;
  Ecov: number;
  Et: number;
  EtTx: string;
  ECo: string;
  TPa: number;
  TCho: number;
  Esd: number;
  Ese: number;
  Exd: number;
  LuUT: number;
  Eact: number;
  EO: number;
  EOX: number;
  LuC: number;
  Ehid: number;
  Spid: number;
  Stg: {
    Sid: string;
    Snm: string;
    Scd: string;
    Cid: string;
    Cnm: string;
    CnmT: string;
    Csnm: string;
    Ccd: string;
    Scu: number;
    Chi: number;
    Shi: number;
    Ccdiso: string;
    Sdn: string;
  };
  Pid: number;
  Eloff: number;
}
