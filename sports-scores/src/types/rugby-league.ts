import { SportsLadder } from "@/components/all-sports/Ladder";
import { ScoreDifference } from "@/components/all-sports/ScoreChart";
import { RugbyLeagueScoreBreakdown } from "@/components/rugby-league/RugbyLeagueScoreBreakdown";
import { FixtureRound, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "./sofascore";

export interface RugbyLeague_RugbyAPI2_FixturePage_Response
  extends Sofascore_EventPage_Response {}

export interface RugbyLeague_RugbyAPI2_Match_Response
  extends Sofascore_Event_Response {}

export interface RugbyLeague_RugbyAPI2_LeagueTotalStandings_Response
  extends Sofascore_TotalStandings_Response {}

export interface RugbyLeague_RugbyAPI2_MatchIncidents_Response
  extends Sofascore_EventIncidents_Response {}

export interface RugbyLeague_RugbyAPI2_CategorySchedules_Response
  extends Sofascore_Events_Response {}

export interface RugbyLeagueFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface RugbyLeagueLadderPage<T extends readonly string[]> {
  standings: SportsLadder<T>[];
}

export interface RugbyLeagueMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: RugbyLeagueScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}

export interface RugbyLeagueTodayPage {
  fixtures: FixtureRound[];
  currentRound: string;
}
