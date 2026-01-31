import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import { SportEvent } from "@/types/event-calendar";
import { format } from "date-fns";

const formatDate = (date: Date) => format(date, "d MMM");
const formatDateYear = (date: Date) => format(date, "d MMM yyyy");

// Event Data
export const upcomingAndCurrentEvents: SportEvent[] = [
  // American Football
  {
    id: "rs-nfl-2026",
    name: "NFL",
    sport: "American Football",
    type: "regular-season",
    startDate: new Date("2025-09-04"),
    endDate: new Date("2026-02-09"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg",
    link: "/sports/american-football/9464/75522",
    notes: "Playoffs Start: Jan 10 \nSuperbowl: Feb 9",
  },
  {
    id: "10",
    name: "Superbowl LX",
    sport: "American Football",
    type: "major",
    startDate: new Date("2026-02-09"),
    endDate: new Date("2026-02-09"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Super_Bowl_LX_Logo.svg/1280px-Super_Bowl_LX_Logo.svg.png",
    link: "/sports/american-football/9464/75522",
    location: "Santa Clara, California, USA",
    tags: ["👨"],
    notes: "Halftime Show: Bad Bunny",
  },
  {
    id: "17",
    name: "NFL Draft",
    sport: "American Football",
    type: "major",
    startDate: new Date("2026-04-23"),
    endDate: new Date("2026-04-25"),
    link: "https://www.nfl.com/draft",
    location: "USA",
    tags: ["👨"],
  },

  // Athletics
  {
    id: "16",
    name: "World Athletics Indoor Championships",
    sport: "Athletics",
    type: "major",
    startDate: new Date("2026-03-20"),
    endDate: new Date("2026-03-22"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/World_Athletics_logo.svg",
    link: "https://en.wikipedia.org/wiki/2026_World_Athletics_Indoor_Championships",
    location: "Kujawy-Pomorze, Poland",
    tags: ["👨", "👩"],
  },

  // Aussie Rules
  {
    id: "rs-afl-2026",
    name: "AFL",
    sport: "Aussie Rules",
    type: "regular-season",
    startDate: new Date("2026-03-05"),
    endDate: new Date("2026-09-26"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/91/AFL-Logo_RGB_white_border.png",
    link: "/sports/aussie-rules/656/86748",
    notes: "Finals Series Start: Aug 29 \nGrand Final: Sep 26",
  },
  {
    id: "rs-aflw-2026",
    name: "AFLW",
    sport: "Aussie Rules",
    type: "regular-season",
    startDate: new Date("2026-08-10"),
    endDate: new Date("2026-11-28"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/b/b1/AFL_Women%27s_logo.svg",
    link: "/sports/aussie-rules/10159/76123",
  },
  {
    id: "46",
    name: "AFL Grand Final",
    sport: "Aussie Rules",
    type: "major",
    startDate: new Date("2026-09-26"),
    endDate: new Date("2026-09-26"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/91/AFL-Logo_RGB_white_border.png",
    link: "/sports/aussie-rules/656/86748",
    location: "Melbourne, Australia",
    tags: ["👨"],
  },

  // Baseball
  {
    id: "11",
    name: "World Baseball Classic",
    sport: "Baseball",
    type: "major",
    startDate: new Date("2026-03-05"),
    endDate: new Date("2026-03-17"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/WBC_logo.svg",
    link: "/sports/baseball/11207/75868",
    location: "Japan, Puerto Rico, USA",
    tags: ["👨"],
  },
  {
    id: "rs-mlb-2026",
    name: "MLB ",
    sport: "Baseball",
    type: "regular-season",
    startDate: new Date("2026-03-25"),
    endDate: new Date("2026-11-01"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a6/Major_League_Baseball_logo.svg",
    link: "/sports/baseball/11205/84695",
    // dateDisplay: `${formatDate(new Date("2026-03-25"))} - Nov 2026`,
    notes: "Playoffs Start: Sep 30 \nWorld Series: Oct 24 - Nov 1",
  },
  {
    id: "34",
    name: "World Series",
    sport: "Baseball",
    type: "major",
    startDate: new Date("2026-10-24"),
    endDate: new Date("2026-11-01"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a6/Major_League_Baseball_logo.svg",
    link: "/sports/baseball/11205/84695",
    location: "USA",
    tags: ["👨"],
    // notes: "Game 1: Oct 24 \nGame 7: Nov 1 (if necessary)",
  },

  // Basketball
  {
    id: "rs-nbl-2026",
    name: "NBL ",
    sport: "Basketball",
    type: "regular-season",
    startDate: new Date("2025-09-18"),
    endDate: new Date("2026-04-15"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/b/b2/NBL_%28Australia%29_logo.svg",
    link: "/sports/basketball/1524/77205",
    dateDisplay: `${formatDateYear(new Date("2025-09-18"))} - Apr 2026`,
    notes: "NBL Finals: March - April 2026",
  },
  {
    id: "rs-nba-2026",
    name: "NBA",
    sport: "Basketball",
    type: "regular-season",
    startDate: new Date("2025-10-21"),
    endDate: new Date("2026-06-20"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg",
    link: "/sports/basketball/132/80229",
    notes: "Playoffs Start: Apr 15 \nNBA Finals: Jun 4",
  },
  {
    id: "rs-wnba-2026",
    name: "WNBA",
    sport: "Basketball",
    type: "regular-season",
    startDate: new Date("2026-05-09"),
    endDate: new Date("2026-10-24"),
    dateDisplay: `${formatDate(new Date("2026-05-09"))} - Oct 2026`,
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/97/WNBA_logo.svg",
    link: "/sports/basketball/",
    notes: "Playoffs Start: Sep 25 \nWNBA Finals: ??",
  },
  {
    id: "15",
    name: "March Madness",
    sport: "Basketball",
    type: "major",
    startDate: new Date("2026-03-17"),
    endDate: new Date("2026-04-06"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/March_Madness_logo.svg",
    link: "/sports/basketball",
    location: "USA",
    tags: ["👨", "👩"],
  },
  {
    id: "49",
    name: "NBL Finals",
    sport: "Basketball",
    type: "major",
    startDate: new Date("2026-03-01"),
    endDate: new Date("2026-04-15"),
    dateDisplay: "March - April 2026",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/76/NBL_Finals.png",
    link: "/sports/basketball/1524/77205",
    location: "Australia",
    tags: ["👨"],
  },
  {
    id: "49nba",
    name: "NBA Finals",
    sport: "Basketball",
    type: "major",
    startDate: new Date("2026-06-04"),
    endDate: new Date("2026-06-20"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/44/NBA_Finals_logo_%282022%29.svg",
    link: "/sports/basketball/132/80229",
    location: "USA",
    tags: ["👨"],
  },
  {
    id: "28",
    name: "FIBA Basketball World Cup",
    sport: "Basketball",
    type: "major",
    startDate: new Date("2026-09-04"),
    endDate: new Date("2026-09-13"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/3/3f/FIBA_Women%27s_Basketball_World_Cup_Germany%2726_logo.svg",
    link: "/sports/basketball",
    location: "Berlin, Germany",
    tags: ["👩"],
  },

  // Cricket
  {
    id: "7",
    name: "ICC Under-19 World Cup",
    sport: "Cricket",
    type: "major",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-02-06"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/5f/2026_Under-19_Cricket_World_Cup_logo.svg",
    link: "/sports/cricket/main/matches",
    location: "Zimbabwe & Namibia",
    tags: ["👨"],
  },
  {
    id: "3",
    name: "ICC T20 World Cup",
    sport: "Cricket",
    type: "major",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-23"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/fa/2026_ICC_Men%27s_T20_World_Cup_logo.svg",
    link: "/sports/cricket/main/matches",
    location: "India & Sri Lanka",
    tags: ["👨"],
  },
  {
    id: "39",
    name: "Australia vs India",
    sport: "Cricket",
    type: "major",
    startDate: new Date("2026-02-15"),
    endDate: new Date("2026-03-09"),
    // imageUrl:
    //   "https://upload.wikimedia.org/wikipedia/en/0/05/World_Test_Championship_Logo.svg",
    link: "/sports/cricket/main/matches",
    location: "Australia",
    tags: ["👩"],
  },
  {
    id: "9",
    name: "ICC T20 World Cup",
    sport: "Cricket",
    type: "major",
    startDate: new Date("2026-06-12"),
    endDate: new Date("2026-07-05"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/8/87/2026_ICC_Women%27s_T20_World_Cup_Logo.svg",
    link: "/sports/cricket/main/matches",
    location: "England & Wales",
    tags: ["👩"],
  },
  {
    id: "40",
    name: "Australia vs South Africa",
    sport: "Cricket (Tests)",
    type: "major",
    startDate: new Date("2026-09-01"),
    endDate: new Date("2026-10-01"),
    dateDisplay: "Sep - Oct 2026",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/05/World_Test_Championship_Logo.svg",
    link: "/sports/cricket/main/matches",
    location: "South Africa",
    tags: ["👨"],
  },
  {
    id: "41",
    name: "Australia vs New Zealand",
    sport: "Cricket (Tests)",
    type: "major",
    startDate: new Date("2026-12-01"),
    endDate: new Date("2027-01-01"),
    dateDisplay: "Dec 2026 - Jan 2027",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/05/World_Test_Championship_Logo.svg",
    link: "/sports/cricket/main/matches",
    location: "Australia",
    tags: ["👨"],
  },
  {
    id: "42",
    name: "Australia vs India",
    sport: "Cricket (Tests)",
    type: "major",
    startDate: new Date("2027-01-01"),
    endDate: new Date("2027-02-01"),
    dateDisplay: "Jan - Feb 2027",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/05/World_Test_Championship_Logo.svg",
    link: "/sports/cricket/main/matches",
    location: "India",
    tags: ["👨"],
  },

  // Cycling
  {
    id: "18",
    name: "Giro d'Italia",
    sport: "Cycling",
    type: "major",
    startDate: new Date("2026-05-09"),
    endDate: new Date("2026-06-01"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b3/Giro_d%27Italia_-_Logo_2018.svg",
    link: "https://en.wikipedia.org/wiki/2026_Giro_d%27Italia",
    location: "Italy",
    tags: ["👨"],
  },
  {
    id: "24",
    name: "Tour De France",
    sport: "Cycling",
    type: "major",
    startDate: new Date("2026-07-05"),
    endDate: new Date("2026-07-27"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Tour_de_France_logo_%28black_background%29.svg",
    link: "https://en.wikipedia.org/wiki/2026_Tour_de_France",
    location: "France",
    tags: ["👨"],
  },
  {
    id: "31",
    name: "UCI Road World Championships",
    sport: "Cycling",
    type: "major",
    startDate: new Date("2026-09-20"),
    endDate: new Date("2026-09-27"),
    dateDisplay: "Sep 2026",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Union_Cycliste_Internationale_logo.svg",
    link: "https://en.wikipedia.org/wiki/2026_UCI_Road_World_Championships",
    location: "Montreal, Canada",
    tags: ["👨", "👩"],
  },
  {
    id: "32",
    name: "UCI Track World Championships",
    sport: "Cycling",
    type: "major",
    startDate: new Date("2026-10-14"),
    endDate: new Date("2026-10-18"),
    dateDisplay: "Oct 2026",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Union_Cycliste_Internationale_logo.svg",
    link: "https://en.wikipedia.org/wiki/2026_UCI_Track_Cycling_World_Championships",
    location: "Shanghai, China",
    tags: ["👨", "👩"],
  },

  // Darts
  {
    id: "22",
    name: "PDC World Darts Championship",
    sport: "Darts",
    type: "major",
    startDate: new Date("2026-12-01"),
    endDate: new Date("2027-01-10"),
    dateDisplay: "Dec 2026 - Jan 2027",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/29/Professional_Darts_Corporation_logo.svg",
    link: "/sports/darts/world-championship",
    location: "Alexandra Palace, London, England",
    tags: ["👨"],
  },

  // Field Hockey
  {
    id: "26",
    name: "FIH Hockey World Cup",
    sport: "Field Hockey",
    type: "major",
    startDate: new Date("2026-08-15"),
    endDate: new Date("2026-08-31"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Field_hockey_worldcup_logo.png",
    link: "https://en.wikipedia.org/wiki/2026_Men%27s_FIH_Hockey_World_Cup",
    location: "Belgium & Netherlands",
    tags: ["👨", "👩"],
  },

  // Football
  {
    id: "rs-premier-league-2026",
    name: "Premier League",
    sport: "Football",
    type: "regular-season",
    startDate: new Date("2025-08-08"),
    endDate: new Date("2026-05-23"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
    link: "/sports/football/17/76986",
  },
  {
    id: "rs-aleague-men-2026",
    name: "A-League Men",
    sport: "Football",
    type: "regular-season",
    startDate: new Date("2025-10-17"),
    endDate: new Date("2026-05-23"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/98/Isuzu_UTE_A-League_Men.svg",
    link: "/sports/football/136/82603",
    notes: "Finals Series Start: 1 May \nGrand Final: 23/24 May ",
  },
  {
    id: "rs-aleague-women-2026",
    name: "A-League Women",
    sport: "Football",
    type: "regular-season",
    startDate: new Date("2025-10-17"),
    endDate: new Date("2026-05-17"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/0e/Ninja_A-League_Women_logo.svg",
    link: "/sports/football/1894/82605",
    notes: "Finals Series Start: 24 Apr \nGrand Final: 16/17 May ",
  },
  {
    id: "21",
    name: "Europa League Final",
    sport: "Football",
    type: "major",
    startDate: new Date("2026-05-20"),
    endDate: new Date("2026-05-20"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/UEFA_Europa_League_logo_%282024_version%29.svg",
    link: "/sports/football",
    location: "Istanbul, Turkey",
    tags: ["👨"],
  },
  {
    id: "22-ucl",
    name: "Champions League Final",
    sport: "Football",
    type: "major",
    startDate: new Date("2026-05-30"),
    endDate: new Date("2026-05-30"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/f5/UEFA_Champions_League.svg",
    link: "/sports/football",
    location: "Budapest, Hungary",
    tags: ["👨"],
  },
  {
    id: "1",
    name: "FIFA World Cup",
    sport: "Football",
    type: "major",
    startDate: new Date("2026-06-11"),
    endDate: new Date("2026-07-19"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/1/17/2026_FIFA_World_Cup_emblem.svg",
    link: "/sports/football/world-cup",
    location: "USA, Canada, Mexico",
    tags: ["👨"],
  },

  // Golf
  {
    id: "rs-tgl-2026",
    name: "TGL",
    sport: "Golf",
    type: "regular-season",
    startDate: new Date("2025-12-28"),
    endDate: new Date("2026-03-24"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f7/TGL_logo.png",
    link: "/sports/golf/tgl",
    notes: "Finals: 23-24 Mar",
  },
  {
    id: "rs-pga-tour-2026",
    name: "PGA Tour",
    sport: "Golf",
    type: "regular-season",
    startDate: new Date("2026-01-16"),
    endDate: new Date("2026-11-23"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/77/PGA_Tour_logo.svg",
    link: "/sports/golf/pga/2026",
    notes:
      "FedEx Playoffs: 14 Aug - 31 Aug\nTour Championship: 28 Aug - 31 Aug\nFedEx Fall: 18 Sep - 23 Nov",
  },
  {
    id: "rs-liv-golf-2026",
    name: "LIV Golf",
    sport: "Golf",
    type: "regular-season",
    startDate: new Date("2026-02-05"),
    endDate: new Date("2026-08-31"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/27/LIV_golf_logo.svg",
    link: "/sports/golf/liv/2026",
  },
  {
    id: "44",
    name: "TGL Final",
    sport: "Golf",
    type: "major",
    startDate: new Date("2026-03-23"),
    endDate: new Date("2026-03-24"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f7/TGL_logo.png",
    link: "/sports/golf/pga/2026",
    location: "USA",
    tags: ["👨"],
  },
  {
    id: "5",
    name: "The Masters",
    sport: "Golf",
    type: "major",
    startDate: new Date("2026-04-10"),
    endDate: new Date("2026-04-13"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/23/Masters_Logo.png",
    link: "/sports/golf/pga/2026",
    location: "Augusta, Georgia, USA",
    tags: ["👨"],
  },
  {
    id: "20",
    name: "PGA Championship",
    sport: "Golf",
    type: "major",
    startDate: new Date("2026-05-15"),
    endDate: new Date("2026-05-18"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/5d/PGA_Championship.png",
    link: "/sports/golf/pga/2026",
    location: "Aronimink Golf Club, USA",
    tags: ["👨"],
  },
  {
    id: "23",
    name: "US Open",
    sport: "Golf",
    type: "major",
    startDate: new Date("2026-06-19"),
    endDate: new Date("2026-06-22"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/76/US_Open_%28Golf%29_Logo.png",
    link: "/sports/golf/pga/2026",
    location: "Shinnecock Hills Golf Club, USA",
    tags: ["👨"],
  },
  {
    id: "38",
    name: "The Open Championship",
    sport: "Golf",
    type: "major",
    startDate: new Date("2026-07-16"),
    endDate: new Date("2026-07-20"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/d/d0/The_Open_Championship_logo.png",
    link: "/sports/golf/pga/2026",
    location: "Royal Birkdale Golf Club, England",
    tags: ["👨"],
  },
  {
    id: "43",
    name: "PGA Tour Championship",
    sport: "Golf",
    type: "major",
    startDate: new Date("2026-08-21"),
    endDate: new Date("2026-08-24"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/8/8e/Tour_Championship_Logo.png",
    link: "/sports/golf/pga/2026",
    location: "USA",
    tags: ["👨"],
  },

  // Ice Hockey
  {
    id: "rs-nhl-2026",
    name: "NHL ",
    sport: "Ice Hockey",
    type: "regular-season",
    startDate: new Date("2025-10-07"),
    endDate: new Date("2026-06-30"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/3/3a/05_NHL_Shield.svg",
    link: "/sports/ice-hockey",
  },
  {
    id: "19",
    name: "IIHF World Championship",
    sport: "Ice Hockey",
    type: "major",
    startDate: new Date("2026-05-15"),
    endDate: new Date("2026-05-31"),
    // imageUrl: "/olympic-rings.svg",
    link: "https://upload.wikimedia.org/wikipedia/en/6/62/2026_IIHF_World_Championship_logo.svg",
    location: "Switzerland",
    tags: ["👨"],
  },
  {
    id: "47",
    name: "Stanley Cup Final",
    sport: "Ice Hockey",
    type: "major",
    startDate: new Date("2026-06-04"),
    endDate: new Date("2026-06-04"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/3/3a/05_NHL_Shield.svg",
    link: "/sports/ice-hockey",
    location: "USA",
    tags: ["👨"],
  },

  // Motorsport
  {
    id: "rs-supercars-2026",
    name: "Supercars",
    sport: "Motorsport",
    type: "regular-season",
    startDate: new Date("2026-02-20"),
    endDate: new Date("2026-11-29"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/25/Supercars_Championship_Logo_2021.png",
    link: "/sports/motorsport/supercars/",
  },
  {
    id: "rs-f1-2026",
    name: "Formula 1",
    sport: "Motorsport",
    type: "regular-season",
    startDate: new Date("2026-03-06"),
    endDate: new Date("2026-12-06"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/F1_%28registered_trademark%29.svg",
    link: "/sports/motorsport/f1/2026",
  },
  {
    id: "50",
    name: "Bathurst",
    sport: "Motorsport",
    type: "major",
    startDate: new Date("2026-10-08"),
    endDate: new Date("2026-10-11"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/25/Supercars_Championship_Logo_2021.png",
    link: "/sports/motorsport",
    location: "Bathurst, Australia",
    tags: ["👨"],
  },

  // Multi-Sport
  {
    id: "25",
    name: "Commonwealth Games",
    sport: "Multi-Sport",
    type: "major",
    startDate: new Date("2026-07-23"),
    endDate: new Date("2026-08-02"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/57/2026_Commonwealth_Games_logo.svg",
    link: "/sports/olympics/commonwealth-games",
    location: "Glasgow, Scotland",
    tags: ["👨", "👩"],
  },
  {
    id: "30",
    name: "Asian Games 2026",
    sport: "Multi-Sport",
    type: "major",
    startDate: new Date("2026-09-19"),
    endDate: new Date("2026-10-04"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/4d/2026_Asian_Games_logo.svg",
    link: "/sports/multi-sport",
    location: "Japan",
    tags: ["👨", "👩"],
  },
  {
    id: "35",
    name: "Youth Summer Olympics 2026",
    sport: "Multi-Sport",
    type: "major",
    startDate: new Date("2026-10-31"),
    endDate: new Date("2026-11-13"),
    imageUrl: "/olympic-rings.svg",
    link: "/sports/multi-sport",
    location: "Dakar, Senegal",
    tags: ["👨", "👩"],
  },

  // Netball
  {
    id: "35net",
    name: "Super Netball",
    sport: "Netball",
    type: "regular-season",
    startDate: new Date("2026-03-14"),
    endDate: new Date("2026-06-28"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/78/Super_Netball_League_logo_%28unsponsored%29.svg",
    link: "/sports/netball",
  },
  {
    id: "36net",
    name: "Netball World Cup",
    sport: "Netball",
    type: "major",
    startDate: new Date("2027-07-28"),
    endDate: new Date("2027-08-06"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/8/8f/2027_Netball_World_Cup_Sydney_bid_logo.jpg",
    link: "/sports/netball",
    location: "Sydney, Australia",
    tags: ["👩"],
  },

  // Olympics
  {
    id: "2",
    name: "Winter Olympics 2026",
    sport: "Olympics",
    type: "major",
    startDate: new Date("2026-02-06"),
    endDate: new Date("2026-02-22"),
    imageUrl: "/olympic-rings.svg",
    link: "/sports/olympics",
    location: "Milan & Cortina, Italy",
    tags: ["👨", "👩"],
  },
  {
    id: "13",
    name: "Winter Paralympics 2026",
    sport: "Olympics",
    type: "major",
    startDate: new Date("2026-03-06"),
    endDate: new Date("2026-03-15"),
    imageUrl: "/olympic-rings.svg",
    link: "/sports/olympics",
    location: "Milan & Cortina, Italy",
    tags: ["👨", "👩"],
  },

  // Rugby
  {
    id: "4",
    name: "Rugby World Cup",
    sport: "Rugby",
    type: "major",
    startDate: new Date("2027-10-01"),
    endDate: new Date("2027-11-13"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/62/RWC2027logo.png",
    link: "/sports/rugby-union",
    location: "Australia",
    tags: ["👨"],
  },

  // Rugby League
  {
    id: "rs-nrl-2026",
    name: "NRL",
    sport: "Rugby League",
    type: "regular-season",
    startDate: new Date("2026-03-01"),
    endDate: new Date("2026-10-04"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/50/National_Rugby_League.svg",
    link: "/sports/rugby-league/294/86317",
  },
  {
    id: "rs-nrlw-2026",
    name: "NRLW",
    sport: "Rugby League",
    type: "regular-season",
    startDate: new Date("2026-07-02"),
    endDate: new Date("2026-10-04"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Telstra_NRL_Women%27s_Premiership.png",
    link: "/sports/rugby-league/19120/87573",
  },
  {
    id: "45",
    name: "NRL Grand Final",
    sport: "Rugby League",
    type: "major",
    startDate: new Date("2026-10-04"),
    endDate: new Date("2026-10-04"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/50/National_Rugby_League.svg",

    link: "/sports/rugby-league",
    location: "Sydney, Australia",
    tags: ["👨"],
  },
  {
    id: "33",
    name: "Rugby League World Cup",
    sport: "Rugby League",
    type: "major",
    startDate: new Date("2026-10-15"),
    endDate: new Date("2026-11-15"),
    // imageUrl: "/olympic-rings.svg",
    link: "/sports/rugby-league",
    location: "Australia, New Zealand & PNG",
    tags: ["👨", "👩", "♿"],
  },

  // Sailing
  {
    id: "rs-sailgp-2026",
    name: "SailGP Season",
    sport: "Sailing",
    type: "regular-season",
    startDate: new Date("2026-01-18"),
    endDate: new Date("2026-11-29"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/SailGP_logo.png",
    link: "https://en.wikipedia.org/wiki/2026_SailGP_championship",
  },

  // Tennis
  {
    id: "8",
    name: "Australian Open",
    sport: "Tennis",
    type: "major",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-02-06"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Australian_Open_Logo_2017.svg",
    link: "/sports/tennis/2363/80012",
    location: "Melbourne, Australia",
    tags: ["👨", "👩"],
  },
  {
    id: "12",
    name: "French Open",
    sport: "Tennis",
    type: "major",
    startDate: new Date("2026-05-18"),
    endDate: new Date("2026-06-07"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/1/1d/Logo_Roland-Garros.svg",
    link: "/sports/tennis/today",
    location: "Paris, France",
    tags: ["👨", "👩"],
  },
  {
    id: "6",
    name: "Wimbledon Championships",
    sport: "Tennis",
    type: "major",
    startDate: new Date("2026-06-29"),
    endDate: new Date("2026-07-12"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b9/Wimbledon.svg",
    link: "/sports/tennis/today",
    location: "London, England",
    tags: ["👨", "👩"],
  },
  {
    id: "27",
    name: "US Open",
    sport: "Tennis",
    type: "major",
    startDate: new Date("2026-08-31"),
    endDate: new Date("2026-09-13"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/Usopen-horizontal-logo.svg",
    link: "/sports/tennis/today",
    location: "New York, USA",
    tags: ["👨", "👩"],
  },
  {
    id: "37",
    name: "WTA Finals",
    sport: "Tennis",
    type: "major",
    startDate: new Date("2026-11-7"),
    endDate: new Date("2026-11-14"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/WTA_2025.svg",
    link: "/sports/tennis/today",
    location: "Saudi Arabia",
    tags: ["👩"],
  },
  {
    id: "36",
    name: "ATP Finals",
    sport: "Tennis",
    type: "major",
    startDate: new Date("2026-11-15"),
    endDate: new Date("2026-11-22"),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Nitto_ATP_Finals_logo.jpg",
    link: "/sports/tennis/today",
    location: "Italy",
    tags: ["👨"],
  },
];

export const NRL_TEAM_NAMES = [
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
];

export const AFL_TEAM_NAMES = [
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
];

export const NFL_TEAM_NAMES = [
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
];

export const MOTORSPORT_CATEGORIES = [
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
] as LeagueSeasonConfig[];

export const GOLF_TOURS = [
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
    seasons: [{ name: "Current", slug: "" }],
  },
] as LeagueSeasonConfig[];

export const RUGBY_LEAGUE_LEAGUES = [
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
    qualifyingPosition: 8,
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

    qualifyingPosition: 6,
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
    qualifyingPosition: 8,
  },
  {
    name: "New South Wales Cup",
    slug: "2134",
    seasons: [
      { name: "2025", slug: "69962" },
      { name: "2024", slug: "57568" },
    ],
    qualifyingPosition: 8,
  },
  {
    name: "World Cup",
    slug: "431",
    seasons: [
      { name: "2026", slug: "87548" },
      { name: "2021", slug: "42989" },
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
    seasons: [{ name: "2024", slug: "57112" }],
  },
  {
    name: "Super League",
    slug: "302",
    seasons: [
      { name: "2025", slug: "69930" },
      { name: "2024", slug: "57044" },
    ],
    qualifyingPosition: 6,
  },
] as LeagueSeasonConfig[];

export const AUSSIE_RULES_LEAGUES = [
  {
    name: "AFL",
    slug: "656",
    seasons: [
      { name: "2026", slug: "86748" },
      { name: "2025", slug: "71308" },
      { name: "2024", slug: "58226" },
      { name: "2023", slug: "47887" },
      { name: "2022", slug: "39988" },
      { name: "2021", slug: "35137" },
      { name: "2020", slug: "26039" },
      { name: "2019", slug: "19486" },
      { name: "2018", slug: "15780" },
      { name: "2017", slug: "13037" },
      { name: "2016", slug: "11060" },
      { name: "2015", slug: "9775" },
      { name: "2014", slug: "7608" },
      { name: "2013", slug: "5633" },
      { name: "2012", slug: "4090" },
      { name: "2011", slug: "3166" },
      { name: "2010", slug: "2594" },
      { name: "2009", slug: "2099" },
      { name: "2008", slug: "1153" },
      { name: "2007", slug: "42987" },
    ],
    qualifyingPosition: 8,
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
    qualifyingPosition: 8,
  },
  {
    name: "VFL",
    slug: "25506",
    seasons: [
      { name: "2025", slug: "73301" },
      { name: "2024", slug: "57568" },
    ],
    qualifyingPosition: 8,
  },
  {
    name: "SANFL",
    slug: "20126",
    seasons: [
      { name: "2025", slug: "71309" },
      { name: "2024", slug: "59236" },
    ],
    qualifyingPosition: 5,
  },
  {
    name: "WAFL",
    slug: "20160",
    seasons: [
      { name: "2025", slug: "71310" },
      { name: "2024", slug: "59237" },
    ],
    qualifyingPosition: 5,
  },
  {
    name: "AFL Preseason",
    slug: "22064",
    seasons: [
      { name: "2025", slug: "71941" },
      { name: "2024", slug: "58764" },
    ],
  },
  {
    name: "AFL All Stars",
    slug: "25029",
    seasons: [{ name: "2025", slug: "72022" }],
  },
] as LeagueSeasonConfig[];

export const AMERICAN_FOOTBALL_LEAGUES = [
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
] as LeagueSeasonConfig[];

export const FOOTBALL_LEAGUES = [
  //Australia - category 34
  {
    name: "🇦🇺 A-League Men",
    slug: "136",
    seasons: [
      { name: "25/26", slug: "82603" },
      { name: "24/25", slug: "64864" },
    ],
    qualifyingPosition: 6,
  },
  {
    name: "🇦🇺 A-League Women",
    slug: "1894",
    seasons: [
      { name: "25/26", slug: "82605" },
      { name: "24/25", slug: "66775" },
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
  },
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 WSL",
    slug: "1044",
    seasons: [
      { name: "25/26", slug: "79227" },
      { name: "24/25", slug: "64370" },
    ],
  },
  {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Championship",
    slug: "18",
    seasons: [
      { name: "25/26", slug: "77347" },
      { name: "24/25", slug: "61961" },
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
  // France - category 7
  {
    name: "🇫🇷 Ligue 1",
    slug: "34",
    seasons: [{ name: "25/26", slug: "77356" }],
  },
  // Germany - category 30
  {
    name: "🇩🇪 Bundesliga",
    slug: "35",
    seasons: [{ name: "25/26", slug: "77333" }],
  },
  // Italy - category 31
  {
    name: "🇮🇹 Serie A",
    slug: "23",
    seasons: [{ name: "25/26", slug: "76457" }],
  },
  // Spain - category 32
  {
    name: "🇪🇸 La Liga",
    slug: "8",
    seasons: [{ name: "25/26", slug: "77559" }],
  },
  // USA - category 26
  {
    name: "🇺🇸 MLS",
    slug: "242",
    seasons: [{ name: "2025", slug: "70158" }],
  },
  {
    name: "🇺🇸 NWSL",
    slug: "1690",
    seasons: [{ name: "2025", slug: "71412" }],
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
  },
  {
    name: "🌍 FIFA World Cup Qualifiers",
    slug: "fifaQualifiers",
    seasons: [{ name: "2026", slug: "" }],
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
    seasons: [{ name: "2027", slug: "" }],
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
  //   name: "AFC World Cup Qualifiers",
  //   slug: "308",
  //   seasons: [{ name: "23-25", slug: "53508" }],
  // },
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
  },
  {
    name: "🇪🇺 UEFA Women's Champions League",
    slug: "696",
    seasons: [{ name: "25/26", slug: "77328" }],
  },
  {
    name: "🇪🇺 UEFA Europa League",
    slug: "679",
    seasons: [{ name: "25/26", slug: "76984" }],
  },
  {
    name: "🇪🇺 UEFA Conference League",
    slug: "17015",
    seasons: [{ name: "25/26", slug: "76960" }],
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

  // North & Central America - category 1469
  // South America - category 1470
  // Africa - category 1466
  // Oceania - category 1471
] as LeagueSeasonConfig[];

export const BASEBALL_LEAGUES = [
  //Australia - category 34
  {
    name: "MLB",
    slug: "11205",
    seasons: [
      { name: "2026", slug: "84695" },
      { name: "2025", slug: "68611" },
      { name: "2024", slug: "57577" },
    ],
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
] as LeagueSeasonConfig[];

export const BASKETBALL_LEAGUES = [
  {
    name: "NBL",
    slug: "1524",
    seasons: [
      { name: "25/26", slug: "77205" },
      { name: "24/25", slug: "61848" },
    ],
    qualifyingPosition: 6,
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
      { name: "2025", slug: "69751" },
      { name: "2024", slug: "57477" },
    ],
  },
  // {
  //   name: "March Madness",
  //   slug: "486",
  //   seasons: [
  //     { name: "2025", slug: "69751" },
  //     { name: "2024", slug: "57477" },
  //   ],
  // },
  // {
  //   name: "Basketball World Cup",
  //   slug: "486",
  //   seasons: [
  //     { name: "2025", slug: "69751" },
  //     { name: "2024", slug: "57477" },
  //   ],
  // },
] as LeagueSeasonConfig[];

export const TENNIS_LEAGUES = [
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
] as LeagueSeasonConfig[];

export const DARTS_LEAGUES = [
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
] as LeagueSeasonConfig[];
