export interface APISportsResponse {
  get: string;
  parameters: {
    season: string;
    league: string;
  };
  errors: any[] | APISportsErrors;
  results: number;
}

export interface APISportsErrors {
  rateLimit?: string;
  requests?: string;
  token?: string;
}

export interface APISportsStatus extends APISportsResponse {
  paging: {
    current: number;
    total: number;
  };
  response: APISportsStatusDetails;
}

export type APISportsStatusDetails = {
  account?: {
    firstname: string;
    lastname: string;
    email: string;
  };
  subscription?: {
    plan: string;
    end: string;
    active: boolean;
  };
  requests?: {
    current: number;
    limit_day: number;
  };
};

type NavButtonGroupProps = {
  label: string;
  link: any;
}[];

export type TeamScoreDetails = {
  img?: string;
  score: string;
  name: string;
  winDrawLoss?: string;
};

export type MatchSummary = {
  id: number;
  startDate: Date;
  endDate?: Date;
  sport: string;
  venue: string;
  status: MatchStatus;
  summaryText: string;
  otherDetail?: string;
  homeDetails: TeamScoreDetails;
  awayDetails: TeamScoreDetails;
  roundLabel?: string;
  timer: string;
  seriesName?: string;
  matchSlug?: string; // Primarily used in cricket to get match details
  seriesSlug?: string; // Used to navigate to cricket series
  winDrawLoss?: { win: string; draw: string; loss: string };
};

export type MatchStatus = "LIVE" | "UPCOMING" | "COMPLETED";

export interface SportsmonksCricket {
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

export type CountryFlagCode =
  | "AD"
  | "AE"
  | "AF"
  | "AG"
  | "AI"
  | "AL"
  | "AM"
  | "AO"
  | "AQ"
  | "AR"
  | "AS"
  | "AT"
  | "AU"
  | "AW"
  | "AX"
  | "AZ"
  | "BA"
  | "BB"
  | "BD"
  | "BE"
  | "BF"
  | "BG"
  | "BH"
  | "BI"
  | "BJ"
  | "BL"
  | "BM"
  | "BN"
  | "BO"
  | "BQ"
  | "BR"
  | "BS"
  | "BT"
  | "BV"
  | "BW"
  | "BY"
  | "BZ"
  | "CA"
  | "CC"
  | "CD"
  | "CF"
  | "CG"
  | "CH"
  | "CI"
  | "CK"
  | "CL"
  | "CM"
  | "CN"
  | "CO"
  | "CR"
  | "CU"
  | "CV"
  | "CW"
  | "CX"
  | "CY"
  | "CZ"
  | "DE"
  | "DJ"
  | "DK"
  | "DM"
  | "DO"
  | "DZ"
  | "EC"
  | "EE"
  | "EG"
  | "EH"
  | "ER"
  | "ES"
  | "ET"
  | "FI"
  | "FJ"
  | "FM"
  | "FO"
  | "FR"
  | "GA"
  | "GB"
  | "GD"
  | "GE"
  | "GF"
  | "GG"
  | "GH"
  | "GI"
  | "GL"
  | "GM"
  | "GN"
  | "GP"
  | "GQ"
  | "GR"
  | "GT"
  | "GU"
  | "GW"
  | "GY"
  | "HK"
  | "HM"
  | "HN"
  | "HR"
  | "HT"
  | "HU"
  | "ID"
  | "IE"
  | "IL"
  | "IM"
  | "IN"
  | "IO"
  | "IQ"
  | "IR"
  | "IS"
  | "IT"
  | "JE"
  | "JM"
  | "JO"
  | "JP"
  | "KE"
  | "KG"
  | "KH"
  | "KI"
  | "KM"
  | "KN"
  | "KP"
  | "KR"
  | "KW"
  | "KY"
  | "KZ"
  | "LA"
  | "LB"
  | "LC"
  | "LI"
  | "LK"
  | "LR"
  | "LS"
  | "LT"
  | "LU"
  | "LV"
  | "LY"
  | "MA"
  | "MC"
  | "MD"
  | "ME"
  | "MF"
  | "MG"
  | "MH"
  | "MK"
  | "ML"
  | "MM"
  | "MN"
  | "MO"
  | "MP"
  | "MQ"
  | "MR"
  | "MS"
  | "MT"
  | "MU"
  | "MV"
  | "MW"
  | "MX"
  | "MY"
  | "MZ"
  | "NA"
  | "NC"
  | "NE"
  | "NF"
  | "NG"
  | "NI"
  | "NL"
  | "NO"
  | "NP"
  | "NR"
  | "NU"
  | "NZ"
  | "OM"
  | "PA"
  | "PE"
  | "PF"
  | "PG"
  | "PH"
  | "PK"
  | "PL"
  | "PM"
  | "PN"
  | "PR"
  | "PT"
  | "PW"
  | "PY"
  | "QA"
  | "RE"
  | "RO"
  | "RS"
  | "RU"
  | "RW"
  | "SA"
  | "SB"
  | "SC"
  | "SD"
  | "SE"
  | "SG"
  | "SH"
  | "SI"
  | "SJ"
  | "SK"
  | "SL"
  | "SM"
  | "SN"
  | "SO"
  | "SR"
  | "SS"
  | "ST"
  | "SV"
  | "SX"
  | "SY"
  | "SZ"
  | "TC"
  | "TD"
  | "TF"
  | "TG"
  | "TH"
  | "TJ"
  | "TK"
  | "TL"
  | "TM"
  | "TN"
  | "TO"
  | "TR"
  | "TT"
  | "TV"
  | "TZ"
  | "UA"
  | "UG"
  | "UM"
  | "US"
  | "UY"
  | "UZ"
  | "VA"
  | "VC"
  | "VE"
  | "VG"
  | "VI"
  | "VN"
  | "VU"
  | "WF"
  | "WS"
  | "YE"
  | "YT"
  | "ZA"
  | "ZM"
  | "ZW"
  // Additional codes used by FlagsAPI
  | "AH"
  | "AK"
  | "AN"
  | "EU"
  | "IC"
  | "NY"
  | "XK"
  // Fallback
  | "/vercel.svg";
