import { ScoreDifference } from "@/components/generic/ScoreChart";
import { NRLStanding } from "@/components/nrl/NRLLadder";
import { NRLScoreBreakdown } from "@/components/nrl/NRLScoreBreakdown";
import { MatchSummary, TeamScoreDetails } from "./misc";
import {
  Sofascore_Event,
  Sofascore_Incident,
  Sofascore_Standing,
} from "./sofascore.api";

export interface NRL_RugbyAPI2_FixturePage_Response {
  events: Sofascore_Event[];
  hasNextPage: boolean;
}

export interface NRL_RugbyAPI2_Match_Response {
  event: Sofascore_Event;
}

export interface NRL_RugbyAPI2_LeagueTotalStandings_Response {
  standings: Sofascore_Standing[];
}

export interface NRL_RugbyAPI2_MatchIncidents_Response {
  incidents: Sofascore_Incident[];
}

export interface NRLFixturesPage {
  fixtures: MatchSummary[];
}

export interface NRLLadderPage {
  standings: NRLStanding[];
}

export interface NRLMatchPage {
  matchDetails: {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
    scoreBreakdown: NRLScoreBreakdown[];
  };
  scoreEvents: ScoreDifference[];
}
