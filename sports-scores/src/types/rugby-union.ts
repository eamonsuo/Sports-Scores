import { ScoreDifference } from "@/components/all-sports/ScoreChart";
import { RugbyLeagueScoreBreakdown } from "@/components/rugby-league/nrl/NRLScoreBreakdown";
import { RugbyUnionStanding } from "@/components/rugby-union/RugbyUnionLadder";
import { FixtureRound, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "./sofascore";

export interface RugbyUnion_RugbyAPI2_FixturePage_Response
  extends Sofascore_EventPage_Response {}

export interface RugbyUnion_RugbyAPI2_Match_Response
  extends Sofascore_Event_Response {}

export interface RugbyUnion_RugbyAPI2_LeagueTotalStandings_Response
  extends Sofascore_TotalStandings_Response {}

export interface RugbyUnion_RugbyAPI2_MatchIncidents_Response
  extends Sofascore_EventIncidents_Response {}

export interface RugbyUnion_RugbyAPI2_CategorySchedules_Response
  extends Sofascore_Events_Response {}

export interface RugbyUnionFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface RugbyUnionLadderPage {
  standings: RugbyUnionStanding[][];
  qualifyingPosition: number;
}

export interface RugbyUnionMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: RugbyLeagueScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface RugbyUnionTodayPage {
  fixtures: FixtureRound[];
  currentRound: string;
}
