interface APISportsResponse {
  get: string;
  parameters: {
    season: string;
    league: string;
  };
  errors: any[];
  results: number;
}

interface AFLGamesResponse<T> extends APISportsResponse {
  response: T[];
}

interface AFLGame {
  game: {
    id: number;
  };
  league: {
    id: number;
    season: number;
  };
  date: string;
  time: string;
  timestamp: string;
  timezone: string;
  round: string;
  week: number;
  venue: string;
  attendance: number;
  status: {
    long:
      | "Not Started"
      | "1st Quarter"
      | "2nd Quarter"
      | "3rd Quarter"
      | "4th Quarter"
      | "Quarter Time"
      | "End Of Regulation"
      | "Full Time"
      | "Half Time"
      | "Cancelled"
      | "Postponed";
    short:
      | "NS"
      | "Q1"
      | "Q2"
      | "Q3"
      | "Q4"
      | "QT"
      | "ER"
      | "FT"
      | "HT"
      | "CANC"
      | "PST";
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  scores: {
    home: {
      score: number;
      goals: number;
      behinds: number;
      psgoals: number;
      psbehinds: number;
    };
    away: {
      score: number;
      goals: number;
      behinds: number;
      psgoals: number;
      psbehinds: number;
    };
  };
}

interface AFLGameQuarters {
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

interface AFLGameEvents {
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

interface APISportsStatus extends APISportsResponse {
  paging: {
    current: number;
    total: number;
  };
  response: APISportsStatusDetails;
}

type APISportsStatusDetails = {
  account: {
    firstname: string;
    lastname: string;
    email: string;
  };
  subscription: {
    plan: string;
    end: string;
    active: boolean;
  };
  requests: {
    current: number;
    limit_day: number;
  };
};

interface AFLStandingsResponse extends APISportsResponse {
  response: AFLStanding[];
}

type AFLStanding = {
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

// interface BaseResponse<T> {
//   get: string;
//   reponse: T;
// }

// interface GetQuartersResponseBody {
//   game: string;
// }

// type GetQuartersResponse = BaseResponse<GetQuartersResponse>

type NavButtonGroupProps = {
  label: string;
  link: any;
}[];

type ScoreSummaryCardProps = {
  matchDetails: MatchDetails;
  homeDetails: TeamScoreDetails;
  awayDetails: TeamScoreDetails;
};

type MatchDetails = {
  gameid: number;
  sport: string;
  venue: string;
  status: string;
  summary: string;
  otherDetail?: string;
};

type TeamScoreDetails = {
  img: string;
  score: string;
  name: string;
};

type MatchSummary = {
  id: number;
  startDate: string;
  details: ScoreSummaryCardProps;
};

type APISettings = "status" | "fixtures" | "standings";

interface SportsmonksCricket {
  data: SportsmonksMatchCricket[];
  links: any;
  meta: any;
}

type SportsmonksMatchCricket = {
  resource: string;
  id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  round: string;
  localteam_id: number;
  visitorteam_id: number;
  starting_at: string;
  type: string;
  live: boolean;
  status: string;
  last_period: null | string;
  note: string;
  venue_id: number;
  toss_won_team_id: number;
  winner_team_id: number;
  draw_noresult: null | string;
  first_umpire_id: number;
  second_umpire_id: number;
  tv_umpire_id: number;
  referee_id: number;
  man_of_match_id: number;
  man_of_series_id: null | number;
  total_overs_played: number;
  elected: string;
  super_over: boolean;
  follow_on: boolean;
  localteam_dl_data: {
    score: null | number;
    overs: null | number;
    wickets_out: null | number;
  };
  visitorteam_dl_data: {
    score: null | number;
    overs: null | number;
    wickets_out: null | number;
  };
  rpc_overs: null | number;
  rpc_target: null | number;
  weather_report: any[];
  localteam: {
    resource: string;
    id: number;
    name: string;
    code: string;
    image_path: string;
    country_id: number;
    national_team: boolean;
    updated_at: string;
  };
  visitorteam: {
    resource: string;
    id: number;
    name: string;
    code: string;
    image_path: string;
    country_id: number;
    national_team: boolean;
    updated_at: string;
  };
  runs: Array<{
    resource: string;
    id: number;
    fixture_id: number;
    team_id: number;
    inning: number;
    score: number;
    wickets: number;
    overs: number;
    pp1: null | string;
    pp2: null | string;
    pp3: null | string;
    updated_at: string;
  }>;
  venue: {
    resource: string;
    id: number;
    country_id: number;
    name: string;
    city: string;
    image_path: string;
    capacity: number;
    floodlight: boolean;
    updated_at: string;
  };
};
