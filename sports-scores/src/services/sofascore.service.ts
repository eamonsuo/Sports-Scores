import {
  LadderPlacingCategory,
  SportsLadder,
} from "@/components/all-sports/Ladder";
import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import {
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { resolvePlayoffPicture } from "@/lib/playoffPictureMapping";
import { getSportConfigurations, shortenTeamNames } from "@/lib/projUtils";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  Matches,
  MatchSummary,
  SPORT,
  Standings,
} from "@/types/misc";
import type { PlayoffPictureStanding } from "@/types/playoff-picture";
import {
  Sofascore_Event,
  Sofascore_Standing,
  Sofascore_StandingRow,
  SofascoreAPI,
  SofascoreSportURL,
} from "@/types/sofascore";
import { TZDate } from "@date-fns/tz/date";
import { isSameDay } from "date-fns";
import { matchSummariesByTournament } from "./dataverse.service";

export class SofascoreSport {
  protected apiEndpoints: SofascoreAPI;
  protected sport: SPORT;
  protected sofascoreSport: SofascoreSportURL;
  protected leagues: LeagueSeasonConfig[];
  protected headings: readonly string[];

  constructor(
    apiEndpoints: SofascoreAPI,
    sport: SPORT,
    sofascoreSport: SofascoreSportURL,
    leagues: LeagueSeasonConfig[],
    headings: readonly string[],
  ) {
    this.apiEndpoints = apiEndpoints;
    this.sport = sport;
    this.sofascoreSport = sofascoreSport;
    this.leagues = leagues;
    this.headings = headings;
  }

  async matchesAll(tournamentId: number, seasonId: number) {
    const [lastMatches, nextMatches, dataverseMatches] = await Promise.all([
      (process.env.DEV_MODE
        ? fetchLastEvents
        : this.apiEndpoints.fetchLastEvents)(tournamentId, seasonId, 0),
      (process.env.DEV_MODE
        ? fetchNextEvents
        : this.apiEndpoints.fetchNextEvents)(tournamentId, seasonId, 0),
      matchSummariesByTournament(tournamentId, seasonId, this.sport),
    ]);

    if (!lastMatches && !nextMatches && !dataverseMatches) {
      return null;
    }

    const apiMatches = (lastMatches?.events ?? [])
      .concat(nextMatches?.events ?? [])
      .map((event) =>
        this.eventMapper(
          event,
          event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
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
      tournamentId,
      seasonId,
    );

    const fixture = await mapFixtureRounds(allMatches, leagueConfig);

    return {
      fixtures: fixture,
      currentRound: getCurrentRound(fixture, leagueConfig?.display),
    } as Matches;
  }

  async matchesByDate(date: Date) {
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

    const fixture = await mapFixtureRounds(allMatches, this.leagues);

    return {
      fixtures: fixture,
      currentRound: getCurrentRound(fixture, DISPLAY_TYPES.LEAGUE),
    } as Matches;
  }

  async standings(tournamentId: number, seasonId: number) {
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
      tournamentId,
      seasonId,
    );

    return {
      standings: standings?.standings.map((table) =>
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

  async matchDetails(matchId: number): Promise<any> {}

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
          L: item.losses,
          D: item.draws,
          Diff: item.scoresFor - item.scoresAgainst,
          F: item.scoresFor,
          "%": item.scoresAgainst
            ? Math.round((item.scoresFor / item.scoresAgainst) * 100)
            : 0,
        };
      }),
      placingCategories,
    } as SportsLadder<typeof this.headings>;
  }
}

function mapSofascoreToStanding(
  row: Sofascore_StandingRow,
  totalSeasonGames: number,
): PlayoffPictureStanding {
  return {
    team: {
      id: row.team.id,
      name: shortenTeamNames(row.team.name),
      logo: resolveSportImage(row.team.name),
    },
    position: row.position,
    played: row.matches,
    totalSeasonGames,
    wins: row.wins,
    losses: row.losses,
    draws: row.draws ?? 0,
    tiebreakers: {
      pointsFor: row.scoresFor,
      pointsAgainst: row.scoresAgainst,
      pointsDiff: row.scoresFor - row.scoresAgainst,
    },
  };
}
