import { ScoreBreakdownConfig } from "@/services/sofascore.service"
import {
  DisplayTypes,
  LadderConfig,
  LadderPlacingCategory,
  LeagueSeasonConfig,
  MatchSummary,
  TVChannel,
  TVConfig,
} from "@/types/misc"
import {
  PlayoffPictureStructure,
  type PlayoffPictureConfig,
} from "@/types/playoff-picture"
import { Sofascore_Event } from "@/types/sofascore"
import { RankingList } from "@/types/tennis"
import { TZDate } from "@date-fns/tz/date"
import { addHours } from "date-fns/addHours"
import { resolveSportImage } from "./imageMapping"
import {
  ladderConfigMap,
  stripLeagueSeasonConfig,
  tvGuideConfigCreate,
} from "./projUtils"

export const FALLBACK_IMAGE = "/vercel.svg"

export const RUGBY_LEAGUE_LADDER_HEADINGS = [
  "Team",
  "P",
  "W",
  "D",
  "Diff",
  "Pts",
]
const RUGBY_LEAGUE_MATCH_LENGTH = 1.75 // in hours, used for TV guide end time estimation
export const RUGBY_LEAGUE_CATEGORIES = ["83"] //Rugby League
export const FOOTBALL_CATEGORIES = [
  "34", // Australia
  "1468", // World
  "1467", // Asia
  "1465", // Europe
  "1", // England
  // "1470", // South America
  // "1466", // Africa
  // "1469", // North America
  // "1471", // Oceania
] //Australia, World, Asia, Europe, England, South America, Africa, North America, Oceania
export const FOOTBALL_LADDER_HEADINGS = ["Team", "P", "W", "D", "Diff", "Pts"]
export const FOOTBALL_MATCH_LENGTH = 2 // in hours, used for TV guide end time estimation
export const AUSSIE_RULES_LADDER_HEADINGS = ["Team", "P", "W", "D", "%", "Pts"]
const AUSSIE_RULES_MATCH_LENGTH = 2.75 // in hours, used for TV guide end time estimation
export const AUSSIE_RULES_CATEGORIES = ["87"] //Aussie Rules
export const BASKETBALL_MATCH_LENGTH = 3 // in hours, used for TV guide end time estimation
export const BASKETBALL_CATEGORIES = ["113", "103", "15"] //Australia, International, USA
export const BASKETBALL_LADDER_HEADINGS = ["Team", "P", "W", "L", "PCT"]
export const BASEBALL_MATCH_LENGTH = 3 // in hours, used for TV guide end time estimation
export const BASEBALL_CATEGORIES = ["1701", "1543", "1374"] //Australia, World, USA
export const BASEBALL_LADDER_HEADINGS = ["Team", "P", "W", "L", "PCT"]
export const ICE_HOCKEY_MATCH_LENGTH = 3 // in hours, used for TV guide end time estimation
export const ICE_HOCKEY_CATEGORIES = ["1161", "56", "37"] //Australia, International, USA
export const ICE_HOCKEY_LADDER_HEADINGS = [
  "Team",
  "P",
  "W",
  "OTL",
  // "L",
  "Diff",
  "Pts",
]
export const RUGBY_UNION_CATEGORIES = ["82", "1456"] //Rugby Union, Rugby Sevens
export const RUGBY_UNION_LADDER_HEADINGS = [
  "Team",
  "P",
  "W",
  "D",
  "Diff",
  "BP",
  "Pts",
]
export const AMERICAN_FOOTBALL_MATCH_LENGTH = 4 // in hours, used for TV guide end time estimation
export const AMERICAN_FOOTBALL_CATEGORIES = ["1370"] //USA
export const AMERICAN_FOOTBALL_LADDER_HEADINGS = ["Team", "P", "W", "L", "D"]
export const GOLF_FEDEX_HEADINGS = ["Player", "Total", "Behind"]
export const GOLF_OWGR_HEADINGS = ["Player", "Total", "Prev"]
export const GOLF_LEADERBOARD_HEADINGS = ["Player", "Total", "Thru", "Rnd"]

export const SCORE_BREAKDOWN_HALVES_CONFIG: ScoreBreakdownConfig = {
  periodNames: ["1st Half", "2nd Half"],
  overtimeName: "Extra Time",
}

export const SCORE_BREAKDOWN_QUARTERS_CONFIG: ScoreBreakdownConfig = {
  periodNames: ["Q1", "Q2", "Q3", "Q4"],
  overtimeName: "OT",
}

export const SCORE_BREAKDOWN_INNINGS_CONFIG: ScoreBreakdownConfig = {
  periodNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  overtimeName: "EI",
}

export const SCORE_BREAKDOWN_PERIODS_CONFIG: ScoreBreakdownConfig = {
  periodNames: ["P1", "P2", "P3"],
  overtimeName: "OT",
}

const RUGBY_LEAGUE_TOP_8_PLAYOFF_CONFIG: PlayoffPictureConfig = {
  rankingSystem: "points",
  pointsPerWin: 2,
  pointsPerDraw: 1,
  totalSeasonGames: 24,
  qualifyingPositions: 8,
  structure: PlayoffPictureStructure.Top8,
}

const TOP_8_SECOND_CHANCE_PLACING: LadderPlacingCategory[] = [
  { label: "Finals - Second Chance", position: [1, 2, 3, 4] },
  { label: "Finals", position: [5, 6, 7, 8] },
]

const TOP_10_SECOND_CHANCE_PLACING: LadderPlacingCategory[] = [
  { label: "Finals - Second Chance", position: [1, 2, 3, 4] },
  { label: "Finals", position: [5, 6] },
  { label: "Finals - Wildcard Round", position: [7, 8, 9, 10] },
]

// ── Ladder Config Constants ──────────────────────────────────────────────────

// Shared across multiple sports
const FINALS_TOP_4_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Finals", position: [1, 2, 3, 4] },
]

const FINALS_TOP_5_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Finals", position: [1, 2, 3, 4, 5] },
]

const FINALS_TOP_6_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Finals", position: [1, 2, 3, 4, 5, 6] },
]

const FINALS_TOP_8_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Finals", position: [1, 2, 3, 4, 5, 6, 7, 8] },
]

// Cricket
const CRICKET_PLAYOFFS_TOP_4_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Playoffs", position: [1, 2, 3, 4] },
]

// Rugby League
const NRL_TOP_8_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      placingCategories: TOP_8_SECOND_CHANCE_PLACING,
    },
  ],
  playoffPictureConfig: RUGBY_LEAGUE_TOP_8_PLAYOFF_CONFIG,
}

const RL_WORLD_CUP_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Quarterfinals", position: [1, 2] },
]

// AFL
const AFL_TOP_10_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      placingCategories: TOP_10_SECOND_CHANCE_PLACING,
    },
  ],
  playoffPictureConfig: {
    rankingSystem: "points",
    pointsPerWin: 4,
    pointsPerDraw: 2,
    totalSeasonGames: 23,
    qualifyingPositions: 10,
    structure: PlayoffPictureStructure.Top10,
  },
}

const AFL_TOP_8_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      placingCategories: TOP_8_SECOND_CHANCE_PLACING,
    },
  ],
  playoffPictureConfig: {
    rankingSystem: "points",
    pointsPerWin: 4,
    pointsPerDraw: 2,
    totalSeasonGames: 23,
    qualifyingPositions: 8,
    structure: PlayoffPictureStructure.Top8,
  },
}

// Football - European domestic (shared: CL 1-4, EL 5, Conf 6, Rel 18-20)
const EUROPEAN_DOMESTIC_SHARED_LADDER: LadderPlacingCategory[] = [
  { label: "Champions League", position: [1, 2, 3, 4] },
  { label: "Europa League", position: [5] },
  { label: "Conference League", position: [6] },
  { label: "Relegation", position: [18, 19, 20], colour: "bg-red-500" },
]

const WSL_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Champions League - League Phase", position: [1, 2] },
  { label: "Champions League - Third Round Qualifiers", position: [3] },
  { label: "Relegation Play-off", position: [12], colour: "bg-red-500" },
]

const CHAMPIONSHIP_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Premier League Promotion", position: [1, 2] },
  { label: "Promotion Playoffs", position: [3, 4, 5, 6] },
  { label: "Relegation", position: [22, 23, 24], colour: "bg-red-500" },
]

const FIFA_WORLD_CUP_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      label: "Groups",
      groupFilter: (tableName) => tableName.includes("Group"),
      placingCategories: [
        { label: "Round of 32", position: [1, 2] },
        {
          label: "Possible Round of 32 - Best 8/12 3rd placed teams",
          position: [3],
        },
      ],
    },
    {
      label: "Third Place Teams",
      groupFilter: (tableName) => !tableName.includes("Group"),
      placingCategories: [
        { label: "Round of 32", position: [1, 2, 3, 4, 5, 6, 7, 8] },
      ],
    },
  ],
}

const UEFA_24_TEAM_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Round of 16 (seeded)", position: [1, 2, 3, 4, 5, 6, 7, 8] },
  {
    label: "Knockout Playoffs (seeded)",
    position: [9, 10, 11, 12, 13, 14, 15, 16],
  },
  {
    label: "Knockout Playoffs (unseeded)",
    position: [17, 18, 19, 20, 21, 22, 23, 24],
  },
]

const UEFA_WOMENS_CL_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Quarter Finals (seeded)", position: [1, 2, 3, 4] },
  { label: "Knockout Playoffs (seeded)", position: [5, 6, 7, 8] },
  { label: "Knockout Playoffs (unseeded)", position: [9, 10, 11, 12] },
]

const MLS_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "CONCACAF Champions Cup", position: [1] },
  { label: "Playoffs", position: [2, 3, 4, 5, 6, 7] },
  { label: "Wild Card", position: [8, 9] },
]

const NWSL_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "CONCACAF Champions Cup", position: [1, 2] },
  { label: "Playoffs", position: [3, 4, 5, 6, 7, 8] },
]

const LIGUE_1_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Champions League", position: [1, 2, 3] },
  { label: "Champions League - Third Round Qualifiers", position: [4] },
  { label: "Europa League", position: [5] },
  { label: "Conference League", position: [6] },
  { label: "Relegation Playoffs", position: [16], colour: "bg-red-300" },
  { label: "Relegation", position: [17, 18], colour: "bg-red-500" },
]

const BUNDESLIGA_LADDER_CONFIG: LadderPlacingCategory[] = [
  { label: "Champions League", position: [1, 2, 3, 4] },
  { label: "Europa League", position: [5] },
  { label: "Conference League", position: [6] },
  {
    label: "Relegation Playoffs",
    position: [16],
    colour: "bg-red-300",
  },
  { label: "Relegation", position: [17, 18], colour: "bg-red-500" },
]

// NFL
const NFL_2020_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    { groupFilter: (tableName) => tableName.includes("AFC"), label: "AFC" },
    { groupFilter: (tableName) => tableName.includes("NFC"), label: "NFC" },
    {
      groupFilter: (tableName) =>
        tableName.includes("NFL") &&
        !tableName.includes("AFC") &&
        !tableName.includes("NFC"),
      label: "NFL",
    },
  ],
  playoffPictureConfig: {
    rankingSystem: "percentage",
    totalSeasonGames: 17,
    qualifyingPositions: 7,
    structure: PlayoffPictureStructure.NFL,
  },
}

// NBA
const NBA_2021_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      groupFilter: (tableName) => tableName?.includes("Division"),
      label: "Division",
    },
    {
      groupFilter: (tableName) =>
        tableName === "Western Conference" ||
        tableName === "Eastern Conference",
      label: "Conference",
    },
    {
      groupFilter: (tableName) => tableName.includes("NBA"),
      label: "League",
    },
  ],
  playoffPictureConfig: {
    rankingSystem: "percentage",
    totalSeasonGames: 82,
    qualifyingPositions: 10,
    structure: PlayoffPictureStructure.NBA,
  },
}

// NHL
const NHL_2014_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      groupFilter: (tableName) => tableName?.includes("Division"),
      label: "Division",
    },
    {
      groupFilter: (tableName) =>
        tableName === "Western Conference" ||
        tableName === "Eastern Conference",
      label: "Conference",
    },
    {
      groupFilter: (tableName) => tableName.includes("NHL"),
      label: "League",
    },
  ],
  playoffPictureConfig: {
    rankingSystem: "points",
    pointsPerWin: 2,
    pointsPerDraw: 1,
    totalSeasonGames: 82,
    qualifyingPositions: 8,
    structure: PlayoffPictureStructure.NHL,
  },
}

// MLB
const MLB_2022_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      groupFilter: (tableName) =>
        tableName.includes("West") ||
        tableName.includes("East") ||
        tableName.includes("Central"),
      label: "Division",
    },
    {
      groupFilter: (tableName) =>
        tableName === "American League" || tableName === "National League",
      label: "Conference",
    },
    {
      groupFilter: (tableName) => tableName.includes("MLB"),
      label: "League",
    },
  ],
  playoffPictureConfig: {
    rankingSystem: "percentage",
    totalSeasonGames: 162,
    qualifyingPositions: 6,
    structure: PlayoffPictureStructure.MLB,
  },
}

// PGA
const PGA_2013_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      placingCategories: [
        {
          label: "TOUR Championship",
          position: Array.from({ length: 30 }, (_, i) => i + 1),
        },
        {
          label: "BMW Championship",
          position: Array.from({ length: 20 }, (_, i) => i + 31),
        },
        {
          label: "St. Jude Championship",
          position: Array.from({ length: 20 }, (_, i) => i + 51),
        },
        {
          label: "Full TOUR Card",
          position: Array.from({ length: 30 }, (_, i) => i + 71),
        },
      ],
      headings: GOLF_FEDEX_HEADINGS,
    },
  ],
}

export const NRL_TEAMS_NAME_LOGO = [
  "Brisbane Broncos",
  "Canberra Raiders",
  "Canterbury Bulldogs",
  "Cronulla Sharks",
  "Dolphins",
  "Gold Coast Titans",
  "Manly Sea Eagles",
  "Melbourne Storm",
  "Newcastle Knights",
  "New Zealand Warriors",
  "North Queensland Cowboys",
  "Parramatta Eels",
  "Penrith Panthers",
  "South Sydney Rabbitohs",
  "St. George Illawarra Dragons",
  "Sydney Roosters",
  "Wests Tigers",
].map((team) => ({
  name: team,
  img: resolveSportImage(team),
}))

export const AFL_TEAM_NAME_LOGO = [
  "Adelaide Crows",
  "Brisbane Lions",
  "Carlton Blues",
  "Collingwood Magpies",
  "Essendon Bombers",
  "Fremantle Dockers",
  "Geelong Cats",
  "Gold Coast Suns",
  "GWS Giants",
  "Hawthorn Hawks",
  "Melbourne Demons",
  "North Melbourne",
  "Port Adelaide Power",
  "Richmond Tigers",
  "St Kilda Saints",
  "Sydney Swans",
  "West Coast Eagles",
  "Western Bulldogs",
].map((team) => ({
  name: team,
  img: resolveSportImage(team),
}))

export const NFL_TEAM_NAME_LOGO = [
  "Arizona Cardinals",
  "Atlanta Falcons",
  "Baltimore Ravens",
  "Buffalo Bills",
  "Carolina Panthers",
  "Chicago Bears",
  "Cincinnati Bengals",
  "Cleveland Browns",
  "Dallas Cowboys",
  "Denver Broncos",
  "Detroit Lions",
  "Green Bay Packers",
  "Houston Texans",
  "Indianapolis Colts",
  "Jacksonville Jaguars",
  "Kansas City Chiefs",
  "Las Vegas Raiders",
  "Los Angeles Chargers",
  "Los Angeles Rams",
  "Miami Dolphins",
  "Minnesota Vikings",
  "New England Patriots",
  "New Orleans Saints",
  "New York Giants",
  "New York Jets",
  "Philadelphia Eagles",
  "Pittsburgh Steelers",
  "San Francisco 49ers",
  "Seattle Seahawks",
  "Tampa Bay Buccaneers",
  "Tennessee Titans",
  "Washington Commanders",
].map((team) => ({
  name: team,
  img: resolveSportImage(team),
}))

export const SUPER_RUGBY_TEAMS_NAME_LOGO = [
  "Queensland Reds",
  "NSW Waratahs",
  "Brumbies",
  "Western Force",
  "Fijian Drua",
  "Moana Pasifika",
  "Gallagher Chiefs",
  "Hurricanes",
  "Blues",
  "Highlanders",
  "Crusaders",
].map((team) => ({
  name: team,
  img: resolveSportImage(team),
}))

export const CRICKET_LEAGUES: LeagueSeasonConfig[] = [
  // {
  //   name: "WTC",
  //   slug: "wtc",
  //   seasons: [{ name: "2025-2027", slug: "" }],
  // },
  {
    name: "IPL",
    slug: "india",
    seasons: [
      {
        name: "2026",
        slug: "ipl",
        ladderConfig: {
          ladderGroup: [
            { placingCategories: CRICKET_PLAYOFFS_TOP_4_LADDER_CONFIG },
          ],
        },
      },
    ],
  },
  {
    name: "The Hundred - Men",
    slug: "the-hundred",
    seasons: [{ name: "2026", slug: "the-hundred-men" }],
  },
  {
    name: "The Hundred - Women",
    slug: "the-hundred",
    seasons: [{ name: "2026", slug: "the-hundred-women" }],
  },
  {
    name: "BBL",
    slug: "australia",
    seasons: [{ name: "25/26", slug: "big-bash-league" }],
  },
  {
    name: "WBBL",
    slug: "australia",
    seasons: [{ name: "25/26", slug: "big-bash-league-women" }],
  },
  {
    name: "ICC Mens T20 World Cup",
    slug: "icc-mens-t20-world-cup",
    seasons: [{ name: "2026", slug: "icc-mens-t20-world-cup" }],
  },
]

export const CRICKET_LEAGUES_CLIENT = stripLeagueSeasonConfig(CRICKET_LEAGUES)

export const MOTORSPORT_SESSION_STANDINGS_HEADINGS = [
  "Driver",
  "Gap",
  "Pts",
  "+/-",
]

export const MOTORSPORT_DRIVER_STANDINGS_HEADINGS = ["Driver", "Pts", "Wins"]
export const MOTORSPORT_CONSTRUCTOR_STANDINGS_HEADINGS = ["Constructor", "Pts"]

const MOTORSPORT_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      label: "Drivers",
      groupFilter: (tableName) => tableName.includes("Athlete"),
      // placingCategories: [
      //   { label: "World Champion", position: [1], colour: "bg-yellow-300" },
      // ],
      headings: MOTORSPORT_DRIVER_STANDINGS_HEADINGS,
    },
    {
      label: "Constructors",
      groupFilter: (tableName) => tableName.includes("Team"),
      //   placingCategories: [
      //     {
      //       label: "Constructor Champion",
      //       position: [1],
      //       colour: "bg-yellow-300",
      //     },
      //   ],
      headings: MOTORSPORT_CONSTRUCTOR_STANDINGS_HEADINGS,
    },
    {
      label: "Session",
      groupFilter: (tableName) => tableName.includes("Session"),
      headings: MOTORSPORT_SESSION_STANDINGS_HEADINGS,
    },
  ],
}

const F1_SESSION_LENGTH = 1
const F1_RACE_LENGTH = 2
const SUPERCARS_SESSION_LENGTH = 8
const MOTOGP_SESSION_LENGTH = 1

const F1_TV_GUIDE: TVConfig = {
  channels: [
    {
      channel: TVChannel.KAYO,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, F1_SESSION_LENGTH),
      tvFilter(date, event) {
        const convertedEvent = event as MatchSummary
        return !convertedEvent.summaryText.includes("Race") ? true : false
      },
    },
    {
      channel: TVChannel.KAYO,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, F1_RACE_LENGTH),
      tvFilter(date, event) {
        const convertedEvent = event as MatchSummary
        return convertedEvent.summaryText.includes("Race") ? true : false
      },
    },
  ],
}

const SUPERCARS_TV_GUIDE: TVConfig = {
  channels: [
    {
      channel: TVChannel.KAYO,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, SUPERCARS_SESSION_LENGTH),
    },
    {
      channel: TVChannel.SEVEN,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, SUPERCARS_SESSION_LENGTH),
      tvFilter(date, event) {
        const convertedEvent = event as MatchSummary
        if (
          convertedEvent?.leagueName?.includes("Sydney") ||
          convertedEvent?.leagueName?.includes("Townsville") ||
          convertedEvent?.leagueName?.includes("Bathurst") ||
          convertedEvent?.leagueName?.includes("Gold Coast") ||
          convertedEvent?.leagueName?.includes("Adelaide")
        ) {
          return true
        }
        return false
      },
    },
  ],
}

export const MOTORSPORT_CATEGORIES: LeagueSeasonConfig[] = [
  {
    name: "Formula 1",
    slug: "40",
    // slug: "f1",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/g8cofl1513623681.png",
    seasons: [
      {
        name: "2026",
        slug: "214140",
        ladderConfig: MOTORSPORT_LADDER_CONFIG,
        tvguide: F1_TV_GUIDE,
      },
      { name: "2025", slug: "209766", ladderConfig: MOTORSPORT_LADDER_CONFIG },
      { name: "2024", slug: "206455", ladderConfig: MOTORSPORT_LADDER_CONFIG },
      { name: "2023", slug: "203647", ladderConfig: MOTORSPORT_LADDER_CONFIG },
    ],
  },
  {
    name: "Supercars",
    slug: "supercars",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/64f67s1770108650.png",
    externalURL: `https://www.supercars.com/calendar`,
    seasons: [{ name: "2026", slug: "2026", tvguide: SUPERCARS_TV_GUIDE }],
  },
  {
    name: "MotoGP",
    slug: "17",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/gg3c201768486075.png",
    seasons: [
      {
        name: "2026",
        slug: "220597",
        ladderConfig: MOTORSPORT_LADDER_CONFIG,
        tvguide: {
          channels: [
            tvGuideConfigCreate(TVChannel.KAYO, 0, MOTOGP_SESSION_LENGTH),
          ],
        },
      },
    ],
  },
]

export const MOTORSPORT_CATEGORIES_CLIENT = stripLeagueSeasonConfig(
  MOTORSPORT_CATEGORIES,
)

const GOLF_BROADCAST_LENGTH = 8
const KAYO_GOLF_TV_GUIDE: TVConfig = {
  channels: [tvGuideConfigCreate(TVChannel.KAYO, 0, GOLF_BROADCAST_LENGTH)],
}

export const GOLF_TOURS: LeagueSeasonConfig[] = [
  {
    name: "PGA Tour",
    slug: "pga",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/quvqqr1423564787.png",
    seasons: [
      {
        name: "2026",
        slug: "2026",
        ladderConfig: PGA_2013_LADDER_CONFIG,
        tvguide: KAYO_GOLF_TV_GUIDE,
      },
      { name: "2025", slug: "2025", ladderConfig: PGA_2013_LADDER_CONFIG },
    ],
  },
  {
    name: "LIV Golf",
    slug: "liv",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/x8p62j1659513228.png",
    seasons: [
      {
        name: "2026",
        slug: "2026",
        tvguide: {
          channels: [
            tvGuideConfigCreate(TVChannel.SEVEN_PLUS, 0, GOLF_BROADCAST_LENGTH),
          ],
        },
      },
      { name: "2025", slug: "2025" },
    ],
  },
  {
    name: "LPGA Tour",
    slug: "lpga",
    externalURL: "https://www.google.com/search?igu=1&gws_rd=ssl&q=lpga",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/hdnc211555580691.png",
    seasons: [
      {
        name: "2026",
        slug: "2026",
        tvguide: KAYO_GOLF_TV_GUIDE,
      },
    ],
  },
  {
    name: "DP World Tour",
    slug: "dpworld",
    externalURL:
      "https://www.google.com/search?igu=1&gws_rd=ssl&q=dp+world+tour",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/3cj95h1778512316.png",
    seasons: [
      {
        name: "2026",
        slug: "2026",
        tvguide: KAYO_GOLF_TV_GUIDE,
      },
    ],
  },
  {
    name: "PGA Tour Australasia",
    slug: "australasia",
    externalURL: "https://golf.com.au/leaderboard",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/ce5bzs1751484107.png",
    seasons: [
      {
        name: "25/26",
        slug: "25-26",
        tvguide: KAYO_GOLF_TV_GUIDE,
      },
    ],
  },
  {
    name: "TGL",
    slug: "tgl",
    externalURL: "https://tglgolf.com/schedule",
    icon: "https://upload.wikimedia.org/wikipedia/en/f/f7/TGL_logo.png",
    seasons: [
      {
        name: "2026",
        slug: "2026",
        tvguide: KAYO_GOLF_TV_GUIDE,
      },
    ],
  },
  {
    name: "Asian Tour",
    slug: "asian-tour",
    externalURL: "https://www.asiantour.com/schedule",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/durtwn1582545153.png",
    seasons: [
      {
        name: "2026",
        slug: "2026",
        tvguide: KAYO_GOLF_TV_GUIDE,
      },
    ],
  },
  {
    name: "PGA Champions Tour",
    slug: "pga-champions-tour",
    externalURL: "https://www.pgatour.com/pgatour-champions/schedule",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/s4xljf1600855962.png",
    seasons: [{ name: "2026", slug: "2026" }],
  },
  {
    name: "Korn Ferry Tour",
    slug: "korn-ferry-tour",
    externalURL: "https://www.pgatour.com/korn-ferry-tour/schedule",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/7bagvc1591956878.png",
    seasons: [{ name: "2026", slug: "2026" }],
  },
  {
    name: "OWGR",
    slug: RankingList.OWGR,
    seasons: [
      {
        name: "Current",
        slug: "2026/ladder",
        ladderConfig: { ladderGroup: [{ headings: GOLF_OWGR_HEADINGS }] },
      },
      { name: "2025", slug: "2025/ladder" },
    ],
  },
]

export const GOLF_TOURS_CLIENT = stripLeagueSeasonConfig(GOLF_TOURS)

const NRL_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.KAYO, 0, RUGBY_LEAGUE_MATCH_LENGTH),
    {
      channel: TVChannel.NINE,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, RUGBY_LEAGUE_MATCH_LENGTH),
      tvFilter(date, event) {
        const AESTDate = new TZDate(date, "Australia/Sydney") // Convert to AEST
        const day = AESTDate.getDay()
        const hour = AESTDate.getHours()
        // NRL games on Nine are typically on Thursdays at 7:50pm, Fridays at 7:50pm, Saturdays at 5:30pm and Sundays at 4:00pm
        if (
          (day === 4 && hour >= 19) || // Thursday
          (day === 5 && hour >= 19) || // Friday
          (day === 6 && hour >= 18 && AESTDate > new Date(2026, 7, 5)) || // Saturday last 5 rounds
          (day === 0 && hour > 15 && hour < 18) || // Sunday
          day === 1 || // Monday - special games (e.g., ANZAC Day, Easter Monday, etc.)
          ((event as Sofascore_Event)?.roundInfo?.round ?? 28) > 27 // Finals
        ) {
          return true
        }
        return false
      },
    },
  ],
}

const QLD_CUP_TV_GUIDE: TVConfig = {
  channels: [
    {
      channel: TVChannel.KAYO,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, RUGBY_LEAGUE_MATCH_LENGTH),
      tvFilter(date, event): boolean {
        const AESTDate = new TZDate(date, "Australia/Brisbane") // Convert to AEST
        const day = AESTDate.getDay()
        const hour = AESTDate.getHours()
        const minute = AESTDate.getMinutes()
        if (
          day === 0 &&
          hour === 14 &&
          minute === 10 // Sunday @ 2:10pm
        ) {
          return true
        }
        return false
      },
    },
    {
      channel: TVChannel.NINE,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, RUGBY_LEAGUE_MATCH_LENGTH),
      tvFilter(date, event) {
        const AESTDate = new TZDate(date, "Australia/Brisbane") // Convert to AEST
        const day = AESTDate.getDay()
        const hour = AESTDate.getHours()
        const minute = AESTDate.getMinutes()
        if (
          day === 0 &&
          hour === 14 &&
          minute === 10 // Sunday @ 2:10pm
        ) {
          return true
        }
        return false
      },
    },
  ],
}

export const RUGBY_LEAGUE_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "NRL",
    slug: "294",
    icon: "https://upload.wikimedia.org/wikipedia/en/5/50/National_Rugby_League.svg",
    byes: NRL_TEAMS_NAME_LOGO,
    seasons: [
      {
        name: "2026",
        slug: "86317",
        ladderConfig: NRL_TOP_8_LADDER_CONFIG,
        tvguide: NRL_TV_GUIDE,
      },
      { name: "2025", slug: "69277", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2024", slug: "56749", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2023", slug: "47382", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2022", slug: "39630", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2021", slug: "34941", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2020", slug: "26032", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2019", slug: "19487", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2018", slug: "15699", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2017", slug: "12722", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2016", slug: "11327", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2015", slug: "9762", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2014", slug: "7520", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2013", slug: "5709", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2012", slug: "4092", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2011", slug: "3178", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2010", slug: "2597", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2009", slug: "1974", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2008", slug: "1153", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2007", slug: "42987", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
    ],
  },
  {
    name: "Brisbane Broncos",
    slug: "team/4258",
    icon: "https://r2.thesportsdb.com/images/media/team/badge/yjgl741768487372.png",
    seasons: [{ name: "Current", slug: "", tvguide: NRL_TV_GUIDE }],
  },
  {
    name: "NRLW",
    slug: "19120",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/50/Telstra_NRL_Women%27s_Premiership.png",
    seasons: [
      {
        name: "2026",
        slug: "87573",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
        tvguide: {
          channels: [
            tvGuideConfigCreate(TVChannel.NINE, 0, RUGBY_LEAGUE_MATCH_LENGTH),
            tvGuideConfigCreate(TVChannel.KAYO, 0, RUGBY_LEAGUE_MATCH_LENGTH),
          ],
        },
      },
      {
        name: "2025",
        slug: "69964",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "2024",
        slug: "56809",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "2023",
        slug: "51393",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "State of Origin - Men",
    slug: "791",
    icon: "https://upload.wikimedia.org/wikipedia/en/0/0e/Ampol_State_Of_Origin_Logo_2026.svg",
    seasons: [
      {
        name: "2026",
        slug: "87571",
        tvguide: {
          channels: [
            tvGuideConfigCreate(TVChannel.NINE, 0, RUGBY_LEAGUE_MATCH_LENGTH),
          ],
        },
      },
      { name: "2025", slug: "69960" },
      { name: "2024", slug: "56900" },
      { name: "2023", slug: "48134" },
      { name: "2022", slug: "40148" },
      { name: "2021", slug: "36264" },
      { name: "2020", slug: "26553" },
      { name: "2019", slug: "20098" },
      { name: "2018", slug: "15779" },
      { name: "2017", slug: "13138" },
      { name: "2016", slug: "11628" },
      { name: "2015", slug: "10281" },
      { name: "2014", slug: "8060" },
      { name: "2013", slug: "5705" },
      { name: "2012", slug: "4536" },
      { name: "2011", slug: "3321" },
      { name: "2010", slug: "2715" },
    ],
  },
  {
    name: "State of Origin - Women",
    slug: "20374",
    icon: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Ampol_Women%27s_State_of_Origin.jpg",
    seasons: [
      {
        name: "2026",
        slug: "87574",
        tvguide: {
          channels: [
            tvGuideConfigCreate(TVChannel.NINE, 0, RUGBY_LEAGUE_MATCH_LENGTH),
          ],
        },
      },
      { name: "2025", slug: "69965" },
      { name: "2024", slug: "56901" },
      { name: "2023", slug: "51382" },
    ],
  },
  {
    name: "Queensland Cup",
    slug: "2135",
    icon: "https://upload.wikimedia.org/wikipedia/en/6/6e/2025_Host_Plus_Cup_Logo.svg",
    excludeFromToday: false,
    seasons: [
      {
        name: "2026",
        slug: "88763",
        ladderConfig: NRL_TOP_8_LADDER_CONFIG,
        tvguide: QLD_CUP_TV_GUIDE,
      },
      { name: "2025", slug: "69961", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2024", slug: "57514", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2023", slug: "48145", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2022", slug: "40184", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2021", slug: "35084", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2020", slug: "26865", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2019", slug: "22828", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2018", slug: "16174", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2017", slug: "12981", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2016", slug: "11366", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2015", slug: "10176", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
    ],
  },
  {
    name: "New South Wales Cup",
    slug: "2134",
    icon: "https://upload.wikimedia.org/wikipedia/en/f/f8/NSW_Cup_Logo_2026.svg",
    excludeFromToday: true,
    seasons: [
      { name: "2026", slug: "89006", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2025", slug: "69962", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
      { name: "2024", slug: "57568", ladderConfig: NRL_TOP_8_LADDER_CONFIG },
    ],
  },
  {
    name: "World Cup",
    slug: "431",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/sxoc6h1768739073.png",
    seasons: [
      {
        name: "2026",
        slug: "87548",
        ladderConfig: ladderConfigMap({
          placingCategories: RL_WORLD_CUP_LADDER_CONFIG,
        }),
      },
      {
        name: "2021",
        slug: "42989",
        ladderConfig: ladderConfigMap({
          placingCategories: RL_WORLD_CUP_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "World Cup - Women",
    slug: "10683",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/sxoc6h1768739073.png",
    seasons: [
      { name: "2026", slug: "87572" },
      { name: "2022", slug: "42991" },
    ],
  },
  {
    name: "Pacific Champs",
    slug: "13667",
    seasons: [
      { name: "2025", slug: "81655" },
      { name: "2024", slug: "66664" },
    ],
  },
  {
    name: "Pacific Champs W",
    slug: "21300",
    seasons: [
      { name: "2025", slug: "881656" },
      { name: "2024", slug: "66683" },
    ],
  },
  {
    name: "Int. Friendly Games",
    slug: "977",
    seasons: [{ name: "2025", slug: "69571" }],
  },
  {
    name: "World Club Challenge",
    slug: "1590",
    seasons: [
      { name: "2026", slug: "87449" },
      { name: "2024", slug: "57112" },
    ],
  },
  {
    name: "Super League",
    slug: "302",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/gp2sfv1641835011.png",
    excludeFromToday: true,
    seasons: [
      {
        name: "2026",
        slug: "86986",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "2025",
        slug: "69930",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "2024",
        slug: "57044",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
    ],
  },
]

export const RUGBY_LEAGUE_LEAGUES_CLIENT =
  stripLeagueSeasonConfig(RUGBY_LEAGUE_LEAGUES)

const AFL_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.KAYO, 0, AUSSIE_RULES_MATCH_LENGTH),
    {
      channel: TVChannel.SEVEN,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, AUSSIE_RULES_MATCH_LENGTH),
      tvFilter(date, event) {
        const AESTDate = new TZDate(date, "Australia/Brisbane") // Convert to AEST
        const day = AESTDate.getDay()
        const hour = AESTDate.getHours()
        const eventCast = event as Sofascore_Event
        if (
          (day === 4 && hour >= 19) || // Thursday
          (day === 5 && hour >= 19 && hour < 20) || // Friday
          eventCast.homeTeam.name.includes("Brisbane") || // Brisbane games
          eventCast.awayTeam.name.includes("Brisbane") || // Brisbane games
          eventCast.homeTeam.name.includes("Gold Coast") || // Gold Coast games
          eventCast.awayTeam.name.includes("Gold Coast") // Gold Coast games
        ) {
          return true
        }
        return false
      },
    },
  ],
}

export const AUSSIE_RULES_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "AFL",
    slug: "656",
    icon: "https://upload.wikimedia.org/wikipedia/en/9/91/AFL-Logo_RGB_white_border.png",
    byes: AFL_TEAM_NAME_LOGO,
    seasons: [
      {
        name: "2026",
        slug: "86748",
        ladderConfig: AFL_TOP_10_LADDER_CONFIG,
        tvguide: AFL_TV_GUIDE,
      },
      { name: "2025", slug: "71308", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2024", slug: "58226", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2023", slug: "47887", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2022", slug: "39988", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2021", slug: "35137", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2020", slug: "26039", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2019", slug: "19486", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2018", slug: "15780", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2017", slug: "13037", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2016", slug: "11060", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2015", slug: "9775", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2014", slug: "7608", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2013", slug: "5633", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2012", slug: "4090", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2011", slug: "3166", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2010", slug: "2594", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2009", slug: "2099", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2008", slug: "1153", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
      { name: "2007", slug: "42987", ladderConfig: AFL_TOP_8_LADDER_CONFIG },
    ],
  },
  {
    name: "Brisbane Lions",
    slug: "team/4444",
    icon: "https://r2.thesportsdb.com/images/media/team/badge/tvvxvp1474038810.png",
    seasons: [{ name: "Current", slug: "" }],
  },
  {
    name: "AFLW",
    slug: "10159",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/4grr341659039857.png",
    seasons: [
      {
        name: "2025",
        slug: "76123",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
        tvguide: {
          channels: [
            tvGuideConfigCreate(TVChannel.KAYO, 0, AUSSIE_RULES_MATCH_LENGTH),
            tvGuideConfigCreate(TVChannel.SEVEN, 0, AUSSIE_RULES_MATCH_LENGTH),
          ],
        },
      },
      {
        name: "2024",
        slug: "64462",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2023",
        slug: "54077",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2022 S7",
        slug: "45127",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2022",
        slug: "40037",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2021",
        slug: "35108",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2020",
        slug: "26102",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2019",
        slug: "20117",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2018",
        slug: "15781",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2017",
        slug: "12890",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "VFL",
    slug: "25506",
    icon: "https://upload.wikimedia.org/wikipedia/en/3/34/VFL_Football_Logo.svg",
    excludeFromToday: true,
    seasons: [
      {
        name: "2026",
        slug: "90001",
        ladderConfig: ladderConfigMap({
          placingCategories: TOP_10_SECOND_CHANCE_PLACING,
        }),
      },
      {
        name: "2025",
        slug: "73301",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
      {
        name: "2024",
        slug: "57568",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_8_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "SANFL",
    slug: "20126",
    icon: "https://upload.wikimedia.org/wikipedia/en/7/7d/SANFL_logo.svg",
    excludeFromToday: true,
    seasons: [
      {
        name: "2026",
        slug: "89835",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_5_LADDER_CONFIG,
        }),
      },
      {
        name: "2025",
        slug: "71309",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_5_LADDER_CONFIG,
        }),
      },
      {
        name: "2024",
        slug: "59236",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_5_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "WAFL",
    slug: "20160",
    icon: "https://upload.wikimedia.org/wikipedia/en/c/cb/West_Australian_Football_League_logo_2024.png",
    excludeFromToday: true,
    seasons: [
      {
        name: "2026",
        slug: "89836",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_5_LADDER_CONFIG,
        }),
      },
      {
        name: "2025",
        slug: "71310",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_5_LADDER_CONFIG,
        }),
      },
      {
        name: "2024",
        slug: "59237",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_5_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "AFL Preseason",
    slug: "22064",
    seasons: [
      { name: "2026", slug: "89834" },
      { name: "2025", slug: "71941" },
      { name: "2024", slug: "58764" },
    ],
  },
  {
    name: "AFL All Stars",
    slug: "25029",
    seasons: [{ name: "2025", slug: "72022" }],
  },
]

export const AUSSIE_RULES_LEAGUES_CLIENT =
  stripLeagueSeasonConfig(AUSSIE_RULES_LEAGUES)

const NFL_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.KAYO, 0, AMERICAN_FOOTBALL_MATCH_LENGTH),
    tvGuideConfigCreate(
      TVChannel.DISNEY_PLUS,
      0,
      AMERICAN_FOOTBALL_MATCH_LENGTH,
    ),
    tvGuideConfigCreate(
      TVChannel.SEVEN_MATE,
      0,
      AMERICAN_FOOTBALL_MATCH_LENGTH,
    ),
  ],
}
export const AMERICAN_FOOTBALL_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "NFL",
    slug: "9464",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/g85fqz1662057187.png",
    byes: NFL_TEAM_NAME_LOGO,
    seasons: [
      {
        name: "26/27",
        slug: "94366",
        ladderConfig: NFL_2020_LADDER_CONFIG,
        tvguide: NFL_TV_GUIDE,
      },
      { name: "25/26", slug: "75522", ladderConfig: NFL_2020_LADDER_CONFIG },
      { name: "24/25", slug: "60592", ladderConfig: NFL_2020_LADDER_CONFIG },
      { name: "23/24", slug: "51361", ladderConfig: NFL_2020_LADDER_CONFIG },
      { name: "22/23", slug: "46786", ladderConfig: NFL_2020_LADDER_CONFIG },
      { name: "21/22", slug: "36422", ladderConfig: NFL_2020_LADDER_CONFIG },
      { name: "20/21", slug: "27719", ladderConfig: NFL_2020_LADDER_CONFIG },
      { name: "19/20", slug: "23303" },
      { name: "18/19", slug: "16754" },
      { name: "17/18", slug: "13091" },
      { name: "16/17", slug: "11386" },
      { name: "15/16", slug: "10155" },
      { name: "14/15", slug: "9717" },
      { name: "13/14", slug: "9716" },
      { name: "12/13", slug: "9715" },
      { name: "11/12", slug: "9714" },
      { name: "10/11", slug: "9713" },
      { name: "09/10", slug: "9712" },
      { name: "08/09", slug: "9711" },
      { name: "07/08", slug: "9710" },
      { name: "06/07", slug: "9709" },
      { name: "05/06", slug: "9708" },
      { name: "04/05", slug: "9707" },
      { name: "03/04", slug: "9706" },
      { name: "02/03", slug: "9705" },
      { name: "01/02", slug: "36659" },
    ],
  },
  {
    name: "NFL Preseason",
    slug: "9465",
    seasons: [
      { name: "2025", slug: "75587" },
      { name: "2024", slug: "59432" },
      { name: "2023", slug: "51364" },
    ],
  },
  {
    name: "Seattle Seahawks",
    slug: "team/4430",
    icon: "https://r2.thesportsdb.com/images/media/team/badge/wwuqyr1421434817.png",
    seasons: [{ name: "Current", slug: "" }],
  },
  {
    name: "NCAA, Regular Season",
    slug: "19510",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/hm3cyr1758455622.png",
    excludeFromToday: true,
    seasons: [
      { name: "25/26", slug: "74693" },
      { name: "24/25", slug: "59703" },
    ],
  },
  {
    name: "NCAA Division I, FBS Post Season",
    slug: "19750",
    seasons: [
      { name: "24/25", slug: "69101" },
      { name: "23/24", slug: "57012" },
    ],
  },
  {
    name: "NCAA Division I, FCS National Championship",
    slug: "19717",
    seasons: [
      { name: "24/25", slug: "69309" },
      { name: "23/24", slug: "56827" },
    ],
  },
]

export const AMERICAN_FOOTBALL_LEAGUES_CLIENT = stripLeagueSeasonConfig(
  AMERICAN_FOOTBALL_LEAGUES,
)

const A_LEAGUE_TV_GUIDE: TVConfig = {
  channels: [
    {
      channel: TVChannel.TEN_BOLD,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, FOOTBALL_MATCH_LENGTH),
      tvFilter(date, event) {
        const AESTDate = new TZDate(date, "Australia/Brisbane") // Convert to AEST
        const day = AESTDate.getDay()
        const hour = AESTDate.getHours()
        if (
          day === 6 &&
          hour >= 14 // Saturday arvo/night
        ) {
          return true
        }
        return false
      },
    },
  ],
}

const STAN_FOOTBALL_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.STAN_SPORT, 0, FOOTBALL_MATCH_LENGTH),
  ],
}

const ESPN_FOOTBALL_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.KAYO, 0, FOOTBALL_MATCH_LENGTH),
    tvGuideConfigCreate(TVChannel.DISNEY_PLUS, 0, FOOTBALL_MATCH_LENGTH),
  ],
}

const BEIN_FOOTBALL_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.BEIN_SPORTS, 0, FOOTBALL_MATCH_LENGTH),
  ],
}

const FIFA_WORLD_CUP_TV_GUIDE: TVConfig = {
  channels: [
    {
      channel: TVChannel.SBS,
      // startTime: (date) => date,
      endTime: (date) => addHours(date, FOOTBALL_MATCH_LENGTH),
    },
  ],
}

export const FOOTBALL_LEAGUES: LeagueSeasonConfig[] = [
  //Australia - category 34
  {
    name: "A-League Men",
    slug: "136",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/2u78lm1638459575.png",
    seasons: [
      {
        name: "25/26",
        slug: "82603",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
        tvguide: A_LEAGUE_TV_GUIDE,
      },
      {
        name: "24/25",
        slug: "64864",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "A-League Women",
    slug: "1894",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/1sk49c1638459590.png",
    seasons: [
      {
        name: "25/26",
        slug: "82605",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "24/25",
        slug: "66775",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "Australia Cup",
    slug: "1786",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/bjqd291645454828.png/small",
    seasons: [
      { name: "2025", slug: "75270" },
      { name: "2024", slug: "61199" },
    ],
  },
  {
    name: "Australian Championship",
    slug: "29010",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/44ohb31760284721.png/small",
    seasons: [{ name: "2025", slug: "81331" }],
  },
  {
    name: "Australia Men",
    slug: "team/4741",
    icon: "https://r2.thesportsdb.com/images/media/team/badge/eylq8x1781926138.png",
    seasons: [{ name: "Current", slug: "" }],
  },
  {
    name: "Australia Women",
    slug: "team/7410",
    icon: "https://r2.thesportsdb.com/images/media/team/badge/eylq8x1781926138.png",
    seasons: [{ name: "Current", slug: "" }],
  },
  //England - category 1
  {
    name: "Premier League",
    slug: "17",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png",
    seasons: [
      {
        name: "25/26",
        slug: "76986",
        ladderConfig: ladderConfigMap({
          placingCategories: EUROPEAN_DOMESTIC_SHARED_LADDER,
        }),
        tvguide: STAN_FOOTBALL_TV_GUIDE,
      },
      {
        name: "24/25",
        slug: "61627",
        ladderConfig: ladderConfigMap({
          placingCategories: EUROPEAN_DOMESTIC_SHARED_LADDER,
        }),
      },
    ],
  },
  {
    name: "WSL",
    slug: "1044",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/lpsm6p1751723311.png",
    seasons: [
      {
        name: "25/26",
        slug: "79227",
        ladderConfig: ladderConfigMap({ placingCategories: WSL_LADDER_CONFIG }),
      },
      {
        name: "24/25",
        slug: "64370",
        ladderConfig: ladderConfigMap({ placingCategories: WSL_LADDER_CONFIG }),
      },
    ],
  },
  {
    name: "Championship",
    slug: "18",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/ty5a681688770169.png/small",
    seasons: [
      {
        name: "25/26",
        slug: "77347",
        ladderConfig: ladderConfigMap({
          placingCategories: CHAMPIONSHIP_LADDER_CONFIG,
        }),
        tvguide: BEIN_FOOTBALL_TV_GUIDE,
      },
      {
        name: "24/25",
        slug: "61961",
        ladderConfig: ladderConfigMap({
          placingCategories: CHAMPIONSHIP_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "FA Cup",
    slug: "19",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/vk7isd1598802862.png/small",
    seasons: [
      { name: "25/26", slug: "82557", tvguide: STAN_FOOTBALL_TV_GUIDE },
    ],
  },
  {
    name: "Women's FA Cup",
    slug: "11666",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/vfjnxt1713511523.png/small",
    seasons: [
      { name: "25/26", slug: "84634", tvguide: STAN_FOOTBALL_TV_GUIDE },
    ],
  },
  {
    name: "EFL Cup",
    slug: "21",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/x1va771565372556.png/small",
    seasons: [
      { name: "25/26", slug: "77500", tvguide: BEIN_FOOTBALL_TV_GUIDE },
    ],
  },

  //Australia - category 34
  // {
  //   name: "QLD Kappa Pro Series",
  //   slug: "24883",
  //   seasons: [{ name: "2025", slug: "71620" }],
  // },
  // {
  //   name: "NPL QLD",
  //   slug: "1268",
  //   seasons: [{ name: "2025", slug: "70470" }],
  // },
  //   {
  //     name: "QLD Premier League 1",
  //     slug: "",
  //     seasons: [{ name: "2025", slug: "https://footballqueensland.com.au/fqpl-1/" }],
  //   },
  // {
  //     name: "QLD Premier League 2",
  //     slug: "",
  //     seasons: [{ name: "2025", slug: "https://footballqueensland.com.au/fqpl-2/" }],
  //   },
  //England - category 1
  // {
  //   name: "League One",
  //   slug: "24",
  //   seasons: [{ name: "25/26", slug: "77352" }],
  // },
  // {
  //   name: "League Two",
  //   slug: "25",
  //   seasons: [{ name: "25/26", slug: "77351" }],
  // },
  // International - category 1468
  {
    name: "FIFA World Cup",
    icon: "https://r2.thesportsdb.com/images/media/league/trophy/mmyv4f1724782185.png/medium",
    slug: "16",
    seasons: [
      {
        name: "2026",
        slug: "58210",
        ladderConfig: FIFA_WORLD_CUP_LADDER_CONFIG,
        tvguide: FIFA_WORLD_CUP_TV_GUIDE,
      },
      {
        name: "2022",
        slug: "41087",
      },
    ],
  },
  {
    name: "🌍 FIFA World Cup Qualifiers",
    slug: "fifaQualifiers",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification",
    seasons: [{ name: "2026", slug: "wiki" }],
  },
  {
    name: "🌍 FIFA World Cup Qualifiers - Inter-Confed...",
    slug: "10618",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification",
    seasons: [{ name: "2026", slug: "86613" }],
  },
  {
    name: "FIFA Women's World Cup",
    slug: "290",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/q3uyc61774565208.png/small",
    seasons: [
      { name: "2023", slug: "46930" },
      { name: "2027", slug: "" },
    ],
  },
  {
    name: "🌍 FIFA Women's World Cup Qualifiers",
    slug: "fifaWQualifiers",
    externalURL:
      "https://en.wikipedia.org/wiki/2027_FIFA_Women%27s_World_Cup_qualification",
    seasons: [{ name: "2027", slug: "wiki" }],
  },
  // {
  //   name: "FIFA World Cup Qualifier Playoffs",
  //   slug: "10618",
  //   seasons: [{ name: "2022", slug: "41103" }],
  // },
  // {
  //  name: "Olympic Games - Men",
  //   slug: "436",
  //   seasons: [{ name: "2024", slug: "59243" }],
  // },
  // {
  //   name: "Olympic Games - Women",
  //   slug: "437",
  //   seasons: [{ name: "2024", slug: "59242" }],
  // },
  // {
  //   name: "International Friendlies - Men",
  //   slug: "851",
  //   seasons: [{ name: "2025", slug: "69578" }],
  // },
  // {
  //   name: "International Friendlies - Women",
  //   slug: "852",
  //   seasons: [{ name: "2025", slug: "69579" }],
  // },
  {
    name: "FIFA Intercontinental Cup",
    slug: "23674",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/p35wxr1765813800.png/small",
    seasons: [{ name: "2025", slug: "78702" }],
  },
  {
    name: "FIFA Club World Cup",
    slug: "357",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/yesbil1731546197.png/small",
    seasons: [{ name: "2025", slug: "69619" }],
  },
  // Asia - 1467
  {
    name: "AFC Asian Cup",
    slug: "246",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/0a86rp1710997941.png/small",
    seasons: [{ name: "2023", slug: "51384" }],
  },
  {
    name: "AFC Asian Cup - Women",
    slug: "1692",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/m0scwf1726416187.png/small",
    seasons: [{ name: "2026", slug: "79569" }],
  },
  // {
  //   name: "🌏 AFC Asian Cup - Women",
  //   slug: "1692",
  //   seasons: [{ name: "2026", slug: "79569" }],
  // },
  // {
  //   name: "AFC World Cup Qualifiers",
  //   slug: "308",
  //   seasons: [{ name: "23-25", slug: "53508" }],
  // },
  {
    name: "AFC World Cup Qualifiers",
    slug: "308",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/2968zx1730130262.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(AFC)",
    seasons: [{ name: "23-25", slug: "53508" }],
  },
  {
    name: "AFC Women's World Cup Qualifiers",
    slug: "308-women",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/wgt3qi1735833568.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2027_FIFA_Women%27s_World_Cup_qualification#AFC",
    seasons: [{ name: "26-27", slug: "wiki" }],
  },
  {
    name: "AFC Champions League Elite",
    slug: "463",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/gsbq4k1719686780.png/small",
    seasons: [
      { name: "25/26", slug: "77010" },
      { name: "24/25", slug: "62485" },
    ],
  },
  {
    name: "AFC Women's Champions League",
    slug: "23009",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/fusqr71758302362.png/small",
    seasons: [
      { name: "25/26", slug: "77726" },
      { name: "24/25", slug: "64146" },
    ],
  },
  // Europe - category 1465
  {
    name: "UEFA Champions League",
    slug: "7",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Champions_League",
    seasons: [
      {
        name: "25/26",
        slug: "76953",
        ladderConfig: ladderConfigMap({
          placingCategories: UEFA_24_TEAM_LADDER_CONFIG,
        }),
        tvguide: STAN_FOOTBALL_TV_GUIDE,
      },
    ],
  },
  {
    name: "UEFA Women's Champions League",
    slug: "696",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/nsi55h1761838458.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Women%27s_Champions_League",
    seasons: [
      {
        name: "25/26",
        slug: "77328",
        ladderConfig: ladderConfigMap({
          placingCategories: UEFA_WOMENS_CL_LADDER_CONFIG,
        }),
        tvguide: ESPN_FOOTBALL_TV_GUIDE,
      },
    ],
  },
  {
    name: "UEFA Europa League",
    slug: "679",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/mlsr7d1718774547.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League",
    seasons: [
      {
        name: "25/26",
        slug: "76984",
        ladderConfig: ladderConfigMap({
          placingCategories: UEFA_24_TEAM_LADDER_CONFIG,
        }),
        tvguide: STAN_FOOTBALL_TV_GUIDE,
      },
    ],
  },
  {
    name: "UEFA Conference League",
    slug: "17015",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/ymfo5j1718775759.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Conference_League",
    seasons: [
      {
        name: "25/26",
        slug: "76960",
        ladderConfig: ladderConfigMap({
          placingCategories: UEFA_24_TEAM_LADDER_CONFIG,
        }),
      },
    ],
  },

  {
    name: "UEFA European Championship",
    slug: "1",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/bivzlu1635869135.png/small",
    seasons: [{ name: "2024", slug: "56953" }],
  },
  {
    name: "UEFA European Women's Championship",
    slug: "477",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/jrcfev1744026201.png/small",
    seasons: [{ name: "2025", slug: "69935" }],
  },
  // {
  //   name: "UEFA World Cup Qualifiers",
  //   slug: "11",
  //   seasons: [{ name: "2026", slug: "69427" }],
  // },
  // {
  //   name: "UEFA Women's World Cup Qualifiers",
  //   slug: "780",
  //   seasons: [{ name: "2022", slug: "38585" }],
  // },

  // USA - category 26
  {
    name: "🇺🇸 MLS",
    slug: "242",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Major_League_Soccer_season",
    excludeFromToday: true,
    seasons: [
      {
        name: "2026",
        slug: "86668",
        ladderConfig: ladderConfigMap({ placingCategories: MLS_LADDER_CONFIG }),
      },
      {
        name: "2025",
        slug: "70158",
        ladderConfig: ladderConfigMap({ placingCategories: MLS_LADDER_CONFIG }),
      },
    ],
  },
  {
    name: "🇺🇸 NWSL",
    slug: "1690",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_National_Women%27s_Soccer_League_season",
    excludeFromToday: true,
    seasons: [
      {
        name: "2025",
        slug: "71412",
        ladderConfig: ladderConfigMap({
          placingCategories: NWSL_LADDER_CONFIG,
        }),
      },
    ],
  },
  // France - category 7
  {
    name: "🇫🇷 Ligue 1",
    slug: "34",
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_Ligue_1",
    excludeFromToday: true,
    seasons: [
      {
        name: "25/26",
        slug: "77356",
        ladderConfig: ladderConfigMap({
          placingCategories: LIGUE_1_LADDER_CONFIG,
        }),
        tvguide: BEIN_FOOTBALL_TV_GUIDE,
      },
    ],
  },
  // Germany - category 30
  {
    name: "🇩🇪 Bundesliga",
    slug: "35",
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_Bundesliga",
    excludeFromToday: true,
    seasons: [
      {
        name: "25/26",
        slug: "77333",
        ladderConfig: ladderConfigMap({
          placingCategories: BUNDESLIGA_LADDER_CONFIG,
        }),
        tvguide: BEIN_FOOTBALL_TV_GUIDE,
      },
    ],
  },
  // Italy - category 31
  {
    name: "🇮🇹 Serie A",
    slug: "23",
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_Serie_A",
    excludeFromToday: true,
    seasons: [
      {
        name: "25/26",
        slug: "76457",
        ladderConfig: ladderConfigMap({
          placingCategories: EUROPEAN_DOMESTIC_SHARED_LADDER,
        }),
        tvguide: BEIN_FOOTBALL_TV_GUIDE,
      },
    ],
  },
  // Spain - category 32
  {
    name: "🇪🇸 La Liga",
    slug: "8",
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_La_Liga",
    excludeFromToday: true,
    seasons: [
      {
        name: "25/26",
        slug: "77559",
        ladderConfig: ladderConfigMap({
          placingCategories: EUROPEAN_DOMESTIC_SHARED_LADDER,
        }),
        tvguide: BEIN_FOOTBALL_TV_GUIDE,
      },
    ],
  },

  // North & Central America - category 1469
  // South America - category 1470
  // Africa - category 1466
  // Oceania - category 1471

  {
    name: "🌍 International Friendlies - Men",
    slug: "851",
    seasons: [{ name: "2026", slug: "87155" }],
  },
  {
    name: "🌍 International Friendlies - Women",
    slug: "852",
    seasons: [{ name: "2026", slug: "86730" }],
  },
  {
    name: "🌍 FIFA Series - Men",
    slug: "32832",
    seasons: [{ name: "2026", slug: "91220" }],
  },
  {
    name: "🌍 FIFA Series - Women",
    slug: "32833",
    seasons: [{ name: "2026", slug: "91221" }],
  },
]

export const FOOTBALL_LEAGUES_CLIENT = stripLeagueSeasonConfig(FOOTBALL_LEAGUES)

const MLB_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.KAYO, 0, BASEBALL_MATCH_LENGTH),
    tvGuideConfigCreate(TVChannel.DISNEY_PLUS, 0, BASEBALL_MATCH_LENGTH),
  ],
}

export const BASEBALL_LEAGUES: LeagueSeasonConfig[] = [
  //Australia - category 34
  {
    name: "MLB",
    slug: "11205",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/c5r83j1521893739.png/small",
    display: DisplayTypes.DATE,
    seasons: [
      {
        name: "2026",
        slug: "84695",
        ladderConfig: MLB_2022_LADDER_CONFIG,
        tvguide: MLB_TV_GUIDE,
      },
      { name: "2025", slug: "68611", ladderConfig: MLB_2022_LADDER_CONFIG },
      { name: "2024", slug: "57577", ladderConfig: MLB_2022_LADDER_CONFIG },
    ],
  },
  {
    name: "ABL",
    slug: "19445",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/jlnr611641806780.png/small",
    seasons: [
      { name: "25/26", slug: "81328" },
      { name: "24/25", slug: "65318" },
    ],
  },
  {
    name: "World Baseball Classic",
    slug: "11207",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/6f0zne1764166849.png/small",
    seasons: [
      { name: "2026", slug: "75868" },
      { name: "2023", slug: "47197" },
    ],
  },
  {
    name: "WBSC Premier12",
    slug: "11206",
    seasons: [{ name: "2024", slug: "65281" }],
  },
]

export const BASEBALL_LEAGUES_CLIENT = stripLeagueSeasonConfig(BASEBALL_LEAGUES)

const NBA_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.KAYO, 0, BASKETBALL_MATCH_LENGTH),
    tvGuideConfigCreate(TVChannel.DISNEY_PLUS, 0, BASKETBALL_MATCH_LENGTH),
  ],
}

export const BASKETBALL_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "NBL",
    slug: "1524",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/gvz6vb1726086476.png/small",
    seasons: [
      {
        name: "25/26",
        slug: "77205",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "24/25",
        slug: "61848",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "WNBL",
    slug: "1506",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/hnate81749406441.png/small",
    seasons: [
      { name: "25/26", slug: "77204" },
      { name: "24/25", slug: "66424" },
    ],
  },
  {
    name: "NBA",
    slug: "132",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png/small",
    display: DisplayTypes.DATE,
    seasons: [
      {
        name: "25/26",
        slug: "80229",
        ladderConfig: NBA_2021_LADDER_CONFIG,
        tvguide: NBA_TV_GUIDE,
      },
      { name: "24/25", slug: "65360", ladderConfig: NBA_2021_LADDER_CONFIG },
    ],
  },
  // {
  //   name: "NBA Cup",
  //   slug: "132",
  //   seasons: [
  //     { name: "25/26", slug: "84238" },
  //     { name: "24/25", slug: "84238" },
  //   ],
  // },
  {
    name: "WNBA",
    slug: "486",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/47llb31573154455.png/small",
    display: DisplayTypes.DATE,
    seasons: [
      { name: "2026", slug: "89004" },
      { name: "2025", slug: "69751" },
      { name: "2024", slug: "57477" },
    ],
  },
  {
    name: "March Madness",
    slug: "13434",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/ibf3d21731087087.png/small",
    display: DisplayTypes.DATE,
    externalURL:
      "https://en.wikipedia.org/wiki/2026_NCAA_Division_I_men%27s_basketball_tournament",
    seasons: [
      { name: "2026", slug: "91315" },
      // { name: "2024", slug: "57477" },
    ],
  },
  // {
  //   name: "Basketball World Cup",
  //   slug: "486",
  //   seasons: [
  //     { name: "2025", slug: "69751" },
  //     { name: "2024", slug: "57477" },
  //   ],
  // },
]

export const BASKETBALL_LEAGUES_CLIENT =
  stripLeagueSeasonConfig(BASKETBALL_LEAGUES)

const TENNIS_MAJORS_TV_GUIDE: TVConfig = {
  channels: [tvGuideConfigCreate(TVChannel.NINE, 0, 2)],
}

export const TENNIS_CATEGORIES: LeagueSeasonConfig[] = [
  {
    name: "ATP",
    slug: "3",
    seasons: [{ name: "2026", slug: "" }],
  },

  {
    name: "WTA",
    slug: "6",
    seasons: [{ name: "2026", slug: "" }],
  },

  {
    name: "Davis Cup",
    slug: "76",
    seasons: [{ name: "2026", slug: "" }],
  },

  {
    name: "Billie Jean King Cup",
    slug: "74",
    seasons: [{ name: "2026", slug: "" }],
  },
]

export const TENNIS_CATEGORIES_CLIENT =
  stripLeagueSeasonConfig(TENNIS_CATEGORIES)

export const TENNIS_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "Australian Open - Men's Singles",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Australian_Open_Logo_2017.svg",
    slug: "2363",
    seasons: [
      { name: "2026", slug: "80012", tvguide: TENNIS_MAJORS_TV_GUIDE },
      { name: "2025", slug: "69039" },
    ],
  },
  {
    name: "Australian Open - Women's Singles",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Australian_Open_Logo_2017.svg",
    slug: "2571",
    seasons: [
      { name: "2026", slug: "80013", tvguide: TENNIS_MAJORS_TV_GUIDE },
      { name: "2025", slug: "67042" },
    ],
  },
  {
    name: "French Open - Men's Singles",
    slug: "2480",
    icon: "https://upload.wikimedia.org/wikipedia/en/1/1d/Logo_Roland-Garros.svg",
    seasons: [
      { name: "2026", slug: "85951", tvguide: TENNIS_MAJORS_TV_GUIDE },
      { name: "2025", slug: "61364" },
    ],
  },
  {
    name: "French Open - Women's Singles",
    slug: "2577",
    icon: "https://upload.wikimedia.org/wikipedia/en/1/1d/Logo_Roland-Garros.svg",
    seasons: [
      { name: "2026", slug: "85953", tvguide: TENNIS_MAJORS_TV_GUIDE },
      { name: "2025", slug: "61365" },
    ],
  },
  {
    name: "Wimbledon - Men's Singles",
    slug: "2361",
    icon: "https://upload.wikimedia.org/wikipedia/en/b/b9/Wimbledon.svg",
    seasons: [
      { name: "2026", slug: "85943", tvguide: TENNIS_MAJORS_TV_GUIDE },
      { name: "2025", slug: "63966" },
    ],
  },
  {
    name: "Wimbledon - Women's Singles",
    slug: "2600",
    icon: "https://upload.wikimedia.org/wikipedia/en/b/b9/Wimbledon.svg",
    seasons: [
      { name: "2026", slug: "85945", tvguide: TENNIS_MAJORS_TV_GUIDE },
      { name: "2025", slug: "63967" },
    ],
  },
  {
    name: "US Open - Men's Singles",
    slug: "2449",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Usopen-horizontal-logo.svg",
    seasons: [
      // { name: "2026", slug: "80012" },
      { name: "2025", slug: "67287", tvguide: TENNIS_MAJORS_TV_GUIDE },
    ],
  },
  {
    name: "US Open - Women's Singles",
    slug: "2601",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Usopen-horizontal-logo.svg",
    seasons: [
      // { name: "2026", slug: "80013" },
      { name: "2025", slug: "69937", tvguide: TENNIS_MAJORS_TV_GUIDE },
    ],
  },

  {
    name: "Brisbane International - Men's Singles",
    slug: "2437",
    icon: "https://upload.wikimedia.org/wikipedia/en/4/48/Brisbane_International_logo.svg",
    seasons: [{ name: "2026", slug: "80014", tvguide: TENNIS_MAJORS_TV_GUIDE }],
  },
  {
    name: "Brisbane International - Women's Singles",
    slug: "2644",
    icon: "https://upload.wikimedia.org/wikipedia/en/4/48/Brisbane_International_logo.svg",
    seasons: [{ name: "2026", slug: "85608", tvguide: TENNIS_MAJORS_TV_GUIDE }],
  },
  {
    name: "🇦🇺 Alex De Minaur",
    slug: "team/201239",
    seasons: [{ name: "Current", slug: "" }],
  },
  {
    name: "ATP Rankings",
    slug: RankingList.ATP,
    seasons: [{ name: "Current", slug: "current/ladder" }],
  },
  {
    name: "WTA Rankings",
    slug: RankingList.WTA,
    seasons: [{ name: "Current", slug: "current/ladder" }],
  },
]

export const TENNIS_LEAGUES_CLIENT = stripLeagueSeasonConfig(TENNIS_LEAGUES)
export const DARTS_CATEGORIES = ["104"]
export const DARTS_LEAGUES: LeagueSeasonConfig[] = [
  //Majors
  // The premier event of darts: large global field, sets format.
  {
    name: "World Darts Championship",
    slug: "616",
    seasons: [
      // { name: "26/27", slug: "85121" },
      { name: "25/26", slug: "85121" },
      { name: "24/25", slug: "68103" },
    ],
  },
  // Top 24 + 8 qualifiers. 2 leg sets. Encourages fast and unpredictable matches.
  {
    name: "World Masters",
    slug: "1548",
    seasons: [
      { name: "2026", slug: "84672" },
      { name: "2025", slug: "69486" },
    ],
  },
  // An open-format major with a random draw, allowing amateurs and pros to compete together. FA Cup of Darts
  {
    name: "UK Open",
    slug: "670",
    seasons: [
      { name: "2026", slug: "84753" },
      { name: "2025", slug: "69483" },
    ],
  },
  // A national teams event where countries compete in pairs for international glory.
  {
    name: "World Cup of Darts",
    slug: "1744",
    seasons: [
      {
        name: "2026",
        slug: "84794",
        ladderConfig: ladderConfigMap({
          placingCategories: [{ label: "Knockout", position: [1] }],
        }),
      },
      { name: "2025", slug: "76322" },
    ],
  },

  // An elite 32-player event known for high-quality matches and a legs-only format.
  {
    name: "World Matchplay",
    slug: "689",
    seasons: [
      // { name: "2026", slug: "85121" },
      { name: "2025", slug: "69484" },
    ],
  },
  // A unique major requiring players to start and finish legs on a double (double-in, double-out).
  {
    name: "World Grand Prix",
    slug: "751",
    seasons: [
      // { name: "2026", slug: "85121" },
      { name: "2025", slug: "69485" },
    ],
  },
  // A mixed-format event with group stages and knockout rounds featuring cross-competition qualifiers.
  {
    name: "Grand Slam of Darts",
    slug: "597",
    seasons: [
      // { name: "2026", slug: "85815" },
      { name: "2025", slug: "85815" },
    ],
  },
  //Leagues
  // Premier weekly league featuring top 8 players
  {
    name: "Premier League Darts",
    slug: "11565",
    seasons: [
      { name: "2026", slug: "84759" },
      { name: "2025", slug: "69498" },
    ],
  },
  //Exhibition tournaments around the world
  {
    name: "World Series of Darts - Australian Darts Masters",
    slug: "23242",
    seasons: [
      // { name: "2026", slug: "85121" },
      { name: "2025", slug: "69511" },
    ],
  },
  {
    name: "World Series of Darts - Finals",
    slug: "11545",
    seasons: [
      // { name: "2026", slug: "85121" },
      { name: "2025", slug: "69497" },
    ],
  },
  //Regular weekly league for PDC Tour members
  {
    name: "Players Championship - Season",
    slug: "2066",
    seasons: [
      // { name: "2026", slug: "85121" },
      { name: "2025", slug: "71945" },
    ],
  },
  {
    name: "Players Championship - Finals",
    slug: "631",
    seasons: [
      // { name: "2026", slug: "85121" },
      { name: "2025", slug: "69482" },
    ],
  },
  //Regular weekly league of European Tour events for PDC Tour members
  {
    name: "European Championship",
    slug: "592",
    seasons: [
      // { name: "2026", slug: "85121" },
      { name: "2025", slug: "69481" },
    ],
  },
  {
    name: "PDC Rankings",
    slug: "rankings",
    externalURL: "https://www.pdc.tv/rankings#World_Rankings",
    seasons: [{ name: "Current", slug: "external" }],
  },
]

export const DARTS_LEAGUES_CLIENT = stripLeagueSeasonConfig(DARTS_LEAGUES)

export const RUGBY_UNION_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "Super Rugby",
    slug: "422",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/alpxhe1675871443.png/small",
    seasons: [
      {
        name: "2026",
        slug: "86502",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "2025",
        slug: "69795",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "2024",
        slug: "56889",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
      {
        name: "2023",
        slug: "47476",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_6_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "Rugby Championship",
    slug: "789",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/dy0n4c1716684531.png/small",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2025", slug: "76747" },
      { name: "2024", slug: "61372" },
    ],
  },
  {
    name: "Six Nations",
    slug: "423",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/7h1wr91738670253.png/small",
    seasons: [
      { name: "2026", slug: "86339" },
      { name: "2025", slug: "59195" },
      { name: "2024", slug: "49850" },
    ],
  },
  {
    name: "Super Rugby AUS",
    slug: "29227",
    seasons: [{ name: "2025", slug: "82008" }],
  },
  {
    name: "Queensland Premier Rugby",
    slug: "2048",
    excludeFromToday: true,
    seasons: [
      {
        name: "2026",
        slug: "87649",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_4_LADDER_CONFIG,
        }),
      },
      {
        name: "2025",
        slug: "69968",
        ladderConfig: ladderConfigMap({
          placingCategories: FINALS_TOP_4_LADDER_CONFIG,
        }),
      },
    ],
  },
  {
    name: "Int. Friendly Games",
    slug: "876",
    seasons: [
      { name: "2026", slug: "87128" },
      { name: "2025", slug: "69572" },
    ],
  },
  {
    name: "World Cup",
    slug: "421",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/1otaxh1773613283.png/small",
    seasons: [
      { name: "2023", slug: "46701" },
      { name: "2019", slug: "19518" },
      { name: "2015", slug: "10282" },
      { name: "2011", slug: "1349" },
      { name: "2007", slug: "42997" },
    ],
  },
  {
    name: "World Cup - Women",
    slug: "1826",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/vphokh1755422562.png/small",
    seasons: [
      { name: "2025", slug: "69966" },
      { name: "2022", slug: "45694" },
      { name: "2017", slug: "13261" },
      { name: "2014", slug: "8696" },
    ],
  },
  {
    name: "British and Irish Lions Tour",
    slug: "27512",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/iob1un1737973257.png/small",
    seasons: [
      { name: "2025", slug: "77221" },
      { name: "2024", slug: "57568" },
    ],
  },

  {
    name: "Rugby Sevens World Series",
    slug: "10055",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6f/SVNS_Logo_%282023%29.svg",
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_SVNS",
    seasons: [
      { name: "25/26", slug: "85821" },
      { name: "24/25", slug: "68941" },
    ],
  },
  {
    name: "Rugby Sevens World Series - Women",
    slug: "11623",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6f/SVNS_Logo_%282023%29.svg",
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_SVNS",
    seasons: [
      { name: "25/26", slug: "85845" },
      { name: "24/25", slug: "68964" },
    ],
  },
  {
    name: "World Cup Sevens",
    slug: "11276",
    icon: "https://upload.wikimedia.org/wikipedia/en/c/c5/Rugby_World_Cup_Sevens_logo.png",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2022", slug: "45756" },
    ],
  },
  {
    name: "World Cup Sevens - Women",
    slug: "11277",
    icon: "https://upload.wikimedia.org/wikipedia/en/c/c5/Rugby_World_Cup_Sevens_logo.png",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2022", slug: "45757" },
    ],
  },
]

export const RUGBY_UNION_LEAGUES_CLIENT =
  stripLeagueSeasonConfig(RUGBY_UNION_LEAGUES)

const NHL_TV_GUIDE: TVConfig = {
  channels: [
    tvGuideConfigCreate(TVChannel.KAYO, 0, ICE_HOCKEY_MATCH_LENGTH),
    tvGuideConfigCreate(TVChannel.DISNEY_PLUS, 0, ICE_HOCKEY_MATCH_LENGTH),
  ],
}

export const ICE_HOCKEY_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "AIHL",
    slug: "11059",
    icon: "https://upload.wikimedia.org/wikipedia/en/f/f6/Australian_Ice_Hockey_League_Logo.png",
    seasons: [
      { name: "2026", slug: "86527" },
      { name: "2025", slug: "72392" },
    ],
  },
  {
    name: "NHL",
    slug: "234",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/4cem2k1619616539.png/small",
    seasons: [
      {
        name: "25/26",
        slug: "78476",
        ladderConfig: NHL_2014_LADDER_CONFIG,
        tvguide: NHL_TV_GUIDE,
      },
      { name: "24/25", slug: "63409", ladderConfig: NHL_2014_LADDER_CONFIG },
    ],
    display: DisplayTypes.DATE,
  },
  {
    name: "World Championship",
    slug: "3",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/ayqln81768730313.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Men%27s_Ice_Hockey_World_Championships",
    seasons: [
      { name: "2026", slug: "81043" },
      { name: "2025", slug: "64007" },
    ],
  },

  {
    name: "World Championship - Australia Men",
    slug: "13446",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_IIHF_World_Championship_Division_II",
    seasons: [
      { name: "2026", slug: "wiki" },
      { name: "2025", slug: "69168" },
    ],
  },
  {
    name: "World Championship - Women",
    slug: "428",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Women%27s_Ice_Hockey_World_Championships",
    seasons: [
      { name: "2026", slug: "wiki" },
      { name: "2025", slug: "69237" },
    ],
  },
  {
    name: "World Championship - Australia Women",
    slug: "wc-div2",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_IIHF_Women%27s_World_Championship_Division_II",
    seasons: [{ name: "2026", slug: "wiki" }],
  },

  {
    name: "Int. Friendly Games",
    slug: "873",
    seasons: [
      { name: "2026", slug: "87173" },
      { name: "2025", slug: "69568" },
    ],
  },
]

export const ICE_HOCKEY_LEAGUES_CLIENT =
  stripLeagueSeasonConfig(ICE_HOCKEY_LEAGUES)

export const NETBALL_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "Super Netball",
    slug: "4540",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/yik0t61557761303.png/small",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Suncorp_Super_Netball_season",
    seasons: [
      { name: "2026", slug: "2026" },
      { name: "2025", slug: "2025" },
    ],
  },
  {
    name: "Constellation Cup",
    slug: "5793",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/6edvvh1767868334.png/small",
    seasons: [
      // { name: "2026", slug: "2026" },
      { name: "2025", slug: "2025" },
    ],
  },
  {
    name: "World Cup",
    slug: "5790",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/mr5yp81767640096.png/small",
    seasons: [
      // { name: "2027", slug: "" },
      { name: "2023", slug: "2023" },
    ],
  },
  {
    name: "Quad Series",
    slug: "5792",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/31myvn1767785192.png/small",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2025", slug: "2025" },
    ],
  },
]

export const NETBALL_LEAGUES_CLIENT = stripLeagueSeasonConfig(NETBALL_LEAGUES)

const TOUR_DE_FRANCE_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      label: "Overall",
      headings: ["Rider", "Gap"],
      placingCategories: [
        { label: "Maillot Jaune", position: [1], colour: "bg-yellow-500" },
      ],
    },
    {
      label: "Mountain",
      headings: ["Rider", "Pts"],
      placingCategories: [
        { label: "Polka Dot Jersey", position: [1], colour: "bg-red-500" },
      ],
    },
    {
      label: "Sprint",
      headings: ["Rider", "Pts"],
      placingCategories: [
        { label: "Green Jersey", position: [1], colour: "bg-green-500" },
      ],
    },
    {
      label: "Young (U26)",
      headings: ["Rider", "Gap"],
      placingCategories: [
        { label: "White Jersey", position: [1], colour: "bg-white" },
      ],
    },
    {
      label: "Teams",
      headings: ["Team", "Gap"],
    },
    {
      label: "Session",
      headings: ["Rider", "Gap"],
    },
  ],
}

const GIRO_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      label: "Overall",
      headings: ["Rider", "Gap"],
      placingCategories: [
        { label: "Maglia Rosa", position: [1], colour: "bg-pink-500" },
      ],
    },
    {
      label: "Mountain",
      headings: ["Rider", "Pts"],
      placingCategories: [
        { label: "Blue Jersey", position: [1], colour: "bg-blue-500" },
      ],
    },
    {
      label: "Sprint",
      headings: ["Rider", "Pts"],
      placingCategories: [
        { label: "Red Jersey", position: [1], colour: "bg-red-500" },
      ],
    },
    {
      label: "Young (U26)",
      headings: ["Rider", "Gap"],
      placingCategories: [
        { label: "White Jersey", position: [1], colour: "bg-white" },
      ],
    },
    {
      label: "Teams",
      headings: ["Team", "Gap"],
    },
    {
      label: "Session",
      headings: ["Rider", "Gap"],
    },
  ],
}

const VUELTA_LADDER_CONFIG: LadderConfig = {
  ladderGroup: [
    {
      label: "Overall",
      headings: ["Rider", "Gap"],
      placingCategories: [
        { label: "Maillot Rojo", position: [1], colour: "bg-red-500" },
      ],
    },
    {
      label: "Mountain",
      headings: ["Rider", "Pts"],
      placingCategories: [
        { label: "Polka Dot Jersey", position: [1], colour: "bg-blue-500" },
      ],
    },
    {
      label: "Sprint",
      headings: ["Rider", "Pts"],
      placingCategories: [
        { label: "Green Jersey", position: [1], colour: "bg-green-500" },
      ],
    },
    {
      label: "Young (U26)",
      headings: ["Rider", "Gap"],
      placingCategories: [
        { label: "White Jersey", position: [1], colour: "bg-white" },
      ],
    },
    {
      label: "Teams",
      headings: ["Team", "Gap"],
    },
    {
      label: "Session",
      headings: ["Rider", "Gap"],
    },
  ],
}

export const CYCLING_TOURS: LeagueSeasonConfig[] = [
  {
    name: "UCI World Tour - Men",
    slug: "9",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/igahc11535183469.png/small",
    seasons: [
      { name: "2026", slug: "220825" },
      { name: "2025", slug: "210189" },
    ],
  },
  {
    name: "UCI World Tour - Women",
    slug: "94",
    icon: "https://r2.thesportsdb.com/images/media/league/badge/ozlln81659718492.png/small",
    seasons: [
      { name: "2026", slug: "220906" },
      { name: "2025", slug: "209791" },
    ],
  },
  {
    name: "Tour de France",
    slug: "le-tour",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/50/Tour_de_France_logo_%28black_background%29.svg",
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Tour_de_France#Route_and_stages",
    seasons: [
      {
        name: "2026",
        slug: "220828",
        ladderConfig: TOUR_DE_FRANCE_LADDER_CONFIG,
      },
      {
        name: "2025",
        slug: "210217",
        ladderConfig: TOUR_DE_FRANCE_LADDER_CONFIG,
      },
    ],
  },
  {
    name: "Giro d'Italia",
    slug: "giro",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Giro_d%27Italia_-_Logo_2018.svg",
    seasons: [
      { name: "2026", slug: "220827", ladderConfig: GIRO_LADDER_CONFIG },
    ],
  },
  {
    name: "Vuelta a España",
    slug: "vuelta",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/4b/La_Vuelta_%28Spain%29_logo.svg",
    seasons: [
      { name: "2026", slug: "220829", ladderConfig: VUELTA_LADDER_CONFIG },
    ],
  },
  {
    name: "Tour Down Under",
    slug: "tour-down-under",
    icon: "https://upload.wikimedia.org/wikipedia/en/d/dd/Tour_Down_Under_logo.svg",
    seasons: [
      {
        name: "2026",
        slug: "221114",
        ladderConfig: ladderConfigMap({
          label: "Overall",
          headings: ["Rider", "Gap"],
          placingCategories: [
            {
              label: "Ochre Jersey",
              position: [1],
              colour: "bg-[#CC7722]",
            },
          ],
        }),
      },
    ],
  },
  {
    name: "Cadel Evans Great Ocean Road Race",
    slug: "cadel",
    icon: "https://upload.wikimedia.org/wikipedia/en/a/a1/Cadel_Evans_Great_Ocean_Road_Race-logo_2023.png",
    seasons: [{ name: "2026", slug: "221115" }],
  },
  {
    name: "UCI World Championship TT",
    slug: "world-tt",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Jersey_rainbow.svg",
    seasons: [{ name: "2026", slug: "220913" }],
  },
  {
    name: "UCI World Championship RR",
    slug: "world-rr",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Jersey_rainbow.svg",
    seasons: [{ name: "2026", slug: "220912" }],
  },
]

export const CYCLING_TOURS_CLIENT = stripLeagueSeasonConfig(CYCLING_TOURS)

const SURFING_BROADCAST_LENGTH = 23
export const SURFING_TOURS: LeagueSeasonConfig[] = [
  {
    name: "WSL",
    slug: "wsl",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6d/World_Surf_League_Logo.png",
    externalURL: "https://www.worldsurfleague.com/events/2026/ct",
    seasons: [
      {
        name: "2026",
        slug: "2026",
        tvguide: {
          channels: [
            tvGuideConfigCreate(TVChannel.KAYO, 0, SURFING_BROADCAST_LENGTH),
            tvGuideConfigCreate(
              TVChannel.SEVEN_PLUS,
              0,
              SURFING_BROADCAST_LENGTH,
            ),
          ],
        },
      },
    ],
  },
]

export const SURFING_TOURS_CLIENT = stripLeagueSeasonConfig(SURFING_TOURS)
