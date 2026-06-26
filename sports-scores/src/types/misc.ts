import { Match as BracketMatch } from "@/components/bracket/types"
import type {
  PlayoffPictureConfig,
  PlayoffPictureGroup,
} from "@/types/playoff-picture"
import { SlashGolf_Tournament } from "./golf"
import { Sofascore_Event, Sofascore_Stage } from "./sofascore"

/**
 * Generic Types
 */

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Date | undefined
    ? T[P]
    : NonNullable<T[P]> extends (infer U)[]
      ? DeepPartial<U>[]
      : T[P] extends object | undefined
        ? DeepPartial<NonNullable<T[P]>>
        : T[P]
}

export type TeamScoreDetails = {
  id: string
  img?: string | string[]
  score: string | string[]
  name: string
  winDrawLoss?: string
  slug?: string
}

export type TVDetails = {
  channel: TVChannel
  startTime?: Date
  endTime?: Date
}

export type MatchSummary = {
  id: string
  startDate: Date
  endDate?: Date
  sport: string
  venue?: string
  status: MatchStatus
  summaryText: string
  otherDetail?: string
  competitorDetails: TeamScoreDetails[]
  roundLabel?: string
  timer?: string | Date
  timerDisplayColour?: "green" | "yellow" | "gray" | undefined
  matchSlug?: string
  leagueName?: string
  leagueImg?: string
  leagueSlug?: string
  winner?: number
  leagueId?: string
  seasonId?: string
  dataverseGUID?: string
  cardVariant: CardVariant
  tv?: TVDetails[]
}

export interface FixtureRound {
  matches: MatchSummary[]
  roundLabel: string
  byes?: { name?: string; img?: string }[]
  roundSlug?: string
}

export type LadderRow = {
  teamId: string | number
  teamName: string
  teamLogo?: string | string[]
  teamColour?: string
  position: number | string
  [key: string]: string | number | undefined | string[]
}

export type LadderPlacingCategory = {
  position: number[]
  label: string
  colour?: string
}

export interface SportsLadder {
  tableName?: string
  headings: string[]
  data: LadderRow[]
  placingCategories?: LadderPlacingCategory[]
}

export type LadderGroupConfig = {
  groupFilter?: (tableName: string) => boolean
  placingCategories?: LadderPlacingCategory[]
  headings?: string[]
  label?: string
}

export type LadderConfig = {
  ladderGroup: LadderGroupConfig[]
  playoffPictureConfig?: PlayoffPictureConfig
}

export type TVChannelConfig = {
  channel: TVChannel
  startTime?: (date: Date) => Date
  endTime?: (date: Date) => Date
  tvFilter?: (
    date: Date,
    event:
      | Sofascore_Event
      | Sofascore_Stage
      | SlashGolf_Tournament
      | MatchSummary,
  ) => boolean
}

export type TVConfig = {
  channels: TVChannelConfig[]
}

export type LeagueSeasonConfig = {
  name: string
  slug: string
  icon?: string
  seasons: {
    name: string
    slug: string
    ladderConfig?: LadderConfig
    tvguide?: TVConfig
  }[]
  display?: DisplayTypes
  externalURL?: string
  byes?: {
    name: string
    img: string
  }[]
  excludeFromToday?: boolean
}

export type ClientLeagueSeasonConfig = Omit<LeagueSeasonConfig, "seasons"> & {
  seasons: Omit<
    LeagueSeasonConfig["seasons"][number],
    "ladderConfig" | "tvguide"
  >[]
}

/**
 * Service Interface
 */

export interface SportService {
  matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null>
  matchesByDate(
    date: Date,
    leagueId?: string,
    seasonId?: string,
  ): Promise<Matches | null>
  matchesByTeam(teamId: string): Promise<Matches | null>
  matchDetails(
    matchId: string,
    leagueId?: string,
    seasonId?: string,
  ): Promise<MatchDetail | null>
  standings(leagueId: string, seasonId: string): Promise<Standings | null>
  brackets(leagueId: string, seasonId: string): Promise<Brackets | null>
}

/**
 * Service Response Types
 */

export interface Matches {
  fixtures: FixtureRound[]
  currentRound: string
}

export interface TeamMatchDetail {
  matchDetails: {
    homeTeam: TeamScoreDetails
    awayTeam: TeamScoreDetails
    status: string
  }
  scoreBreakdown: PeriodScore[]
  scoreEvents?: ScoreDifference[]
}

export interface StageMatchDetail {
  standings: LadderGroup[]
}

export type MatchDetail = TeamMatchDetail | StageMatchDetail

export type PeriodScore = {
  teams: { home: { score: number | string }; away: { score: number | string } }
  periodName: string
}

export type ScoreDifference = { event: string; difference: number }

export interface LadderGroup {
  label?: string
  tables: SportsLadder[]
}

export interface Standings {
  standings: LadderGroup[]
  playoffPicture?: PlayoffPictureGroup[]
}

export interface Brackets {
  brackets: {
    id: number
    name: string
    currentRound: number
    matches: BracketMatch[]
  }[]
}

/**
 * Enums
 */

export enum SPORT {
  ALL_SPORTS = "all-sports",
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

export enum MatchStatus {
  LIVE = "LIVE",
  UPCOMING = "UPCOMING",
  COMPLETED = "COMPLETED",
}

export enum CardVariant {
  TENNIS = "tennis",
  SESSION = "session",
  DEFAULT = "default",
}

export enum DisplayTypes {
  ROUND = "round",
  DATE = "date",
  LEAGUE = "league",
}

export enum TVChannel {
  KAYO = "Kayo",
  NINE = "9",
  NINE_NOW = "9 Now",
  NINE_GEM = "9 Gem",
  NINE_GO = "9 Go",
  STAN_SPORT = "Stan Sport",
  SEVEN = "7",
  SEVEN_PLUS = "7 Plus",
  SEVEN_MATE = "7 Mate",
  TEN = "10",
  TEN_PLAY = "10 Play",
  TEN_BOLD = "10 Bold",
  PARAMOUNT_PLUS = "Paramount+",
  ABC = "ABC",
  ABC_IVIEW = "ABC iView",
  SBS = "SBS",
  SBS_ON_DEMAND = "SBS On Demand",
  ESPN = "ESPN",
  DISNEY_PLUS = "Disney+",
  BEIN_SPORTS = "beIN Sports",
  DAZN = "DAZN",
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
  Palestine = "ps",
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
  Wales = "gb-wls",
  WallisAndFutuna = "wf",
  WesternSahara = "eh",
  Yemen = "ye",
  Zambia = "zm",
  Zimbabwe = "zw",
}
