interface NFLGamesResponse<T> extends APISportsResponse {
  response: T[];
}

interface NFLGame {
  game: {
    id: number;
    stage: string;
    week: string;
    date: {
      timezone: string;
      date: string;
      time: string;
      timestamp: number;
    };
    venue: {
      name: string | null;
      city: string | null;
    };
    status: {
      short:
        | "NS"
        | "Q1"
        | "Q2"
        | "Q3"
        | "Q4"
        | "OT"
        | "FT"
        | "HT"
        | "AOT"
        | "CANC"
        | "PST";
      long:
        | "Not Started"
        | "First Quarter"
        | "Second Quarter"
        | "Third Quarter"
        | "Fourth Quarter"
        | "Overtime"
        | "After Over Time"
        | "Finished"
        | "Halftime"
        | "Cancelled"
        | "Postponed";
      timer: string | null;
    };
  };
  league: NFLLeagueDetails;
  teams: {
    home: {
      id: number;
      name: string | null;
      logo: string;
    };
    away: {
      id: number;
      name: string | null;
      logo: string;
    };
  };
  scores: {
    home: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      overtime: number | null;
      total: number | null;
    };
    away: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      overtime: number | null;
      total: number | null;
    };
  };
}

interface NFLStandingsResponse extends APISportsResponse {
  response: NFLStanding[];
}

type NFLStanding = {
  league: NFLLeagueDetails;
  conference: string;
  division: string;
  position: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  won: number;
  lost: number;
  ties: number;
  points: {
    for: number;
    against: number;
    difference: number;
  };
  records: {
    home: string;
    road: string;
    conference: string;
    division: string;
  };
  streak: string;
  ncaa_conference: {
    won: number | null;
    lost: number | null;
    points: {
      for: number | null;
      against: number | null;
    };
  };
};

type NFLLeagueDetails = {
  id: number;
  name: string;
  season: number;
  logo: string;
  country: {
    name: string;
    code: string;
    flag: string;
  };
};
/*
interface NFLGameQuarters {
  game: {
    id: number;
  };
  quarters: [
    {
      quarter: number;
      teams: {
        home: TeamQuarterStats;
        away: TeamQuarterStats;
      };
    },
  ];
}

type TeamQuarterStats = {
  id: number;
  goals: number;
  behinds: number;
  points: number;
};

interface NFLGameEvents {
  game: {
    id: number;
  };
  events: [
    {
      team: {
        id: number;
      };
      player: {
        id: number;
      };
      period: number;
      minute: number;
      type: "goal" | "behind";
    },
  ];
}


*/
