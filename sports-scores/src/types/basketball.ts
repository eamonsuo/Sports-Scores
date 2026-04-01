import { SportsLadder } from "@/components/all-sports/Ladder";
import { BasketballScoreBreakdown } from "@/components/basketball/BasketballScoreBreakdown";
import { FixtureRound, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "./sofascore";

export interface Basketball_BasketApi_FixturePage_Response
  extends Sofascore_EventPage_Response {}

export interface Basketball_BasketApi_Match_Response
  extends Sofascore_Event_Response {}

export interface Basketball_BasketApi_LeagueTotalStandings_Response
  extends Sofascore_TotalStandings_Response {}

export interface Basketball_BasketApi_MatchIncidents_Response
  extends Sofascore_EventIncidents_Response {}

export interface Basketball_BasketApi_MatchSchedules_Response
  extends Sofascore_Events_Response {}

export interface BasketballFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface BasketballLadderPage<T extends readonly string[]> {
  standings: SportsLadder<T>[];
}

export interface BasketballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: BasketballScoreBreakdown[];
  };
  // scoreEvents: ScoreDifference[];
}

export interface BasketballTodayPage {
  fixtures: FixtureRound[];
  currentRound: string;
}
