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
  league: {
    id: number;
    name: string;
    season: string;
    logo: string;
    country: {
      name: string;
      code: string;
      flag: string;
    };
  };
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

interface NFLStandingsResponse extends APISportsResponse {
  response: NFLStanding[];
}

type NFLStanding = {
  position: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  pts: number;
  games: {
    played: number;
    win: number;
    drawn: number;
    lost: number;
  };
  points: {
    for: number;
    against: number;
  };
  last_5: string;
};
*/
