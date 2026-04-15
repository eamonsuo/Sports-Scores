import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import { PLAYOFF_PICTURE_TYPE } from "@/lib/playoffPictureMapping";
import { DISPLAY_TYPES } from "@/types/misc";
import { resolveSportImage } from "./imageMapping";

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
}));

export const RUGBY_LEAGUE_LADDER_HEADINGS = [
  "P",
  "W",
  "D",
  "Diff",
  "Pts",
] as const;
export const FOOTBALL_LADDER_HEADINGS = ["P", "W", "D", "L", "Pts"] as const;
export const AUSSIE_RULES_LADDER_HEADINGS = [
  "P",
  "W",
  "D",
  "%",
  "Pts",
] as const;
export const BASKETBALL_LADDER_HEADINGS = ["P", "W", "L", "PCT"] as const;
export const BASEBALL_LADDER_HEADINGS = ["P", "W", "L", "PCT"] as const;
export const ICE_HOCKEY_LADDER_HEADINGS = ["P", "W", "Diff", "Pts"] as const;
export const RUGBY_UNION_LADDER_HEADINGS = [
  "P",
  "W",
  "L",
  "Diff",
  "BP",
  "Pts",
] as const;
export const AMERICAN_FOOTBALL_LADDER_HEADINGS = ["P", "W", "L", "D"] as const;

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
}));

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
}));

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
}));

export const CRICKET_LEAGUES: LeagueSeasonConfig[] = [
  // {
  //   name: "WTC",
  //   slug: "wtc",
  //   seasons: [{ name: "2025-2027", slug: "" }],
  // },
  {
    name: "IPL",
    slug: "india",
    seasons: [{ name: "2026", slug: "ipl" }],
    ladderConfig: [
      {
        placingCategories: [{ label: "Playoffs", position: [1, 2, 3, 4] }],
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
];

export const MOTORSPORT_CATEGORIES: LeagueSeasonConfig[] = [
  {
    name: "Formula 1",
    slug: "f1",
    seasons: [
      { name: "2026", slug: "2026" },
      { name: "2025", slug: "2025" },
      { name: "2024", slug: "2024" },
      { name: "2023", slug: "2023" },
    ],
  },
  {
    name: "Supercars",
    slug: "supercars",
    seasons: [{ name: "2026", slug: "2026" }],
  },
];

export const GOLF_TOURS: LeagueSeasonConfig[] = [
  {
    name: "PGA Tour",
    slug: "pga",
    seasons: [
      { name: "2026", slug: "2026" },
      { name: "2025", slug: "2025" },
    ],
  },
  {
    name: "LIV Golf",
    slug: "liv",
    seasons: [
      { name: "2026", slug: "2026" },
      { name: "2025", slug: "2025" },
    ],
  },
  {
    name: "LPGA Tour",
    slug: "lpga",
    seasons: [{ name: "2026", slug: "" }],
  },
  {
    name: "DP World Tour",
    slug: "dpworld",
    seasons: [{ name: "2026", slug: "" }],
  },
  {
    name: "PGA Tour Australasia",
    slug: "australasia",
    seasons: [{ name: "25/26", slug: "" }],
  },
  {
    name: "TGL",
    slug: "tgl",
    seasons: [{ name: "2026", slug: "" }],
  },
  {
    name: "OWGR",
    slug: "owgr",
    seasons: [
      { name: "Current", slug: "2026" },
      { name: "2025", slug: "2025" },
    ],
  },
];

export const RUGBY_LEAGUE_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "NRL",
    slug: "294",
    seasons: [
      { name: "2026", slug: "86317" },
      { name: "2025", slug: "69277" },
      { name: "2024", slug: "56749" },
      { name: "2023", slug: "47382" },
      { name: "2022", slug: "39630" },
      { name: "2021", slug: "34941" },
      { name: "2020", slug: "26032" },
      { name: "2019", slug: "19487" },
      { name: "2018", slug: "15699" },
      { name: "2017", slug: "12722" },
      { name: "2016", slug: "11327" },
      { name: "2015", slug: "9762" },
      { name: "2014", slug: "7520" },
      { name: "2013", slug: "5709" },
      { name: "2012", slug: "4092" },
      { name: "2011", slug: "3178" },
      { name: "2010", slug: "2597" },
      { name: "2009", slug: "1974" },
      { name: "2008", slug: "1153" },
      { name: "2007", slug: "42987" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Finals - Second Chance", position: [1, 2, 3, 4] },
          { label: "Finals", position: [5, 6, 7, 8] },
        ],
        playoffPictureConfig: PLAYOFF_PICTURE_TYPE.TOP_8,
      },
    ],
    byes: NRL_TEAMS_NAME_LOGO,
  },
  {
    name: "NRLW",
    slug: "19120",
    seasons: [
      { name: "2026", slug: "87573" },
      { name: "2025", slug: "69964" },
      { name: "2024", slug: "56809" },
      { name: "2023", slug: "51393" },
    ],

    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5, 6] }],
      },
    ],
  },
  {
    name: "State of Origin",
    slug: "791",
    seasons: [
      { name: "2026", slug: "87571" },
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
    name: "Queensland Cup",
    slug: "2135",
    seasons: [
      { name: "2026", slug: "88763" },
      { name: "2025", slug: "69961" },
      { name: "2024", slug: "57514" },
      { name: "2023", slug: "48145" },
      { name: "2022", slug: "40184" },
      { name: "2021", slug: "35084" },
      { name: "2020", slug: "26865" },
      { name: "2019", slug: "22828" },
      { name: "2018", slug: "16174" },
      { name: "2017", slug: "12981" },
      { name: "2016", slug: "11366" },
      { name: "2015", slug: "10176" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Finals - Second Chance", position: [1, 2, 3, 4] },
          { label: "Finals", position: [5, 6, 7, 8] },
        ],
        playoffPictureConfig: PLAYOFF_PICTURE_TYPE.TOP_8,
      },
    ],
  },
  {
    name: "New South Wales Cup",
    slug: "2134",
    seasons: [
      { name: "2026", slug: "89006" },
      { name: "2025", slug: "69962" },
      { name: "2024", slug: "57568" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Finals - Second Chance", position: [1, 2, 3, 4] },
          { label: "Finals", position: [5, 6, 7, 8] },
        ],
        playoffPictureConfig: PLAYOFF_PICTURE_TYPE.TOP_8,
      },
    ],
  },
  {
    name: "World Cup",
    slug: "431",
    seasons: [
      { name: "2026", slug: "87548" },
      { name: "2021", slug: "42989" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Quarterfinals", position: [1, 2] }],
      },
    ],
  },
  {
    name: "World Cup - Women",
    slug: "10683",
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
    seasons: [
      { name: "2026", slug: "86986" },
      { name: "2025", slug: "69930" },
      { name: "2024", slug: "57044" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5, 6] }],
      },
    ],
  },
];

export const AUSSIE_RULES_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "AFL",
    slug: "656",
    seasons: [
      { name: "2026", slug: "86748" },
      { name: "2025", slug: "71308", ladderConfig: 1 },
      { name: "2024", slug: "58226", ladderConfig: 1 },
      { name: "2023", slug: "47887", ladderConfig: 1 },
      { name: "2022", slug: "39988", ladderConfig: 1 },
      { name: "2021", slug: "35137", ladderConfig: 1 },
      { name: "2020", slug: "26039", ladderConfig: 1 },
      { name: "2019", slug: "19486", ladderConfig: 1 },
      { name: "2018", slug: "15780", ladderConfig: 1 },
      { name: "2017", slug: "13037", ladderConfig: 1 },
      { name: "2016", slug: "11060", ladderConfig: 1 },
      { name: "2015", slug: "9775", ladderConfig: 1 },
      { name: "2014", slug: "7608", ladderConfig: 1 },
      { name: "2013", slug: "5633", ladderConfig: 1 },
      { name: "2012", slug: "4090", ladderConfig: 1 },
      { name: "2011", slug: "3166", ladderConfig: 1 },
      { name: "2010", slug: "2594", ladderConfig: 1 },
      { name: "2009", slug: "2099", ladderConfig: 1 },
      { name: "2008", slug: "1153", ladderConfig: 1 },
      { name: "2007", slug: "42987", ladderConfig: 1 },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Finals - Second Chance", position: [1, 2, 3, 4] },
          { label: "Finals", position: [5, 6] },
          { label: "Finals - Wildcard Round", position: [7, 8, 9, 10] },
        ],
      },
      {
        placingCategories: [
          { label: "Finals - Second Chance", position: [1, 2, 3, 4] },
          { label: "Finals", position: [5, 6, 7, 8] },
        ],
        playoffPictureConfig: PLAYOFF_PICTURE_TYPE.TOP_8,
      },
    ],
    byes: AFL_TEAM_NAME_LOGO,
  },
  {
    name: "AFLW",
    slug: "10159",
    seasons: [
      { name: "2025", slug: "76123" },
      { name: "2024", slug: "64462" },
      { name: "2023", slug: "54077" },
      { name: "2022 S7", slug: "45127" },
      { name: "2022", slug: "40037" },
      { name: "2021", slug: "35108" },
      { name: "2020", slug: "26102" },
      { name: "2019", slug: "20117" },
      { name: "2018", slug: "15781" },
      { name: "2017", slug: "12890" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Finals", position: [1, 2, 3, 4, 5, 6, 7, 8] },
        ],
      },
    ],
  },
  {
    name: "VFL",
    slug: "25506",
    seasons: [
      { name: "2026", slug: "90001" },
      { name: "2025", slug: "73301" },
      { name: "2024", slug: "57568" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Finals", position: [1, 2, 3, 4, 5, 6, 7, 8] },
        ],
      },
    ],
  },
  {
    name: "SANFL",
    slug: "20126",
    seasons: [
      { name: "2026", slug: "89835" },
      { name: "2025", slug: "71309" },
      { name: "2024", slug: "59236" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5] }],
      },
    ],
  },
  {
    name: "WAFL",
    slug: "20160",
    seasons: [
      { name: "2026", slug: "89836" },
      { name: "2025", slug: "71310" },
      { name: "2024", slug: "59237" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5] }],
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
];

export const AMERICAN_FOOTBALL_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "NFL",
    slug: "9464",
    seasons: [
      { name: "25/26", slug: "75522" },
      { name: "24/25", slug: "60592" },
      { name: "23/24", slug: "51361" },
      { name: "22/23", slug: "46786" },
      { name: "21/22", slug: "36422" },
      { name: "20/21", slug: "27719" },
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
    byes: NFL_TEAM_NAME_LOGO,
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
    name: "NCAA, Regular Season",
    slug: "19510",
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
];

export const FOOTBALL_LEAGUES: LeagueSeasonConfig[] = [
  //Australia - category 34
  {
    name: "🇦🇺 A-League Men",
    slug: "136",
    seasons: [
      { name: "25/26", slug: "82603" },
      { name: "24/25", slug: "64864" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5, 6] }],
      },
    ],
  },
  {
    name: "🇦🇺 A-League Women",
    slug: "1894",
    seasons: [
      { name: "25/26", slug: "82605" },
      { name: "24/25", slug: "66775" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5, 6] }],
      },
    ],
  },
  {
    name: "🇦🇺 Australia Cup",
    slug: "1786",
    seasons: [
      { name: "2025", slug: "75270" },
      { name: "2024", slug: "61199" },
    ],
  },
  {
    name: "🇦🇺 Australian Championship",
    slug: "29010",
    seasons: [{ name: "2025", slug: "81331" }],
  },
  {
    name: "🇦🇺 Australia Men",
    slug: "team/4741",
    seasons: [{ name: "--", slug: "" }],
  },
  {
    name: "🇦🇺 Australia Women",
    slug: "team/7410",
    seasons: [{ name: "--", slug: "" }],
  },
  //England - category 1
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
    slug: "17",
    seasons: [
      { name: "25/26", slug: "76986" },
      { name: "24/25", slug: "61627" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Champions League", position: [1, 2, 3, 4] },
          { label: "Europa League", position: [5] },
          { label: "Conference League", position: [6] },
          { label: "Relegation", position: [18, 19, 20], colour: "bg-red-500" },
        ],
      },
    ],
  },
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 WSL",
    slug: "1044",
    seasons: [
      { name: "25/26", slug: "79227" },
      { name: "24/25", slug: "64370" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Champions League - League Phase", position: [1, 2] },
          { label: "Champions League - Third Round Qualifiers", position: [3] },
          {
            label: "Relegation Play-off",
            position: [12],
            colour: "bg-red-500",
          },
        ],
      },
    ],
  },
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Championship",
    slug: "18",
    seasons: [
      { name: "25/26", slug: "77347" },
      { name: "24/25", slug: "61961" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Premier League Promotion", position: [1, 2] },
          { label: "Promotion Playoffs", position: [3, 4, 5, 6] },
          { label: "Relegation", position: [22, 23, 24], colour: "bg-red-500" },
        ],
      },
    ],
  },
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 FA Cup",
    slug: "19",
    seasons: [{ name: "25/26", slug: "82557" }],
  },
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Women's FA Cup",
    slug: "11666",
    seasons: [{ name: "25/26", slug: "84634" }],
  },
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 EFL Cup",
    slug: "21",
    seasons: [{ name: "25/26", slug: "77500" }],
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
    name: "🌍 FIFA World Cup",
    slug: "16",
    seasons: [
      { name: "2026", slug: "58210" },
      { name: "2022", slug: "41087" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Round of 32", position: [1, 2] },
          {
            label: "Possible Round of 32 - Best 8/12 3rd placed teams",
            position: [3],
          },
        ],
      },
    ],
  },
  {
    name: "🌍 FIFA World Cup Qualifiers",
    slug: "fifaQualifiers",
    seasons: [{ name: "2026", slug: "wiki" }],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification",
  },
  {
    name: "🌍 FIFA World Cup Qualifiers - Inter-Confed...",
    slug: "10618",
    seasons: [{ name: "2026", slug: "86613" }],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification",
  },
  {
    name: "🌍 FIFA Women's World Cup",
    slug: "290",
    seasons: [
      { name: "2023", slug: "46930" },
      { name: "2027", slug: "" },
    ],
  },
  {
    name: "🌍 FIFA Women's World Cup Qualifiers",
    slug: "fifaWQualifiers",
    seasons: [{ name: "2027", slug: "wiki" }],
    externalURL:
      "https://en.wikipedia.org/wiki/2027_FIFA_Women%27s_World_Cup_qualification",
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
    name: "🌍 FIFA Intercontinental Cup",
    slug: "23674",
    seasons: [{ name: "2025", slug: "78702" }],
  },
  {
    name: "🌍 FIFA Club World Cup",
    slug: "357",
    seasons: [{ name: "2025", slug: "69619" }],
  },
  // Asia - 1467
  {
    name: "🌏 AFC Asian Cup",
    slug: "246",
    seasons: [{ name: "2023", slug: "51384" }],
  },
  {
    name: "🌏 AFC Asian Cup - Women",
    slug: "1692",
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
    name: "🌏 AFC World Cup Qualifiers",
    slug: "308",
    seasons: [{ name: "23-25", slug: "53508" }],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(AFC)",
  },
  {
    name: "🌏 AFC Women's World Cup Qualifiers",
    slug: "308-women",
    seasons: [{ name: "26-27", slug: "wiki" }],
    externalURL:
      "https://en.wikipedia.org/wiki/2027_FIFA_Women%27s_World_Cup_qualification#AFC",
  },
  {
    name: "🌏 AFC Champions League Elite",
    slug: "463",
    seasons: [
      { name: "25/26", slug: "77010" },
      { name: "24/25", slug: "62485" },
    ],
  },
  {
    name: "🌏 AFC Women's Champions League",
    slug: "23009",
    seasons: [
      { name: "25/26", slug: "77726" },
      { name: "24/25", slug: "64146" },
    ],
  },
  // Europe - category 1465
  {
    name: "🇪🇺 UEFA Champions League",
    slug: "7",
    seasons: [{ name: "25/26", slug: "76953" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Round of 16 (seeded)", position: [1, 2, 3, 4, 5, 6, 7, 8] },
          {
            label: "Knockout Playoffs (seeded)",
            position: [9, 10, 11, 12, 13, 14, 15, 16],
          },
          {
            label: "Knockout Playoffs (unseeded)",
            position: [17, 18, 19, 20, 21, 22, 23, 24],
          },
        ],
      },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Champions_League",
  },
  {
    name: "🇪🇺 UEFA Women's Champions League",
    slug: "696",
    seasons: [{ name: "25/26", slug: "77328" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Quarter Finals (seeded)", position: [1, 2, 3, 4] },
          { label: "Knockout Playoffs (seeded)", position: [5, 6, 7, 8] },
          { label: "Knockout Playoffs (unseeded)", position: [9, 10, 11, 12] },
        ],
      },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Women%27s_Champions_League",
  },
  {
    name: "🇪🇺 UEFA Europa League",
    slug: "679",
    seasons: [{ name: "25/26", slug: "76984" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Round of 16 (seeded)", position: [1, 2, 3, 4, 5, 6, 7, 8] },
          {
            label: "Knockout Playoffs (seeded)",
            position: [9, 10, 11, 12, 13, 14, 15, 16],
          },
          {
            label: "Knockout Playoffs (unseeded)",
            position: [17, 18, 19, 20, 21, 22, 23, 24],
          },
        ],
      },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League",
  },
  {
    name: "🇪🇺 UEFA Conference League",
    slug: "17015",
    seasons: [{ name: "25/26", slug: "76960" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Round of 16 (seeded)", position: [1, 2, 3, 4, 5, 6, 7, 8] },
          {
            label: "Knockout Playoffs (seeded)",
            position: [9, 10, 11, 12, 13, 14, 15, 16],
          },
          {
            label: "Knockout Playoffs (unseeded)",
            position: [17, 18, 19, 20, 21, 22, 23, 24],
          },
        ],
      },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Conference_League",
  },

  {
    name: "🇪🇺 UEFA European Championship",
    slug: "1",
    seasons: [{ name: "2024", slug: "56953" }],
  },
  {
    name: "🇪🇺 UEFA European Women's Championship",
    slug: "477",
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
    seasons: [
      { name: "2026", slug: "86668" },
      { name: "2025", slug: "70158" },
    ],
    ladderConfig: [
      {
        placingCategories: [
          { label: "CONCACAF Champions Cup", position: [1] },
          {
            label: "Playoffs",
            position: [2, 3, 4, 5, 6, 7],
          },
          {
            label: "Wild Card",
            position: [8, 9],
          },
        ],
      },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Major_League_Soccer_season",
  },
  {
    name: "🇺🇸 NWSL",
    slug: "1690",
    seasons: [{ name: "2025", slug: "71412" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "CONCACAF Champions Cup", position: [1, 2] },
          {
            label: "Playoffs",
            position: [3, 4, 5, 6, 7, 8],
          },
        ],
      },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_National_Women%27s_Soccer_League_season",
  },
  // France - category 7
  {
    name: "🇫🇷 Ligue 1",
    slug: "34",
    seasons: [{ name: "25/26", slug: "77356" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Champions League", position: [1, 2, 3] },
          {
            label: "Champions League - Third Round Qualifiers",
            position: [4],
          },
          {
            label: "Europa League",
            position: [5],
          },
          {
            label: "Conference League",
            position: [6],
          },
          {
            label: "Relegation Playoffs",
            position: [16],
            colour: "bg-red-300",
          },
          {
            label: "Relegation",
            position: [17, 18],
            colour: "bg-red-500",
          },
        ],
      },
    ],
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_Ligue_1",
  },
  // Germany - category 30
  {
    name: "🇩🇪 Bundesliga",
    slug: "35",
    seasons: [{ name: "25/26", slug: "77333" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Champions League", position: [1, 2, 3, 4] },
          {
            label: "Europa League",
            position: [5],
          },
          {
            label: "Conference League",
            position: [6],
          },
          {
            label: "Relegation Playoffs",
            position: [16],
            colour: "bg-red-300",
          },
          {
            label: "Relegation",
            position: [17, 18],
            colour: "bg-red-500",
          },
        ],
      },
    ],
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_Bundesliga",
  },
  // Italy - category 31
  {
    name: "🇮🇹 Serie A",
    slug: "23",
    seasons: [{ name: "25/26", slug: "76457" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Champions League", position: [1, 2, 3, 4] },
          {
            label: "Europa League",
            position: [5],
          },
          {
            label: "Conference League",
            position: [6],
          },
          {
            label: "Relegation",
            position: [18, 19, 20],
            colour: "bg-red-500",
          },
        ],
      },
    ],
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_Serie_A",
  },
  // Spain - category 32
  {
    name: "🇪🇸 La Liga",
    slug: "8",
    seasons: [{ name: "25/26", slug: "77559" }],
    ladderConfig: [
      {
        placingCategories: [
          { label: "Champions League", position: [1, 2, 3, 4] },
          {
            label: "Europa League",
            position: [5],
          },
          {
            label: "Conference League",
            position: [6],
          },
          {
            label: "Relegation",
            position: [18, 19, 20],
            colour: "bg-red-500",
          },
        ],
      },
    ],
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_La_Liga",
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
];

export const BASEBALL_LEAGUES: LeagueSeasonConfig[] = [
  //Australia - category 34
  {
    name: "MLB",
    slug: "11205",
    seasons: [
      { name: "2026", slug: "84695" },
      { name: "2025", slug: "68611" },
      { name: "2024", slug: "57577" },
    ],
    display: DISPLAY_TYPES.DATE,
  },
  {
    name: "ALB",
    slug: "19445",
    seasons: [
      { name: "25/26", slug: "81328" },
      { name: "24/25", slug: "65318" },
    ],
  },
  {
    name: "World Baseball Classic",
    slug: "11207",
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
];

export const BASKETBALL_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "NBL",
    slug: "1524",
    seasons: [
      { name: "25/26", slug: "77205" },
      { name: "24/25", slug: "61848" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5, 6] }],
      },
    ],
  },
  {
    name: "WNBL",
    slug: "1506",
    seasons: [
      { name: "25/26", slug: "77204" },
      { name: "24/25", slug: "66424" },
    ],
  },
  {
    name: "NBA",
    slug: "132",
    seasons: [
      { name: "25/26", slug: "80229" },
      { name: "24/25", slug: "65360" },
    ],
    display: DISPLAY_TYPES.DATE,
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
    seasons: [
      { name: "2026", slug: "89004" },
      { name: "2025", slug: "69751" },
      { name: "2024", slug: "57477" },
    ],
    display: DISPLAY_TYPES.DATE,
  },
  {
    name: "March Madness",
    slug: "13434",
    seasons: [
      { name: "2026", slug: "91315" },
      // { name: "2024", slug: "57477" },
    ],
    display: DISPLAY_TYPES.DATE,
    externalURL:
      "https://en.wikipedia.org/wiki/2026_NCAA_Division_I_men%27s_basketball_tournament",
  },
  // {
  //   name: "Basketball World Cup",
  //   slug: "486",
  //   seasons: [
  //     { name: "2025", slug: "69751" },
  //     { name: "2024", slug: "57477" },
  //   ],
  // },
];

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
];

export const TENNIS_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "Australian Open - Mens Singles",
    slug: "2363",
    seasons: [
      { name: "2026", slug: "80012" },
      { name: "2025", slug: "69039" },
    ],
  },
  {
    name: "Australian Open - Womens Singles",
    slug: "2571",
    seasons: [
      { name: "2026", slug: "80013" },
      { name: "2025", slug: "67042" },
    ],
  },
  {
    name: "Australian Open - Mens Doubles",
    slug: "2455",
    seasons: [{ name: "2026", slug: "85948" }],
  },
  {
    name: "Australian Open - Womens Doubles",
    slug: "2650",
    seasons: [{ name: "2026", slug: "85949" }],
  },
  {
    name: "Australian Open - Mixed Doubles",
    slug: "2403",
    seasons: [{ name: "2026", slug: "85950" }],
  },

  {
    name: "Brisbane International - Men",
    slug: "2437",
    seasons: [{ name: "2026", slug: "80014" }],
  },
  {
    name: "Brisbane International - Women",
    slug: "2644",
    seasons: [{ name: "2026", slug: "85608" }],
  },
  {
    name: "ATP Rankings",
    slug: "atpRank",
    seasons: [{ name: "Current", slug: "" }],
  },
  {
    name: "WTA Rankings",
    slug: "wtaRank",
    seasons: [{ name: "Current", slug: "" }],
  },
];

export const DARTS_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "Home",
    slug: "",
    seasons: [{ name: "N/A", slug: "" }],
  },
  {
    name: "2026 World Champs",
    slug: "world-champs",
    seasons: [{ name: "2026", slug: "" }],
  },
  {
    name: "FlashScore",
    slug: "all",
    seasons: [
      { name: "25/26", slug: "" },
      { name: "24/25", slug: "" },
    ],
  },
  {
    name: "PDC Tournaments",
    slug: "pdc",
    seasons: [
      { name: "25/26", slug: "" },
      { name: "24/25", slug: "" },
    ],
  },
];

export const RUGBY_UNION_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "Super Rugby",
    slug: "422",
    seasons: [
      { name: "2026", slug: "86502" },
      { name: "2025", slug: "69795" },
      { name: "2024", slug: "56889" },
      { name: "2023", slug: "47476" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4, 5, 6] }],
      },
    ],
  },
  {
    name: "Rugby Championship",
    slug: "789",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2025", slug: "76747" },
      { name: "2024", slug: "61372" },
    ],
  },
  {
    name: "Six Nations",
    slug: "423",
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
    seasons: [
      { name: "2026", slug: "87649" },
      { name: "2025", slug: "69968" },
    ],
    ladderConfig: [
      {
        placingCategories: [{ label: "Finals", position: [1, 2, 3, 4] }],
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
    seasons: [
      { name: "2025", slug: "77221" },
      { name: "2024", slug: "57568" },
    ],
  },

  {
    name: "Rugby Sevens World Series",
    slug: "10055",
    seasons: [
      { name: "25/26", slug: "85821" },
      { name: "24/25", slug: "68941" },
    ],
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_SVNS",
  },
  {
    name: "Rugby Sevens World Series - Women",
    slug: "11623",
    seasons: [
      { name: "25/26", slug: "85845" },
      { name: "24/25", slug: "68964" },
    ],
    externalURL: "https://en.wikipedia.org/wiki/2025%E2%80%9326_SVNS",
  },
  {
    name: "World Cup Sevens",
    slug: "11276",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2022", slug: "45756" },
    ],
  },
  {
    name: "World Cup Sevens - Women",
    slug: "11277",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2022", slug: "45757" },
    ],
  },
];

export const ICE_HOCKEY_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "AIHL",
    slug: "11059",
    seasons: [
      { name: "2026", slug: "86527" },
      { name: "2025", slug: "72392" },
    ],
  },
  {
    name: "NHL",
    slug: "234",
    seasons: [
      { name: "25/26", slug: "78476" },
      { name: "24/25", slug: "63409" },
    ],
    display: DISPLAY_TYPES.DATE,
  },
  {
    name: "World Championship",
    slug: "3",
    seasons: [
      { name: "2026", slug: "81043" },
      { name: "2025", slug: "64007" },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Men%27s_Ice_Hockey_World_Championships",
  },

  {
    name: "World Championship - Australia",
    slug: "13446",
    seasons: [
      { name: "2026", slug: "wiki" },
      { name: "2025", slug: "69168" },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_IIHF_World_Championship_Division_II",
  },
  {
    name: "World Championship - Women",
    slug: "428",
    seasons: [
      { name: "2026", slug: "wiki" },
      { name: "2025", slug: "69237" },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Women%27s_Ice_Hockey_World_Championships",
  },
  {
    name: "World Championship - Women - Australia",
    slug: "wc-div2",
    seasons: [{ name: "2026", slug: "wiki" }],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_IIHF_Women%27s_World_Championship_Division_II",
  },

  {
    name: "Int. Friendly Games",
    slug: "873",
    seasons: [
      { name: "2026", slug: "87173" },
      { name: "2025", slug: "69568" },
    ],
  },
];

export const NETBALL_LEAGUES: LeagueSeasonConfig[] = [
  {
    name: "Super Netball",
    slug: "4540",
    seasons: [
      { name: "2026", slug: "2026" },
      { name: "2025", slug: "2025" },
    ],
    externalURL:
      "https://en.wikipedia.org/wiki/2026_Suncorp_Super_Netball_season",
  },
  {
    name: "Constellation Cup",
    slug: "5793",
    seasons: [
      // { name: "2026", slug: "2026" },
      { name: "2025", slug: "2025" },
    ],
  },
  {
    name: "World Cup",
    slug: "5790",
    seasons: [
      // { name: "2027", slug: "" },
      { name: "2023", slug: "2023" },
    ],
  },
  {
    name: "Quad Series",
    slug: "5792",
    seasons: [
      // { name: "2026", slug: "" },
      { name: "2025", slug: "2025" },
    ],
  },
];

export const CYCLING_TOURS: LeagueSeasonConfig[] = [
  {
    name: "Men",
    slug: "9",
    seasons: [
      { name: "2026", slug: "220825" },
      { name: "2025", slug: "210189" },
    ],
  },
  {
    name: "Women",
    slug: "94",
    seasons: [
      { name: "2026", slug: "220906" },
      { name: "2025", slug: "209791" },
    ],
  },
  {
    name: "Tour de France",
    slug: "",
    seasons: [
      { name: "2026", slug: "" },
      { name: "2025", slug: "210217" },
    ],
  },
];
