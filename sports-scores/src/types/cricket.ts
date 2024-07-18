export interface CricinfoResponse {
  appNextJsContext: any;
  globalDetails: any;
  editionDetails: any;
  appPageProps: {
    data: {
      content: {
        matches: CricketMatch[];
      };
    };
    layout: any;
  };
}

export interface CricketMatch {
  _uid: number;
  id: number;
  objectId: number;
  scribeId: number;
  slug: string;
  stage: string;
  state: string;
  internationalClassId: number | null;
  generalClassId: number;
  subClassId: number | null;
  season: string;
  title: string;
  floodlit: string;
  startDate: string;
  endDate: string;
  startTime: string;
  timePublished: boolean;
  scheduleNote: string;
  isCancelled: boolean;
  coverage: string;
  coverageNote: string;
  liveStreamUrl: string | null;
  countryLiveStreamUrl: any;
  highlightsUrl: string | null;
  countryHighlightsUrl: any;
  status: string;
  statusText: string;
  statusEng: string;
  internationalNumber: number | null;
  generalNumber: number | null;
  winnerTeamId: number | null;
  tossWinnerTeamId: number;
  tossWinnerChoice: number;
  resultStatus: string | null;
  liveInning: number;
  liveInningPredictions: string | null;
  liveOvers: number | null;
  liveOversPending: number | null;
  liveBalls: string | null;
  liveRecentBalls: string | null;
  livePlayers: string | null;
  ballsPerOver: number | null;
  series: Series;
  ground: Ground;
  teams: Team[];
  dayType: string;
  format: string;
  headToHeadSource: string;
  previewStoryId: number | null;
  reportStoryId: number | null;
  liveBlogStoryId: number | null;
  fantasyPickStoryId: number | null;
  drawOdds: string | null;
  isSuperOver: boolean;
  isScheduledInningsComplete: boolean;
  hasStandings: boolean;
  hasSuperStats: boolean;
  hasGameboard: boolean;
  hasFanRatings: boolean;
  totalGalleries: number;
  totalImages: number;
  totalVideos: number;
  totalStories: number;
  languages: string[];
  generatedAt: string;
  scorecardSource: string;
  ballByBallSource: string;
}

interface Series {
  id: number;
  objectId: number;
  scribeId: number;
  slug: string;
  name: string;
  longName: string;
  alternateName: string;
  longAlternateName: string | null;
  unofficialName: string | null;
  year: number;
  typeId: number;
  isTrophy: boolean;
  description: string;
  season: string;
  startDate: string;
  endDate: string;
  hasStandings: boolean;
  standingsType: number;
  totalVideos: number;
  totalSquads: number;
  gamePlayWatch: boolean;
}

interface Ground {
  id: number;
  objectId: number;
  name: string;
  smallName: string;
  longName: string;
  slug: string;
  location: string;
  image: Image;
  town: Town;
  country: Country;
  capacity: number | null;
}

interface Image {
  id: number;
  objectId: number;
  slug: string;
  url: string;
  width: number;
  height: number;
  caption: string;
  longCaption: string;
  credit: string;
  photographer: string | null;
  peerUrls: string | null;
}

interface Town {
  id: number;
  objectId: number;
  name: string;
  area: string;
  timezone: string;
}

interface Country {
  id: number;
  objectId: number;
  name: string;
  shortName: string;
  abbreviation: string;
  slug: string;
}

interface Team {
  team: TeamDetails;
  isHome: boolean;
  isLive: boolean;
  score: string | null;
  scoreInfo: string | null;
  inningNumbers: number[];
  points: string | null;
  sidePlayers: string | null;
  sideBatsmen: string | null;
  sideFielders: string | null;
  captain: string | null;
  teamOdds: string | null;
}

interface TeamDetails {
  id: number;
  objectId: number;
  scribeId: number;
  slug: string;
  name: string;
  longName: string;
  abbreviation: string;
  unofficialName: string | null;
  imageUrl: string;
  isCountry: boolean;
  primaryColor: string | null;
  image: Image;
  country: Country;
}
