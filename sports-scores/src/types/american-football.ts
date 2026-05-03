import {
  Sofascore_Event,
  Sofascore_Event_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
} from "./sofascore";

export interface AmericanFootball_Sofascore_Event extends Sofascore_Event {
  homeTeamSeasonHistoricalForm?: {
    wins: number;
    losses: number;
    draws?: number;
  };
  awayTeamSeasonHistoricalForm?: {
    wins: number;
    losses: number;
    draws?: number;
  };
}

export interface AmericanFootball_AmericanFootballApi_FixturePage_Response
  extends Sofascore_EventPage_Response {
  events: AmericanFootball_Sofascore_Event[];
}

export interface AmericanFootball_AmericanFootballApi_Match_Response
  extends Sofascore_Event_Response {
  event: AmericanFootball_Sofascore_Event;
}

export interface AmericanFootball_AmericanFootballApi_CategorySchedule_Response
  extends Sofascore_Events_Response {
  events: AmericanFootball_Sofascore_Event[];
}
