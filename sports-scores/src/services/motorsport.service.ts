import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import { MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { getCurrentRound } from "@/lib/eventMapping";
import {
  Brackets,
  CardVariant,
  DisplayTypes,
  FixtureRound,
  MatchDetail,
  Matches,
  MatchStatus,
  SPORT,
  SportService,
  Standings,
} from "@/types/misc";
import { f1Service } from "./f1.service";

class MotorsportService implements SportService {
  // protected apiEndpoints: SofascoreAPI;
  protected sport: SPORT;
  protected categories: LeagueSeasonConfig[];
  // protected headings: readonly string[];
  // protected periodConfig?: PeriodConfig;
  protected cardVariant?: CardVariant;

  constructor(
    // apiEndpoints: SofascoreAPI,
    sport: SPORT,
    categories: LeagueSeasonConfig[],
    // headings: readonly string[],
    // periodConfig?: PeriodConfig,
    cardVariant?: CardVariant,
  ) {
    // this.apiEndpoints = apiEndpoints;
    this.sport = sport;
    this.categories = categories;
    // this.headings = headings;
    // this.periodConfig = periodConfig;
    this.cardVariant = cardVariant;
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    console.log(leagueId, seasonId);
    switch (leagueId) {
      case "f1":
        return await f1Service.matchesByLeagueSeason(leagueId, seasonId);

      default:
        return null;
    }
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const f1Events = await f1Service.matchesByDate(date);

    const motorsportFixtures: FixtureRound[] = [];

    motorsportFixtures.push(...(f1Events?.fixtures ?? []));

    switch (date.getDay()) {
      case 1: // Monday
      case 2: // Tuesday
      case 3: // Wednesday
        break;
      case 4: // Thursday
      case 5: // Friday
      case 6: // Saturday
      case 0: // Sunday
        motorsportFixtures.push({
          matches: [
            {
              id: "Supercars",
              sport: SPORT.MOTORSPORT,
              summaryText: "Supercars",
              startDate: date,
              status: MatchStatus.LIVE,
              awayDetails: { score: "", name: "" },
              homeDetails: { score: "", name: "" },
              matchSlug: "supercars/external",
              roundLabel: "Supercars",
            },
          ],
          roundLabel: "Supercars",
          cardVariant: this.cardVariant,
          roundSlug: `${SPORT.MOTORSPORT}/supercars/external`,
        });
        break;
    }

    return motorsportFixtures.length > 0
      ? {
          fixtures: motorsportFixtures,
          currentRound: getCurrentRound(
            motorsportFixtures,
            DisplayTypes.LEAGUE,
          ),
        }
      : null;
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    return null;
  }
  async matchDetails(matchId: string): Promise<MatchDetail | null> {
    return null;
  }
  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings<readonly string[]> | null> {
    return null;
  }

  async brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    return null;
  }
}

export { f1Service };

export const motorsportService = new MotorsportService(
  SPORT.MOTORSPORT,
  MOTORSPORT_CATEGORIES,
  CardVariant.MOTORSPORT,
);
