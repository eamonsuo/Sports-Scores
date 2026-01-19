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
  score: string | string[];
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
  timerDisplayColour?: "green" | "yellow";
  seriesName?: string;
  matchSlug?: string;
  seriesSlug?: string; // Used to navigate to cricket series
  winner?: number;
};

export type MatchStatus = "LIVE" | "UPCOMING" | "COMPLETED";

export interface RoundDetails {
  matches: MatchSummary[];
  roundLabel: string;
  byes?: { name?: string; img?: string }[];
}

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

export enum SPORT {
  AUSSIE_RULES = "aussie-rules",
  BASEBALL = "baseball",
  CRICKET = "cricket",
  AMERICAN_FOOTBALL = "american-football",
  MOTORSPORT = "motorsport",
  RUGBY_LEAGUE = "rugby-league",
  GOLF = "golf",
  OLYMPICS = "olympics",
  FOOTBALL = "football",
  SURFING = "surfing",
  TENNIS = "tennis",
  BASKETBALL = "basketball",
  ICE_HOCKEY = "ice-hockey",
  NETBALL = "netball",
  RUGBY_UNION = "rugby-union",
  CYCLING = "cycling",
  DARTS = "darts",
}

export enum CountryFlagCode {
  Afghanistan = "af",
  AlandIslands = "ax",
  Albania = "al",
  Alaska = "ak",
  Algeria = "dz",
  AmericanSamoa = "as",
  Andorra = "ad",
  Angola = "ao",
  Anguilla = "ai",
  Antarctica = "aq",
  AntarcticaHeard = "ah",
  AntiguaAndBarbuda = "ag",
  Argentina = "ar",
  Armenia = "am",
  Aruba = "aw",
  Australia = "au",
  Austria = "at",
  Azerbaijan = "az",
  Bahamas = "bs",
  Bahrain = "bh",
  Bangladesh = "bd",
  Barbados = "bb",
  Belarus = "by",
  Belgium = "be",
  Belize = "bz",
  Benin = "bj",
  Bermuda = "bm",
  Bhutan = "bt",
  Bolivia = "bo",
  BonaireSintEustatiusSaba = "bq",
  BosniaAndHerzegovina = "ba",
  Botswana = "bw",
  BouvetIsland = "bv",
  Brazil = "br",
  BritishIndianOceanTerritory = "io",
  BritishVirginIslands = "vg",
  BruneiDarussalam = "bn",
  Bulgaria = "bg",
  BurkinaFaso = "bf",
  Burundi = "bi",
  CaboVerde = "cv",
  Cambodia = "kh",
  Cameroon = "cm",
  Canada = "ca",
  CanaryIslands = "ic",
  CaymanIslands = "ky",
  CentralAfricanRepublic = "cf",
  Chad = "td",
  Chile = "cl",
  China = "cn",
  ChristmasIsland = "cx",
  CocosKeelingIslands = "cc",
  Colombia = "co",
  Comoros = "km",
  Congo = "cg",
  CongoDemocraticRepublic = "cd",
  CookIslands = "ck",
  CostaRica = "cr",
  CoteDIvoire = "ci",
  Croatia = "hr",
  Cuba = "cu",
  Curacao = "cw",
  Cyprus = "cy",
  Czechia = "cz",
  Denmark = "dk",
  Djibouti = "dj",
  Dominica = "dm",
  DominicanRepublic = "do",
  Ecuador = "ec",
  Egypt = "eg",
  ElSalvador = "sv",
  England = "gb-eng",
  EquatorialGuinea = "gq",
  Eritrea = "er",
  Estonia = "ee",
  Eswatini = "sz",
  Ethiopia = "et",
  EuropeanUnion = "eu",
  FaroeIslands = "fo",
  Fiji = "fj",
  Finland = "fi",
  France = "fr",
  FrenchGuiana = "gf",
  FrenchPolynesia = "pf",
  FrenchSouthernTerritories = "tf",
  Gabon = "ga",
  Gambia = "gm",
  Georgia = "ge",
  Germany = "de",
  Ghana = "gh",
  Gibraltar = "gi",
  Greece = "gr",
  Greenland = "gl",
  Grenada = "gd",
  Guadeloupe = "gp",
  Guam = "gu",
  Guatemala = "gt",
  Guernsey = "gg",
  Guinea = "gn",
  GuineaBissau = "gw",
  Guyana = "gy",
  Haiti = "ht",
  HeardIslandAndMcDonaldIslands = "hm",
  HolySee = "va",
  Honduras = "hn",
  HongKong = "hk",
  Hungary = "hu",
  Iceland = "is",
  India = "in",
  Indonesia = "id",
  Iran = "ir",
  Iraq = "iq",
  Ireland = "ie",
  IsleOfMan = "im",
  Israel = "il",
  Italy = "it",
  Jamaica = "jm",
  Japan = "jp",
  Jersey = "je",
  Jordan = "jo",
  Kazakhstan = "kz",
  Kenya = "ke",
  Kiribati = "ki",
  KoreaNorth = "kp",
  KoreaSouth = "kr",
  Kosovo = "xk",
  Kuwait = "kw",
  Kyrgyzstan = "kg",
  Laos = "la",
  Latvia = "lv",
  Lebanon = "lb",
  Lesotho = "ls",
  Liberia = "lr",
  Libya = "ly",
  Liechtenstein = "li",
  Lithuania = "lt",
  Luxembourg = "lu",
  Macao = "mo",
  Madagascar = "mg",
  Malawi = "mw",
  Malaysia = "my",
  Maldives = "mv",
  Mali = "ml",
  Malta = "mt",
  MarshallIslands = "mh",
  Martinique = "mq",
  Mauritania = "mr",
  Mauritius = "mu",
  Mayotte = "yt",
  Mexico = "mx",
  Micronesia = "fm",
  Moldova = "md",
  Monaco = "mc",
  Mongolia = "mn",
  Montenegro = "me",
  Montserrat = "ms",
  Morocco = "ma",
  Mozambique = "mz",
  Myanmar = "mm",
  Namibia = "na",
  Nauru = "nr",
  Nepal = "np",
  Netherlands = "nl",
  NetherlandsAntilles = "an",
  NewCaledonia = "nc",
  NewYork = "ny",
  NewZealand = "nz",
  Nicaragua = "ni",
  Niger = "ne",
  Nigeria = "ng",
  Niue = "nu",
  NorfolkIsland = "nf",
  NorthMacedonia = "mk",
  NorthernIreland = "gb-nir",
  NorthernMarianaIslands = "mp",
  Norway = "no",
  Oman = "om",
  Pakistan = "pk",
  Palau = "pw",
  Panama = "pa",
  PapuaNewGuinea = "pg",
  Paraguay = "py",
  Peru = "pe",
  Philippines = "ph",
  Pitcairn = "pn",
  Poland = "pl",
  Portugal = "pt",
  PuertoRico = "pr",
  Qatar = "qa",
  Reunion = "re",
  Romania = "ro",
  Russia = "ru",
  Rwanda = "rw",
  SaintBarthelemy = "bl",
  SaintHelena = "sh",
  SaintKittsAndNevis = "kn",
  SaintLucia = "lc",
  SaintMartin = "mf",
  SaintPierreAndMiquelon = "pm",
  SaintVincentAndGrenadines = "vc",
  Samoa = "ws",
  SanMarino = "sm",
  SaoTomeAndPrincipe = "st",
  SaudiArabia = "sa",
  Scotland = "gb-sct",
  Senegal = "sn",
  Serbia = "rs",
  Seychelles = "sc",
  SierraLeone = "sl",
  Singapore = "sg",
  SintMaarten = "sx",
  Slovakia = "sk",
  Slovenia = "si",
  SolomonIslands = "sb",
  Somalia = "so",
  SouthAfrica = "za",
  SouthSudan = "ss",
  Spain = "es",
  SriLanka = "lk",
  Sudan = "sd",
  Suriname = "sr",
  SvalbardAndJanMayen = "sj",
  Sweden = "se",
  Switzerland = "ch",
  Syria = "sy",
  Taiwan = "tw",
  Tajikistan = "tj",
  Tanzania = "tz",
  Thailand = "th",
  TimorLeste = "tl",
  Togo = "tg",
  Tokelau = "tk",
  Tonga = "to",
  TrinidadAndTobago = "tt",
  Tunisia = "tn",
  Turkey = "tr",
  Turkmenistan = "tm",
  TurksAndCaicosIslands = "tc",
  Tuvalu = "tv",
  Uganda = "ug",
  Ukraine = "ua",
  UnitedArabEmirates = "ae",
  UnitedKingdom = "gb",
  UnitedStates = "us",
  UnitedStatesMinorOutlyingIslands = "um",
  Uruguay = "uy",
  USVirginIslands = "vi",
  Uzbekistan = "uz",
  Vanuatu = "vu",
  VaticanCity = "va",
  Venezuela = "ve",
  Vercel = "/vercel.svg",
  Vietnam = "vn",
  Wales = "gb-wal",
  WallisAndFutuna = "wf",
  WesternSahara = "eh",
  Yemen = "ye",
  Zambia = "zm",
  Zimbabwe = "zw",
}
