import { SportsLadder } from "@/components/all-sports/Ladder";
import { ScoreDifference } from "@/components/all-sports/ScoreChart";
import { IceHockeyScoreBreakdown } from "@/components/ice-hockey/IceHockeyScoreBreakdown";
import { FixtureRound, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "./sofascore";

export interface IceHockey_IceHockeyApi2_FixturePage_Response
  extends Sofascore_EventPage_Response {}

export interface IceHockey_IceHockeyApi2_Match_Response
  extends Sofascore_Event_Response {}

export interface IceHockey_IceHockeyApi2_LeagueTotalStandings_Response
  extends Sofascore_TotalStandings_Response {}

export interface IceHockey_IceHockeyApi2_MatchIncidents_Response
  extends Sofascore_EventIncidents_Response {}

export interface IceHockey_IceHockeyApi2_CategorySchedules_Response
  extends Sofascore_Events_Response {}

export interface IceHockeyFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface IceHockeyLadderPage<T extends readonly string[]> {
  standings: SportsLadder<T>[];
}

export interface IceHockeyMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: IceHockeyScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface IceHockeyTodayPage {
  fixtures: FixtureRound[];
  currentRound: string;
}
