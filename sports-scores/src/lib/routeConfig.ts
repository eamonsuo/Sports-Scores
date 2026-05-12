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
import { tennisService } from "@/services/tennis.service"
import { LeagueSeasonConfig, SPORT, SportService } from "@/types/misc"
import {
  AMERICAN_FOOTBALL_LEAGUES,
  AUSSIE_RULES_LEAGUES,
  BASEBALL_LEAGUES,
  BASKETBALL_LEAGUES,
  CRICKET_LEAGUES,
  DARTS_LEAGUES,
  FOOTBALL_LEAGUES,
  GOLF_TOURS,
  ICE_HOCKEY_LEAGUES,
  MOTORSPORT_CATEGORIES,
  NETBALL_LEAGUES,
  RUGBY_LEAGUE_LEAGUES,
  RUGBY_UNION_LEAGUES,
  TENNIS_LEAGUES,
} from "./constants"

type NavButton = { href: string; label: string; page: string }

type SportRouteConfig = {
  leagues: LeagueSeasonConfig[]
  service: SportService
  navButtons?: NavButton[] // override default for all leagues
  navButtonsByLeague?: Record<string, NavButton[]> // override per league slug
}

export const DEFAULT_NAV_BUTTONS = [
  { href: "#current-date", label: "Matches", page: "matches" },
  { href: "ladder", label: "Standings", page: "ladder" },
]

export const SPORT_ROUTE_CONFIG: Record<SPORT, SportRouteConfig> = {
  [SPORT.AMERICAN_FOOTBALL]: {
    leagues: AMERICAN_FOOTBALL_LEAGUES,
    service: americanFootballService,
  },
  [SPORT.AUSSIE_RULES]: {
    leagues: AUSSIE_RULES_LEAGUES,
    service: aussieRulesService,
  },
  [SPORT.BASEBALL]: {
    leagues: BASEBALL_LEAGUES,
    service: baseballService,
  },
  [SPORT.BASKETBALL]: {
    leagues: BASKETBALL_LEAGUES,
    service: basketballService,
  },
  [SPORT.CRICKET]: {
    leagues: CRICKET_LEAGUES,
    service: aussieRulesService,
  },
  [SPORT.CYCLING]: {
    leagues: [],
    service: aussieRulesService,
  },
  [SPORT.DARTS]: {
    leagues: DARTS_LEAGUES,
    service: aussieRulesService,
  },
  [SPORT.FOOTBALL]: {
    leagues: FOOTBALL_LEAGUES,
    service: footballService,
    navButtons: [
      { href: "#current-date", label: "Matches", page: "matches" },
      { href: "ladder", label: "Ladder", page: "ladder" },
      { href: "bracket", label: "Bracket", page: "bracket" },
    ],
  },
  [SPORT.GOLF]: {
    leagues: GOLF_TOURS,
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
    leagues: ICE_HOCKEY_LEAGUES,
    service: iceHockeyService,
  },
  [SPORT.MOTORSPORT]: {
    leagues: MOTORSPORT_CATEGORIES,
    service: motorsportService,
    navButtons: [
      { href: "#current-date", label: "Races", page: "races" },
      { href: "drivers", label: "Drivers", page: "drivers" },
      { href: "teams", label: "Teams", page: "teams" },
    ],
  },
  [SPORT.NETBALL]: {
    leagues: NETBALL_LEAGUES,
    service: aussieRulesService,
  },
  [SPORT.OLYMPICS]: {
    leagues: [],
    service: aussieRulesService,
  },
  [SPORT.RUGBY_LEAGUE]: {
    leagues: RUGBY_LEAGUE_LEAGUES,
    service: rugbyLeagueService,
  },
  [SPORT.RUGBY_UNION]: {
    leagues: RUGBY_UNION_LEAGUES,
    service: rugbyUnionService,
  },
  [SPORT.SURFING]: {
    leagues: [],
    service: aussieRulesService,
  },
  [SPORT.TENNIS]: {
    leagues: TENNIS_LEAGUES,
    service: tennisService,
    navButtons: [
      { href: "#current-date", label: "Matches", page: "matches" },
      { href: "bracket", label: "Bracket", page: "bracket" },
    ],
  },
}
