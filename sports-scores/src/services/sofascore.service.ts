import {
  LadderPlacingCategory,
  SportsLadder,
} from "@/components/all-sports/Ladder";
import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import { PeriodScore } from "@/components/all-sports/ScoreBreakdown";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchStandingsTotal,
  fetchTeamLastEvents,
  fetchTeamNextEvents,
} from "@/endpoints/sofascore.api";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
  mapSofascoreToStanding,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { resolvePlayoffPicture } from "@/lib/playoffPictureMapping";
import { getSportConfigurations, shortenTeamNames } from "@/lib/projUtils";
import {
  API_EVENT_TYPES,
  CardVariant,
  DISPLAY_TYPES,
  MatchDetail,
  Matches,
  MatchSummary,
  SPORT,
  SportService,
  Standings,
} from "@/types/misc";
import {
  PeriodKey,
  Sofascore_Event,
  Sofascore_Standing,
  SofascoreAPI,
  SofascoreSportURL,
} from "@/types/sofascore";
import { TZDate } from "@date-fns/tz/date";
import { isSameDay } from "date-fns";
import { matchSummariesByTournament } from "./dataverse.service";

export type PeriodConfig = {
  periodNames: string[];
  overtimeName?: string;
};

export abstract class SofascoreSport implements SportService {
  protected apiEndpoints: SofascoreAPI;
  protected sport: SPORT;
  protected sofascoreSport: SofascoreSportURL;
  protected leagues: LeagueSeasonConfig[];
  protected headings: readonly string[];
  protected periodConfig?: PeriodConfig;
  protected cardVariant?: CardVariant;

  constructor(
    apiEndpoints: SofascoreAPI,
    sport: SPORT,
    sofascoreSport: SofascoreSportURL,
    leagues: LeagueSeasonConfig[],
    headings: readonly string[],
    periodConfig?: PeriodConfig,
    cardVariant?: CardVariant,
  ) {
    this.apiEndpoints = apiEndpoints;
    this.sport = sport;
    this.sofascoreSport = sofascoreSport;
    this.leagues = leagues;
    this.headings = headings;
    this.periodConfig = periodConfig;
    this.cardVariant = cardVariant;
  }

  async matchesByLeagueSeason(
    tournamentId: number,
    seasonId: number,
    defaultRoundLabel: string = "Round",
  ): Promise<Matches | null> {
    const [lastMatches, nextMatches, dataverseMatches] = await Promise.all([
      (process.env.DEV_MODE
        ? fetchLastEvents
        : this.apiEndpoints.fetchLastEvents)(tournamentId, seasonId, 0),
      null,
      // (process.env.DEV_MODE
      //   ? fetchNextEvents
      //   : this.apiEndpoints.fetchNextEvents)(tournamentId, seasonId, 0),
      matchSummariesByTournament(tournamentId, seasonId, this.sport),
    ]);

    if (
      !lastMatches &&
      !nextMatches &&
      (!dataverseMatches || dataverseMatches.length === 0)
    ) {
      return null;
    }

    const apiMatches = (lastMatches?.events ?? [])
      // .concat(nextMatches?.events ?? [])
      .map((event) =>
        this.eventMapper(
          event,
          event.roundInfo?.name ??
            `${defaultRoundLabel} ${event.roundInfo?.round}`,
        ),
      );

    // Merge API and dataverse matches, deduplicating by id (API takes priority)
    const apiIds = new Set(apiMatches.map((m) => m.id));

    const allMatches = apiMatches
      .concat((dataverseMatches ?? []).filter((m) => !apiIds.has(m.id)))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

    const { leagueConfig } = getSportConfigurations(
      this.leagues,
      String(tournamentId),
      String(seasonId),
    );

    const fixture = await mapFixtureRounds(
      allMatches,
      leagueConfig,
      this.cardVariant,
    );

    return {
      fixtures: fixture,
      currentRound: getCurrentRound(fixture, leagueConfig?.display),
    } as Matches;
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const matches = await (process.env.DEV_MODE
      ? fetchEventsByDate(this.sofascoreSport, date)
      : this.apiEndpoints.fetchEventsByDate(date));

    if (!matches) return null;

    const validLeagueIds = this.leagues.map((l) => Number(l.slug));
    const timezone = date instanceof TZDate ? date.timeZone : "UTC";

    matches.events = matches.events
      .filter((item) => {
        const eventDate = new TZDate(item.startTimestamp * 1000, timezone);
        return isSameDay(eventDate, date);
      })
      .filter((item) =>
        validLeagueIds.includes(item.tournament.uniqueTournament.id),
      )
      .sort(
        // TODO: How do I want to sort this??
        (a, b) =>
          validLeagueIds.indexOf(a.tournament.uniqueTournament.id) -
          validLeagueIds.indexOf(b.tournament.uniqueTournament.id),
      );

    if (!matches.events || matches.events.length === 0) return null;

    const allMatches = matches.events.map((event) =>
      this.eventMapper(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    );

    const fixture = await mapFixtureRounds(
      allMatches,
      this.leagues,
      this.cardVariant,
    );

    return {
      fixtures: fixture,
      currentRound: getCurrentRound(fixture, DISPLAY_TYPES.LEAGUE),
    };
  }

  async matchesByTeam(teamId: number): Promise<Matches | null> {
    const lastMatches = await (
      process.env.DEV_MODE
        ? fetchTeamLastEvents
        : this.apiEndpoints.fetchTeamLastEvents
    )(teamId, 0);

    const nextMatches = await (
      process.env.DEV_MODE
        ? fetchTeamNextEvents
        : this.apiEndpoints.fetchTeamNextEvents
    )(teamId, 0);

    if (!lastMatches && !nextMatches) {
      return null;
    }

    const matches = (lastMatches?.events ?? []).concat(
      nextMatches?.events ?? [],
    );

    const allMatches = matches.map((event) =>
      this.eventMapper(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    );

    const fixture = await mapFixtureRounds(
      allMatches,
      this.leagues,
      this.cardVariant,
    );

    return {
      fixtures: fixture,
      currentRound: getCurrentRound(fixture, DISPLAY_TYPES.LEAGUE),
    };
  }

  async matchDetails(matchId: number): Promise<MatchDetail | null> {
    const match = await (
      process.env.DEV_MODE
        ? fetchEventDetails
        : this.apiEndpoints.fetchEventDetails
    )(matchId);
    const incidents = await (
      process.env.DEV_MODE
        ? fetchEventIncidents
        : this.apiEndpoints.fetchEventIncidents
    )(matchId);

    const matchDetails = match?.event;
    const scoreIncidents = incidents?.incidents
      ? incidents?.incidents
          .filter((item) => item.incidentType === "goal")
          .toReversed()
      : null;

    return {
      scoreEvents: !scoreIncidents
        ? undefined
        : scoreIncidents.map((item) => {
            return {
              event: item.incidentClass ?? "",
              difference: (item.homeScore ?? 0) - (item.awayScore ?? 0),
            };
          }),
      matchDetails: {
        status: `${matchDetails?.status.description}`,
        homeTeam: {
          name: shortenTeamNames(matchDetails?.homeTeam.name ?? ""),
          score: matchDetails?.homeScore?.current?.toString() ?? "0",
          img:
            matchDetails?.homeTeam.subTeams &&
            matchDetails?.homeTeam.subTeams.length > 0
              ? matchDetails.homeTeam.subTeams.map((subTeam) =>
                  resolveSportImage(subTeam.country.name ?? subTeam.name),
                )
              : resolveSportImage(
                  matchDetails?.homeTeam.country.name ??
                    matchDetails?.homeTeam.name ??
                    "",
                ),
        },
        awayTeam: {
          name: shortenTeamNames(matchDetails?.awayTeam.name ?? ""),
          score: matchDetails?.awayScore?.current?.toString() ?? "0",
          img:
            matchDetails?.awayTeam.subTeams &&
            matchDetails?.awayTeam.subTeams.length > 0
              ? matchDetails?.awayTeam.subTeams.map((subTeam) =>
                  resolveSportImage(subTeam.country.name ?? subTeam.name),
                )
              : resolveSportImage(
                  matchDetails?.awayTeam.country.name ??
                    matchDetails?.awayTeam.name ??
                    "",
                ),
        },
      },
      scoreBreakdown: matchDetails
        ? this.scoreBreakdownMapper(matchDetails)
        : [],
    };
  }

  async standings(
    tournamentId: number,
    seasonId: number,
  ): Promise<Standings<readonly string[]> | null> {
    const standings = await (
      process.env.DEV_MODE
        ? fetchStandingsTotal
        : this.apiEndpoints.fetchStandingsTotal
    )(tournamentId, seasonId);

    if (!standings) {
      return null;
    }

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      String(tournamentId),
      String(seasonId),
    );

    return {
      standings: standings?.standings
        // TODO: How do I want to sort tables??
        .sort((a, b) => {
          return 0;
        })
        .map((table) =>
          this.standingsMapper(table, ladderConfig?.placingCategories),
        ),
      playoffPicture: resolvePlayoffPicture(
        ladderConfig?.playoffPictureConfig,
        standings?.standings.map((table) => ({
          name: table.name,
          standings: table.rows.map((row) =>
            mapSofascoreToStanding(
              row,
              ladderConfig?.playoffPictureConfig?.totalSeasonGames ?? 0,
            ),
          ),
        })),
      ),
    } as Standings<typeof this.headings>;
  }

  protected eventMapper(
    match: Sofascore_Event,
    roundLabel: string,
  ): MatchSummary {
    return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, this.sport, match, {
      roundLabel,
    });
  }

  protected standingsMapper(
    table: Sofascore_Standing,
    placingCategories?: LadderPlacingCategory[],
  ): SportsLadder<typeof this.headings> {
    return {
      tableName: table.name,
      headings: this.headings,
      data: table.rows.map((item) => {
        return {
          position: item.position,
          team: {
            id: item.team.id.toString(),
            name: shortenTeamNames(item.team.name),
            logo: resolveSportImage(item.team.name),
          },

          Pts: item.points,
          P: item.matches,
          W: item.wins,
          OTL: item.overtimeLosses,
          L: item.losses,
          D: item.draws,
          F: item.scoresFor,
          A: item.scoresAgainst,
          Diff: item.scoresFor - item.scoresAgainst,
          PCT: item.percentage,
          "%": item.scoresAgainst
            ? Math.round((item.scoresFor / item.scoresAgainst) * 100)
            : 0,
          BP: (item.points ?? 0) - item.wins * 4 - (item.draws ?? 0) * 2,
        };
      }),
      placingCategories,
    } as SportsLadder<typeof this.headings>;
  }

  protected scoreBreakdownMapper(match: Sofascore_Event): PeriodScore[] {
    if (!this.periodConfig) return [];

    const breakdown: PeriodScore[] = this.periodConfig.periodNames.map(
      (name, i) => {
        const periodKey = `period${i + 1}` as PeriodKey;
        return {
          periodName: name,
          teams: {
            home: {
              score: match.homeScore?.[periodKey] ?? "0",
            },
            away: {
              score: match.awayScore?.[periodKey] ?? "0",
            },
          },
        };
      },
    );

    if (
      this.periodConfig.overtimeName &&
      match.homeScore?.overtime != undefined
    ) {
      breakdown.push({
        periodName: this.periodConfig.overtimeName,
        teams: {
          home: { score: match.homeScore?.overtime ?? "0" },
          away: { score: match.awayScore?.overtime ?? "0" },
        },
      });
    }

    return breakdown;
  }
}
