import { americanFootballService } from "@/services/american-football.service"
import { aussieRulesService } from "@/services/aussie-rules.service"
import { baseballService } from "@/services/baseball.service"
import { basketballService } from "@/services/basketball.service"
import { footballService } from "@/services/football.service"
import { golfService } from "@/services/golf.service"
import { iceHockeyService } from "@/services/ice-hockey.service"
import { motorsportService } from "@/services/motorsport.service"
import { rugbyLeagueService } from "@/services/rugby-league.service"
import { rugbyUnionService } from "@/services/rugby-union.service"
import { surfingService } from "@/services/surfing.service"
import { tennisService } from "@/services/tennis.service"
import { ClientLeagueSeasonConfig, SPORT, SportService } from "@/types/misc"
import {
  AMERICAN_FOOTBALL_LEAGUES_CLIENT,
  AUSSIE_RULES_LEAGUES_CLIENT,
  BASEBALL_LEAGUES_CLIENT,
  BASKETBALL_LEAGUES_CLIENT,
  CRICKET_LEAGUES_CLIENT,
  CYCLING_TOURS_CLIENT,
  DARTS_LEAGUES_CLIENT,
  FOOTBALL_LEAGUES_CLIENT,
  GOLF_TOURS_CLIENT,
  ICE_HOCKEY_LEAGUES_CLIENT,
  MOTORSPORT_CATEGORIES_CLIENT,
  NETBALL_LEAGUES_CLIENT,
  RUGBY_LEAGUE_LEAGUES_CLIENT,
  RUGBY_UNION_LEAGUES_CLIENT,
  SURFING_TOURS_CLIENT,
  TENNIS_LEAGUES_CLIENT,
} from "./constants"

type NavButton = { href: string; label: string; page: string }

type SportRouteConfig = {
  leagues: ClientLeagueSeasonConfig[]
  service: SportService
  navButtons?: NavButton[] // override default for all leagues
  navButtonsByLeague?: Record<string, NavButton[]> // override per league slug
}

export const DEFAULT_NAV_BUTTONS = [
  { href: "#current-date", label: "Matches", page: "matches" },
  { href: "ladder", label: "Standings", page: "ladder" },
]

export const SPORT_ROUTE_CONFIG: Record<SPORT, SportRouteConfig> = {
  [SPORT.ALL_SPORTS]: {
    leagues: [],
    service: aussieRulesService,
  },
  [SPORT.AMERICAN_FOOTBALL]: {
    leagues: AMERICAN_FOOTBALL_LEAGUES_CLIENT,
    service: americanFootballService,
  },
  [SPORT.AUSSIE_RULES]: {
    leagues: AUSSIE_RULES_LEAGUES_CLIENT,
    service: aussieRulesService,
  },
  [SPORT.BASEBALL]: {
    leagues: BASEBALL_LEAGUES_CLIENT,
    service: baseballService,
  },
  [SPORT.BASKETBALL]: {
    leagues: BASKETBALL_LEAGUES_CLIENT,
    service: basketballService,
  },
  [SPORT.CRICKET]: {
    leagues: CRICKET_LEAGUES_CLIENT,
    service: aussieRulesService,
  },
  [SPORT.CYCLING]: {
    leagues: CYCLING_TOURS_CLIENT,
    service: aussieRulesService,
  },
  [SPORT.DARTS]: {
    leagues: DARTS_LEAGUES_CLIENT,
    service: aussieRulesService,
  },
  [SPORT.FOOTBALL]: {
    leagues: FOOTBALL_LEAGUES_CLIENT,
    service: footballService,
    navButtons: [
      { href: "#current-date", label: "Matches", page: "matches" },
      { href: "ladder", label: "Ladder", page: "ladder" },
      { href: "bracket", label: "Bracket", page: "bracket" },
    ],
  },
  [SPORT.GOLF]: {
    leagues: GOLF_TOURS_CLIENT,
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
  },
  [SPORT.ICE_HOCKEY]: {
    leagues: ICE_HOCKEY_LEAGUES_CLIENT,
    service: iceHockeyService,
  },
  [SPORT.MOTORSPORT]: {
    leagues: MOTORSPORT_CATEGORIES_CLIENT,
    service: motorsportService,
    navButtons: [
      { href: "#current-date", label: "Races", page: "races" },
      { href: "drivers", label: "Drivers", page: "drivers" },
      { href: "teams", label: "Teams", page: "teams" },
    ],
  },
  [SPORT.NETBALL]: {
    leagues: NETBALL_LEAGUES_CLIENT,
    service: aussieRulesService,
  },
  [SPORT.OLYMPICS]: {
    leagues: [],
    service: aussieRulesService,
  },
  [SPORT.RUGBY_LEAGUE]: {
    leagues: RUGBY_LEAGUE_LEAGUES_CLIENT,
    service: rugbyLeagueService,
  },
  [SPORT.RUGBY_UNION]: {
    leagues: RUGBY_UNION_LEAGUES_CLIENT,
    service: rugbyUnionService,
  },
  [SPORT.SURFING]: {
    leagues: SURFING_TOURS_CLIENT,
    service: surfingService,
    navButtons: [
      { href: "#current-date", label: "Events", page: "matches" },
      {
        href: "https://www.worldsurfleague.com/athletes/rankings",
        label: "Rankings",
        page: "ladder",
      },
    ],
  },
  [SPORT.TENNIS]: {
    leagues: TENNIS_LEAGUES_CLIENT,
    service: tennisService,
    navButtons: [
      { href: "#current-date", label: "Matches", page: "matches" },
      { href: "bracket", label: "Bracket", page: "bracket" },
    ],
  },
}
