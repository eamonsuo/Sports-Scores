import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import { americanFootballService } from "@/services/american-football.service";
import { aussieRulesService } from "@/services/aussie-rules.service";
import { baseballService } from "@/services/baseball.service";
import { basketballService } from "@/services/basketball.service";
import { footballService } from "@/services/football.service";
import { iceHockeyService } from "@/services/ice-hockey.service";
import { rugbyLeagueService } from "@/services/rugby-league.service";
import { rugbyUnionService } from "@/services/rugby-union.service";
import { tennisService } from "@/services/tennis.service";
import { SPORT, SportService } from "@/types/misc";
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
} from "./constants";

type SportRouteConfig = {
  leagues: LeagueSeasonConfig[];
  service: SportService;
  navButtons?: { href: string; label: string; page: string }[]; // override default
  hasWikiPages?: boolean;
};

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
      { href: "./matches", label: "Matches", page: "matches" },
      { href: "./ladder", label: "Ladder", page: "ladder" },
      { href: "./bracket", label: "Bracket", page: "bracket" },
    ],
    hasWikiPages: true,
  },
  [SPORT.GOLF]: {
    leagues: GOLF_TOURS,
    service: aussieRulesService,
  },
  [SPORT.ICE_HOCKEY]: {
    leagues: ICE_HOCKEY_LEAGUES,
    service: iceHockeyService,
  },
  [SPORT.MOTORSPORT]: {
    leagues: MOTORSPORT_CATEGORIES,
    service: aussieRulesService,
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
  },
};
