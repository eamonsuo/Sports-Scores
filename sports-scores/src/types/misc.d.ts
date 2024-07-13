import { ReactNode } from "react";

interface APISportsResponse {
  get: string;
  parameters: {
    season: string;
    league: string;
  };
  errors: any[];
  results: number;
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

type NavButtonGroupProps = {
  label: string;
  link: any;
}[];

type TeamScoreDetails = {
  img: string;
  score: string;
  name: string;
};

type MatchSummary = {
  id: number;
  startDate: string;
  sport: string;
  venue: string;
  status: string;
  summary: string;
  otherDetail?: string;
  homeDetails: TeamScoreDetails;
  awayDetails: TeamScoreDetails;
  roundLabel?: string;
  timer: string;
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
