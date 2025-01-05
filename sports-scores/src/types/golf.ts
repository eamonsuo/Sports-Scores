interface Tournament {
  id: string;
  leaderboardId: string;
  tourCode: string;
}

interface NavMenuItem {
  key: string;
  link: string;
  label: string;
}

interface NavList {
  key: string;
  menu: NavMenuItem[];
}

interface LegalNavItem {
  key: string;
  link: string;
  label: string;
}

interface SocialNavItem {
  key: string;
  link: string;
  label: string;
}

interface LegalText {
  key: string;
  label: string;
}

interface TourNavFooter {
  navLists: NavList[];
  legalNav: { key: string; menu: LegalNavItem[] }[];
  socialNav: SocialNavItem[];
  legalText: LegalText;
  secondaryLegalText: LegalText;
}

interface TourNavHeaderItem {
  key: string;
  link: string;
  label: string;
  menu?: TourNavHeaderItem[];
}

interface TourSwitcherItem {
  id?: string;
  label: string;
  code: string;
  logoUrl: string;
  external: boolean;
  link?: string;
}

interface BackgroundOverride {
  enabled: boolean;
  wings: string;
}

interface HomeNavIconOverride {
  enabled: boolean;
  homeNavIcon: string;
}

interface SearchQuickLink {
  key: string;
  url: string;
  displayText: string;
  newTab: boolean;
}

interface Seasons {
  standings: number;
  stats: number;
  schedule: number;
}

interface PageContext {
  locale: string;
  pagePath: string;
  tourCode: string;
  partnerId: string | null;
  tournaments: Tournament[];
  clientIp: string;
  countryCode: string;
  isEmbeddedWebView: boolean;
  queryArgs: Record<string, unknown>;
  activeTournamentOverride: string | null;
  universalTournaments: string[];
  bypassObsoleteCheck: boolean;
  tourNavFooter: TourNavFooter;
  tourNavHeader: TourNavHeaderItem[];
  tourSwitcher: TourSwitcherItem[];
  coverageTournament: string[];
  backgroundOverride: Record<string, BackgroundOverride>;
  homeNavIconOverride: Record<string, HomeNavIconOverride>;
  searchQuickLinks: Record<string, SearchQuickLink[]>;
  seasons: Record<string, Seasons>;
}

interface TournamentCategoryInfo {
  type: string;
  logoLight: string;
  logoDark: string;
  label: string;
}

interface TournamentDetails {
  id: string;
  tournamentName: string;
  tournamentLogo: string[];
  tournamentLocation: string;
  tournamentStatus: string;
  roundStatusDisplay: string;
  roundDisplay: string;
  roundStatus: string;
  roundStatusColor: string;
  currentRound: number;
  timezone: string;
  pdfUrl: string | null;
  seasonYear: string;
  displayDate: string;
  country: string;
  state: string;
  city: string;
  scoredLevel: string;
  infoPath: string | null;
  events: any[];
  courses: {
    id: string;
    courseName: string;
    courseCode: string;
    hostCourse: boolean;
    scoringLevel: string;
  }[];
  weather: {
    logo: string;
    logoDark: string;
    logoAccessibility: string;
    tempF: string;
    tempC: string;
    condition: string;
    windDirection: string;
    windSpeedMPH: string;
    windSpeedKPH: string;
    precipitation: string;
    humidity: string;
  };
  ticketsURL: string;
  tournamentSiteURL: string;
  formatType: string;
  features: string[];
  conductedByLabel: string | null;
  conductedByLink: string | null;
  beautyImage: string;
  hideRolexClock: boolean;
  hideSov: boolean;
  headshotBaseUrl: string | null;
  rightRailConfig: string | null;
  shouldSubscribe: boolean;
  ticketsEnabled: boolean;
  useTournamentSiteURL: boolean;
  tournamentCategoryInfo: TournamentCategoryInfo;
}

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  amateur: boolean;
  displayName: string;
  abbreviations: string;
  abbreviationsAccessibilityText: string;
  country: string;
  countryFlag: string;
  shortName: string;
  lineColor: string;
  tourBound: boolean;
  bettingProfile: string;
}

interface ScoringData {
  position: string;
  total: string;
  totalSort: number;
  thru: string;
  thruSort: number;
  score: string;
  scoreSort: number;
  teeTime: number;
  courseId: string;
  groupNumber: number;
  currentRound: number;
  oddsToWin: string;
  oddsSwing: string;
  oddsOptionId: string;
  oddsSort: number;
  backNine: boolean;
  roundHeader: string;
  rounds: string[];
  movementDirection: string;
  movementAmount: string;
  playerState: string;
  rankingMovement: string;
  rankingMovementAmount: string;
  rankingMovementAmountSort: number;
  totalStrokes: string;
  official: string;
  officialSort: number;
  projected: string;
  projectedSort: number;
  hasStoryContent: boolean;
  storyContentRounds: any[];
  roundStatus: string;
}

export interface PlayerRow {
  __typename: string;
  id: string;
  leaderboardSortOrder: number;
  player: Player;
  scoringData: ScoringData;
}

interface Course {
  __typename: string;
  id: string;
  courseName: string;
  courseCode: string;
  scoringLevel: string;
  hostCourse: boolean;
}

interface FeatureItem {
  __typename: string;
  name: string;
  leaderboardFeatures: string;
  new: boolean;
  tooltipText: string;
  tooltipTitle: string;
}

interface Round {
  roundNumber: number;
  displayText: string;
}

interface Leaderboard {
  __typename: string;
  id: string;
  timezone: string;
  tournamentId: string;
  tourcastURL: string;
  tourcastURLWeb: string;
  tourcastURI: string;
  leaderboardRoundHeader: string;
  formatType: string;
  players: PlayerRow[];
  courses: Course[];
  messages: any[];
  tournamentStatus: string;
  rounds: Round[];
  isPlayoffActive: boolean;
  scorecardEnabled: boolean;
  profileEnabled: boolean;
  subEvent: boolean;
  leaderboardFeatures: FeatureItem[];
  standingsEnabled: boolean;
  standingsHeader: string;
  hideSov: boolean;
  disableOdds: boolean;
}

interface TournamentPill {
  tournamentId: string;
  displayName: string;
}

interface YearPill {
  year: number;
  displaySeason: string;
}

interface TourCupDetails {
  id: string;
  title: string;
  projectedTitle: string;
  season: string;
  description: string;
  detailCopy: string;
  logo: string;
  options: string;
  projectedLive: boolean;
  fixedHeaders: number;
  columnHeaders: string[];
  players: any[]; // Define this based on the actual structure if needed
  tournamentPills: TournamentPill[];
  yearPills: YearPill[];
  rankingsHeader: string;
  winner: any | null; // Define this based on the actual structure if needed
  message: string;
  partner: any | null; // Define this based on the actual structure if needed
  partnerLink: any | null; // Define this based on the actual structure if needed
}

export interface PGALeaderboardPage {
  props: {
    pageProps: {
      pageContext: PageContext;
      tournament: TournamentDetails;
      leaderboardId: string;
      isOddsAvailable: boolean;
      leaderboard: Leaderboard;
      teeTimes: any | null;
      matchPlayLeaderboard: any | null;
      matchPlayTeeTimes: any | null;
      odds: any | null;
      field: any | null;
      tourcastTable: any | null;
      courseStats: any | null;
      pastResults: any | null;
      overview: any | null;
      tourCupDetails: TourCupDetails;
      tourCupDetailsKey: string;
      teamStrokePlayLeaderboard: any | null;
      recap: any | null;
      adConfig: any;
      cupTournamentLeaderboard: any | null;
      cupTournamentKey: string;
      cupPlayOverviewLeaderboard: any | null;
      cupTournamentTeeTimes: any | null;
      cupTournamentPastResults: any | null;
      currentLeaders: any | null;
      tourCupStandings: any | null;
      cupTournamentTeamRoster: any | null;
    };
    __N_SSP: boolean;
  };
  page: string;
  query: Record<string, unknown>;
  buildId: string;
  assetPrefix: string;
  isFallback: boolean;
  isExperimentalCompile: boolean;
  gssp: boolean;
  locale: string;
  locales: string[];
  defaultLocale: string;
  scriptLoader: any[];
}
