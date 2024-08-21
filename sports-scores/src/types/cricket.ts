export interface CricinfoResponse<T> {
  props: {
    appNextJsContext: any;
    globalDetails: any;
    editionDetails: any;
    appPageProps: T;
  };
}

export interface CricketMatchResults {
  data: {
    content: {
      matches: CricketMatch[];
    };
  };
  layout: any;
}

export interface CricketAllSeriesResults {
  data: {
    collections: {
      title: string;
      seriesGroups: {
        title: string;
        items: {
          title: string;
          series: CricketSeries;
          images: CricketImage[];
        }[];
      }[];
    }[];
  };
  layout: any;
}

export interface CricketSeriesResult {
  data: {
    series: CricketSeries;
    content: {
      feed: any;
      seriesResults: { results: SeriesMatchResults[] } | null;
      recentFixtures: any;
      recentResults: any[];
      standings: CricketStandings | null;
      topBatsmen: any[];
      topBowlers: any[];
      topFanRatings: any;
      smartStats: any | null;
      recentSimilarSerieses: any[];
      recordEntity: any;
      trophyRecordEntity: any | null;
      otherSerieses: any;
      teams: Team[];
    };
  };
  layout: any;
}

export interface CricketMatchDetails {
  data: {
    match: CricketMatch;
    content: {
      matchPlayers: {
        teamPlayers: TeamPlayer[];
      } | null;
      notes: {
        groups: [];
      };
      closeOfPlay: null | any;
      matchPlayerAwards: any[];
      innings: Inning[];
      superOverInnings: any[];
      supportInfo: SupportInfo;
    };
  };
  layout: any;
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
  series: CricketSeries;
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
  umpires?: { player: Player; team: Team }[];
}

interface FanRating {
  id: number;
  type: string;
  name: string;
}

interface FanRatings {
  playerMatchClasses: FanRating[];
}

export interface CricketSeries {
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
  fanRatings?: FanRatings;
  trophy?: string | null;
  hasStats?: boolean;
  hasSmartStats?: boolean;
  matchClass?: string | null;
  totalTeams?: number;
  totalGalleries?: number;
  totalImages?: number;
}

interface Ground {
  id: number;
  objectId: number;
  name: string;
  smallName: string;
  longName: string;
  slug: string;
  location: string;
  image: CricketImage;
  town: Town;
  country: Country;
  capacity: number | null;
}

export interface CricketImage {
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
  peerUrls: string | null | string[];
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
  image: CricketImage;
  country: Country;
}

interface TeamPlayer {
  type: "PLAYING";
  team: Team;
  players: PlayerStats[];
  bestBatsmen: PlayerPerformance[];
  bestBowlers: PlayerPerformance[];
}

interface PlayerStats {
  playerRoleType: "P";
  player: Player;
  isOverseas: boolean;
  isWithdrawn: boolean;
  note: string | null;
}

interface Player {
  id: number;
  objectId: number;
  name: string;
  longName: string;
  mobileName: string;
  indexName: string;
  battingName: string;
  fieldingName: string;
  slug: string;
  imageUrl: string;
  headshotImageUrl: string;
  dateOfBirth: DateOfBirth;
  dateOfDeath: DateOfBirth | null;
  gender: "F" | "M";
  battingStyles: string[];
  bowlingStyles: string[];
  longBattingStyles: string[];
  longBowlingStyles: string[];
  image: CricketImage;
  countryTeamId: number;
  playerRoleTypeIds: number[];
  playingRoles: string[];
  headshotImage: CricketImage;
}

interface DateOfBirth {
  year: number;
  month: number;
  date: number;
}

interface PlayerPerformance {
  player: Player;
  team: Team;
  matches: number;
  runs?: number;
  innings: number;
  average: number;
  notouts?: number;
  wickets?: number;
  economy?: number;
  conceded?: number;
  balls?: number;
  strikerate?: number;
}

interface SupportInfo {
  stories: any[];
  videos: any[];
  seriesStories: any[];
  seriesStandings: any | null;
  liveInfo: any | null;
  liveSummary: any | null;
  superOverLiveSummary: any | null;
  mostValuedPlayerOfTheMatch: any | null;
  playersOfTheMatch: any | null;
  playersOfTheSeries: any | null;
  matchSeriesResult: MatchSeriesResult;
  recentReportStory: any | null;
  recentPreviewStory: any | null;
  liveBlogStory: any | null;
  fantasyPickStory: any | null;
  commentaryStarted: boolean;
  superOver: boolean;
  bet365Odds: any | null;
  teamsPrevMatches: any;
  teamsNextMatches: any;
  seriesPrevMatches: any[];
}

interface MatchSeriesResult {
  leadTeam: TeamDetails;
  leadType: number;
  leadHowWon: number;
  resultType: number;
  matchesWonByLeadTeam: number;
  matchesWonByLoserTeam: number;
  matchNumber: number;
  totalNumberOfMatches: number;
  abondonedNumberOfMatches: number;
  cancelledNumberOfMatches: number;
  isLeadAbandoned: boolean;
  isLeadCancelled: boolean;
  groupTitle: string;
}

interface Inning {
  inningNumber: number;
  isCurrent: boolean;
  team: TeamDetails;
  isBatted: boolean;
  runs: number;
  wickets: number;
  lead: number;
  target: number;
  overs: number;
  balls: number;
  totalOvers: number;
  totalBalls: number;
  minutes: number | null;
  extras: number;
  byes: number;
  legbyes: number;
  wides: number;
  noballs: number;
  penalties: number;
  event: number;
  ballsPerOver: number;
  inningBatsmen: CricketInningBatsman[];
  inningBowlers: CricketInningBowler[];
  inningPartnerships: InningPartnership[];
  inningOvers: any[]; //TODO: maybe other matches have this
  inningWickets: InningWicket[];
  inningFallOfWickets: FallOfWicket[];
  inningDRSReviews: any[];
  inningOverGroups: any[];
}

export interface CricketInningBatsman {
  playerRoleType: string;
  player: Player;
  battedType: string;
  runs: number | null;
  balls: number | null;
  minutes: number | null;
  fours: number | null;
  sixes: number | null;
  strikerate: number | null;
  isOut: boolean;
  dismissalType: number | null;
  dismissalBatsman: Player | null;
  dismissalBowler: Player | null;
  dismissalFielders: DismissalFielder[] | null;
  dismissalText: DismissalText | null;
  dismissalComment: string | null;
  fowOrder: number | null;
  fowWicketNum: number | null;
  fowRuns: number | null;
  fowBalls: number | null;
  fowOvers: number | null;
  fowOverNumber: number | null;
  ballOversActual: number | null;
  ballOversUnique: number | null;
  ballTotalRuns: number | null;
  ballBatsmanRuns: number | null;
  videos: any[];
  images: any[];
  currentType: string | null;
}

interface DismissalFielder {
  player: Player;
  isKeeper: boolean;
  isSubstitute: boolean;
}

interface DismissalText {
  short: string;
  long: string;
  commentary: string;
}

export interface CricketInningBowler {
  player: Player;
  bowledType: string;
  overs: number;
  balls: number;
  maidens: number;
  conceded: number;
  wickets: number;
  economy: number;
  runsPerBall: number;
  dots: number | null;
  fours: number | null;
  sixes: number | null;
  wides: number;
  noballs: number;
  videos: any[]; // replace `any` with a more specific type if available
  images: any[]; // replace `any` with a more specific type if available
  currentType: string | null;
  inningWickets: any[]; // replace `any` with a more specific type if available
}

interface InningPartnership {
  player1: Player;
  player2: Player;
  outPlayerId: number;
  player1Runs: number;
  player1Balls: number;
  player2Runs: number;
  player2Balls: number;
  runs: number;
  balls: number;
  overs: number;
  isLive: boolean;
}

interface InningWicket {
  playerRoleType: string;
  player: Player;
  battedType: string;
  runs: number;
  balls: number;
  minutes: number | null;
  fours: number;
  sixes: number;
  strikerate: number;
  isOut: boolean;
  dismissalType: number;
  dismissalBatsman: Player;
  dismissalBowler: Player | null;
  dismissalFielders: Fielder[];
  dismissalText: DismissalText;
  dismissalComment: string | null;
  fowOrder: number;
  fowWicketNum: number;
  fowRuns: number;
  fowBalls: number | null;
  fowOvers: number;
  fowOverNumber: number;
  ballOversActual: number | null;
  ballOversUnique: number | null;
  ballTotalRuns: number | null;
  ballBatsmanRuns: number | null;
  videos: any[]; // Define type based on actual video data structure if available
  images: any[]; // Define type based on actual image data structure if available
  currentType: string | null;
}

interface Fielder {
  player: Player;
  isKeeper: boolean;
  isSubstitute: boolean;
}

interface FallOfWicket {
  fowOrder: number;
  fowWicketNum: number;
  fowRuns: number;
  fowOvers: number;
  fowBalls: number | null;
}

interface SeriesMatchResults {
  series: CricketSeries;
  classId: number;
  isLive: boolean;
  result: Result;
}

interface Result {
  leadTeam: TeamDetails;
  leadType: number;
  leadHowWon: number;
  resultType: number;
  matchesWonByLeadTeam: number;
  matchesWonByLoserTeam: number;
  matchNumber: number | null;
  totalNumberOfMatches: number;
  abondonedNumberOfMatches: number;
  cancelledNumberOfMatches: number;
  isLeadAbandoned: boolean;
  isLeadCancelled: boolean;
  groupTitle: string | null;
}

export interface CricketStandings {
  series: CricketSeries;
  notes: string;
  teamsToQualifyCount: number | null;
  available: any;
  groups: StandingsGroup[];
  finalMatches: any[];
  liveTeamIds: any[];
  objects: any;
}

interface StandingsGroup {
  name: string;
  teamsToQualifyCount: number;
  teamStats: StandingsTeam[];
  finalMatches: any[];
}

interface StandingsTeam {
  teamInfo: TeamDetails;
  recentMatches: any[];
  rank: number;
  seriesPlayed: number | null;
  seriesWon: number | null;
  matchesPlayed: string;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;
  matchesDrawn: number;
  matchesNoResult: number;
  points: number;
  quotient: number | null;
  nrr: number | null;
  rpwr: number | null; // If applicable, otherwise remove if not used
  for: string;
  against: string;
  pct: number | null; // Percentage
  nextMatch: any[] | null;
  allMatchObjectIds: number[];
}
