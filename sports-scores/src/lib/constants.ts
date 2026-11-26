import { ScoreBreakdownConfig } from "@/services/sofascore.service"
import { SPORT } from "@/types/misc"

// Ctrl+Shift+[    Fold (collapse) region at the cursor.
// Ctrl+Shift+]    Unfold (un-collapse) region at the cursor.
// Ctrl+K Ctrl+[   Fold (collapse) all subregions at cursor
// Ctrl+K Ctrl+]   Unfold (un-collapse) all subregions at cursor
// Ctrl+K Ctrl+0   Fold (collapse) all regions
// Ctrl+K Ctrl+J   Unfold (un-collapse) all regions
// Ctrl+K Ctrl+1   Fold all regions of Level 1 (namespace)
// Ctrl+K Ctrl+2   Fold all regions of Level 2 (class / methods)
// Ctrl+K Ctrl+3   Fold all regions of Level 3 (methods / blocks)
// Ctrl+K Ctrl+4   Fold all regions of Level 4 (blocks / inner blocks)

export const FALLBACK_IMAGE = "/vercel.svg"

export const EVENT_TODAY_EXTENTION_HOURS = 3

export const FALLBACK_TIMEZONE = "UTC"

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

export const CRICKET_LADDER_HEADINGS = [
  "Team",
  "P",
  "W",
  "D",
  "NR",
  "NRR",
  "Pts",
]

export const MOTORSPORT_SESSION_STANDINGS_HEADINGS = [
  "Driver",
  "Gap",
  "Pts",
  "+/-",
]

export const MOTORSPORT_DRIVER_STANDINGS_HEADINGS = ["Driver", "Pts", "Wins"]

export const MOTORSPORT_CONSTRUCTOR_STANDINGS_HEADINGS = ["Constructor", "Pts"]

export const GOLF_FEDEX_HEADINGS = ["Player", "Total", "Behind"]

export const GOLF_LEADERBOARD_HEADINGS = ["Player", "Total", "Thru", "Rnd"]

export const RUGBY_LEAGUE_LADDER_HEADINGS = [
  "Team",
  "P",
  "W",
  "D",
  "Diff",
  "Pts",
]

export const AUSSIE_RULES_LADDER_HEADINGS = ["Team", "P", "W", "D", "%", "Pts"]

export const AMERICAN_FOOTBALL_LADDER_HEADINGS = ["Team", "P", "W", "L", "D"]

export const FOOTBALL_LADDER_HEADINGS = ["Team", "P", "W", "D", "Diff", "Pts"]

export const BASEBALL_LADDER_HEADINGS = ["Team", "P", "W", "L", "PCT"]

export const BASKETBALL_LADDER_HEADINGS = ["Team", "P", "W", "L", "PCT"]

export const TENNIS_LADDER_HEADINGS = ["Player", "P", "W", "L"]

export const RUGBY_UNION_LADDER_HEADINGS = [
  "Team",
  "P",
  "W",
  "D",
  "Diff",
  "BP",
  "Pts",
]

export const ICE_HOCKEY_LADDER_HEADINGS = [
  "Team",
  "P",
  "W",
  "OTL",
  // "L",
  "Diff",
  "Pts",
]

export const FOOTER_LINKS = [
  {
    sport: "abc news",
    link: "https://www.abc.net.au/news/sport",
    img: "/footer/abc-news-logo.svg",
    altText: "ABC Grandstand",
  },
  {
    sport: "calendar",
    link: `/`,
    img: "/footer/calendar.png",
    altText: "Event Calendar",
  },
  {
    sport: SPORT.CRICKET,
    link: `/sports/${SPORT.CRICKET}/today`,
    img: "/footer/cricket-ball.svg",
    altText: "Cricket",
  },
  {
    sport: SPORT.RUGBY_LEAGUE,
    link: `/sports/${SPORT.RUGBY_LEAGUE}/294`,
    img: "/footer/nrl-ball.svg",
    altText: "Rugby League",
  },
  {
    sport: SPORT.AUSSIE_RULES,
    link: `/sports/${SPORT.AUSSIE_RULES}/656`,
    img: "/footer/afl-ball.svg",
    altText: "Aussie Rules",
  },
  {
    sport: SPORT.AMERICAN_FOOTBALL,
    link: `/sports/${SPORT.AMERICAN_FOOTBALL}/9464`,
    img: "/footer/american-football.svg",
    altText: "American Football",
  },
  {
    sport: SPORT.MOTORSPORT,
    link: `/sports/${SPORT.MOTORSPORT}/40`,
    img: "/footer/f1-helmet.svg",
    altText: "Motorsport",
  },
  {
    sport: SPORT.GOLF,
    link: `/sports/${SPORT.GOLF}/today`,
    img: "/footer/golf-ball.svg",
    altText: "Golf",
  },
  {
    sport: SPORT.SURFING,
    link: `/sports/${SPORT.SURFING}/wsl`,
    img: "/footer/surfboard.svg",
    altText: "Surfing",
  },
  {
    sport: SPORT.FOOTBALL,
    link: `/sports/${SPORT.FOOTBALL}/today`,
    img: "/footer/football.svg",
    altText: "Football",
  },
  {
    sport: SPORT.TENNIS,
    link: `/sports/${SPORT.TENNIS}/today`,
    img: "/footer/tennis.svg",
    altText: "Tennis",
  },
  {
    sport: SPORT.NETBALL,
    link: `/sports/${SPORT.NETBALL}/4540`,
    img: "/footer/netball.png",
    altText: "Netball",
  },
  {
    sport: SPORT.RUGBY_UNION,
    link: `/sports/${SPORT.RUGBY_UNION}/today`,
    img: "/footer/union.png",
    altText: "Rugby Union",
  },
  {
    sport: SPORT.BASKETBALL,
    link: `/sports/${SPORT.BASKETBALL}/today`,
    img: "/footer/basketball.svg",
    altText: "Basketball",
  },
  {
    sport: SPORT.ICE_HOCKEY,
    link: `/sports/${SPORT.ICE_HOCKEY}/today`,
    img: "/footer/hockey-puck.svg",
    altText: "Ice Hockey",
  },
  {
    sport: SPORT.BASEBALL,
    link: `/sports/${SPORT.BASEBALL}/today`,
    img: "/footer/baseball.svg",
    altText: "Baseball",
  },
  {
    sport: SPORT.DARTS,
    link: `/sports/${SPORT.DARTS}/today`,
    img: "/footer/dart.svg",
    altText: "Darts",
  },
  {
    sport: SPORT.CYCLING,
    link: `/sports/${SPORT.CYCLING}/today`,
    img: "/footer/bike.svg",
    altText: "Cycling",
  },
  {
    sport: SPORT.MULTI_SPORT,
    link: `/sports/${SPORT.MULTI_SPORT}/summer-olympics`,
    img: "/olympic-rings.svg",
    altText: "Olympics",
  },
  {
    sport: SPORT.ATHLETICS,
    link: `/sports/${SPORT.ATHLETICS}/today`,
    img: "/footer/athletics.svg",
    altText: "Athletics",
  },
]
