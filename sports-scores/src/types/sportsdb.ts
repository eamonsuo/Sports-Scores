export interface SportsDB_Event {
  idEvent: string;
  idAPIfootball: string | null;
  strEvent: string;
  strEventAlternate: string;
  strFilename: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strLeagueBadge: string;
  strSeason: string;
  strDescriptionEN: string | null;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: number | null;
  intRound: string;
  intAwayScore: number | null;
  intSpectators: number | null;
  strOfficial: string | null;
  strTimestamp: string;
  dateEvent: string;
  dateEventLocal: string | null;
  strTime: string;
  strTimeLocal: string | null;
  strGroup: string | null;
  idHomeTeam: string;
  strHomeTeamBadge: string;
  idAwayTeam: string;
  strAwayTeamBadge: string;
  intScore: number | null;
  intScoreVotes: number | null;
  strResult: string | null;
  idVenue: string;
  strVenue: string;
  strCountry: string | null;
  strCity: string | null;
  strPoster: string;
  strSquare: string;
  strFanart: string | null;
  strThumb: string;
  strBanner: string;
  strMap: string | null;
  strTweet1: string | null;
  strVideo: string | null;
  strStatus: string | null;
  strPostponed: string;
  strLocked: string;
}

export interface SportsDB_Events_Response {
  events: SportsDB_Event[];
}
