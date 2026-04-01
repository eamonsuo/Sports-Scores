import { SportsLadder } from "@/components/all-sports/Ladder";
import { BaseballScoreBreakdown } from "@/components/baseball/BaseballScoreBreakdown";
import { FixtureRound, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "./sofascore";

export interface Baseball_BaseballApi_FixturePage_Response
  extends Sofascore_EventPage_Response {}

export interface Baseball_BaseballApi_Match_Response
  extends Sofascore_Event_Response {}

export interface Baseball_BaseballApi_LeagueTotalStandings_Response
  extends Sofascore_TotalStandings_Response {}

export interface Baseball_BaseballApi_MatchIncidents_Response
  extends Sofascore_EventIncidents_Response {}

export interface Baseball_BaseballApi_MatchSchedules_Response
  extends Sofascore_Events_Response {}

export interface BaseballFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface BaseballLadderPage<T extends readonly string[]> {
  standings: SportsLadder<T>[];
}

export interface BaseballMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: BaseballScoreBreakdown[];
  };
  // scoreEvents: ScoreDifference[];
}

export interface BaseballTodayPage {
  fixtures: FixtureRound[];
  currentRound: string;
}
