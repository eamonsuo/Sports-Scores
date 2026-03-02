import { FixtureRound } from "./misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "./sofascore";

export interface Cycling_CyclingAPI2_FixturePage_Response
  extends Sofascore_EventPage_Response {}

export interface Cycling_CyclingAPI2_Match_Response
  extends Sofascore_Event_Response {}

export interface Cycling_CyclingAPI2_LeagueTotalStandings_Response
  extends Sofascore_TotalStandings_Response {}

export interface Cycling_CyclingAPI2_MatchIncidents_Response
  extends Sofascore_EventIncidents_Response {}

export interface Cycling_CyclingAPI2_CategorySchedules_Response
  extends Sofascore_Events_Response {}

export interface CyclingFixturesPage {
  fixtures: FixtureRound[];
  currentRound: string;
}

export interface CyclingTodayPage {
  fixtures: FixtureRound[];
  currentRound: string;
}
