import { cricketMatchDetailComponents } from "@/components/cricket/CricketMatchPage"
import { GolfMatchPage } from "@/components/golf/GolfMatchPage"
import { americanFootballService } from "@/services/american-football.service"
import { aussieRulesService } from "@/services/aussie-rules.service"
import { baseballService } from "@/services/baseball.service"
import { basketballService } from "@/services/basketball.service"
import { cricketService } from "@/services/cricket.service"
import { cyclingService } from "@/services/cycling.service"
import { dartsService } from "@/services/darts.service"
import { footballService } from "@/services/football.service"
import { golfService } from "@/services/golf.service"
import { iceHockeyService } from "@/services/ice-hockey.service"
import { motorsportService } from "@/services/motorsport.service"
import { placeholderService } from "@/services/placeholder.service"
import { rugbyLeagueService } from "@/services/rugby-league.service"
import { rugbyUnionService } from "@/services/rugby-union.service"
import { surfingService } from "@/services/surfing.service"
import { tennisService } from "@/services/tennis.service"
import {
  MatchDetail,
  MatchDetailComponents,
  SPORT,
  SportService,
} from "@/types/misc"

type NavButton = { href: string; label: string; page: string }

type SportRouteConfig = {
  service: SportService
  // If a service always resolves to custom type, you can safely cast to MatchDetail here
  matchDetailsPageComponents?: (
    matchDetails: MatchDetail,
  ) => MatchDetailComponents[] // override default match details page
  navButtons?: NavButton[] // override default for all leagues
  navButtonsByLeague?: Record<string, NavButton[]> // override per league slug
}

export const DEFAULT_NAV_BUTTONS = [
  { href: "#current-date", label: "Matches", page: "matches" },
  { href: "ladder", label: "Standings", page: "ladder" },
]

export const SPORT_ROUTE_CONFIG: Record<SPORT, SportRouteConfig> = {
  [SPORT.DEFAULT_SPORT]: {
    service: placeholderService,
  },
  [SPORT.AMERICAN_FOOTBALL]: {
    service: americanFootballService,
  },
  [SPORT.ATHLETICS]: {
    service: placeholderService,
  },
  [SPORT.AUSSIE_RULES]: {
    service: aussieRulesService,
  },
  [SPORT.BASEBALL]: {
    service: baseballService,
  },
  [SPORT.BASKETBALL]: {
    service: basketballService,
  },
  [SPORT.CRICKET]: {
    service: cricketService,
    // cricketService always resolves to CricketMatchDetails, so this narrowing cast is safe at runtime
    matchDetailsPageComponents: cricketMatchDetailComponents as (
      matchDetails: MatchDetail,
    ) => MatchDetailComponents[],
  },
  [SPORT.CYCLING]: {
    service: cyclingService,
    navButtons: [
      { href: "#current-date", label: "Stages", page: "matches" },
      { href: "ladder", label: "Standings", page: "ladder" },
    ],
  },
  [SPORT.DARTS]: {
    service: dartsService,
    navButtons: [
      { href: "#current-date", label: "Matches", page: "matches" },
      { href: "ladder", label: "Ladder", page: "ladder" },
      { href: "bracket", label: "Bracket", page: "bracket" },
    ],
  },
  [SPORT.FOOTBALL]: {
    service: footballService,
    navButtons: [
      { href: "#current-date", label: "Matches", page: "matches" },
      { href: "ladder", label: "Ladder", page: "ladder" },
      { href: "bracket", label: "Bracket", page: "bracket" },
    ],
  },
  [SPORT.GOLF]: {
    service: golfService,
    navButtons: [
      { href: "#current-date", label: "Tournaments", page: "matches" },
      { href: "ladder", label: "OOM", page: "ladder" },
    ],
    navButtonsByLeague: {
      pga: [
        { href: "#current-date", label: "Tournaments", page: "matches" },
        { href: "ladder", label: "FedExCup", page: "ladder" },
      ],
      liv: [
        { href: "#current-date", label: "Tournaments", page: "matches" },
        { href: "", label: "Standings", page: "ladder" },
      ],
    },
    matchDetailsPageComponents: GolfMatchPage as (
      matchDetails: MatchDetail,
    ) => MatchDetailComponents[],
  },
  [SPORT.ICE_HOCKEY]: {
    service: iceHockeyService,
  },
  [SPORT.MOTORSPORT]: {
    service: motorsportService,
    navButtons: [
      { href: "#current-date", label: "Races", page: "races" },
      { href: "ladder", label: "Standings", page: "ladder" },
      // { href: "drivers", label: "Drivers", page: "drivers" },
      // { href: "teams", label: "Teams", page: "teams" },
    ],
    navButtonsByLeague: {
      supercars: [
        { href: "#current-date", label: "Races", page: "races" },
        {
          href: "https://www.supercars.com/standings/2026/supercars",
          label: "Standings",
          page: "ladder",
        },
      ],
    },
  },
  [SPORT.MULTI_SPORT]: {
    service: placeholderService,
    navButtons: [{ href: "", label: "Details", page: "details" }],
  },
  [SPORT.NETBALL]: {
    service: placeholderService,
  },
  [SPORT.RUGBY_LEAGUE]: {
    service: rugbyLeagueService,
  },
  [SPORT.RUGBY_UNION]: {
    service: rugbyUnionService,
  },
  [SPORT.SURFING]: {
    service: surfingService,
    navButtonsByLeague: {
      wsl: [
        { href: "#current-date", label: "Events", page: "matches" },
        {
          href: "https://www.worldsurfleague.com/athletes/rankings",
          label: "Rankings",
          page: "ladder",
        },
      ],
    },
  },
  [SPORT.TENNIS]: {
    service: tennisService,
    navButtons: [
      { href: "#current-date", label: "Matches", page: "matches" },
      { href: "ladder", label: "Standings", page: "ladder" },
      { href: "bracket", label: "Bracket", page: "bracket" },
    ],
  },
}
