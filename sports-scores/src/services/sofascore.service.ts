import { Match as BracketMatch } from "@/components/bracket/types";
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { resolvePlayoffPicture } from "@/lib/playoffPictureMapping";
import {
  getSportConfigurations,
  setMatchSummary,
  setSeriesInfo,
  setTimer,
  shortenTeamNames,
} from "@/lib/projUtils";
import {
  Brackets,
  CardVariant,
  DeepPartial,
  DisplayTypes,
  LadderPlacingCategory,
  LeagueSeasonConfig,
  MatchDetail,
  Matches,
  MatchStatus,
  MatchSummary,
  PeriodScore,
  SPORT,
  SportService,
  SportsLadder,
  Standings,
  TeamScoreDetails,
} from "@/types/misc";
import { PlayoffPictureStanding } from "@/types/playoff-picture";
import {
  PeriodKey,
  Sofascore_Event,
  Sofascore_Standing,
  Sofascore_StandingRow,
  SofascoreAPI,
} from "@/types/sofascore";
import { TZDate } from "@date-fns/tz/date";
import { isSameDay } from "date-fns";
import { matchSummariesByTournament } from "./dataverse.service";

export type ScoreBreakdownConfig = {
  periodNames: string[];
  overtimeName?: string;
};

export abstract class SofascoreSport implements SportService {
  protected apiEndpoints: SofascoreAPI;
  protected sport: SPORT;
  protected leagues: LeagueSeasonConfig[];
  protected headings: readonly string[];
  protected scoreBreakdownConfig?: ScoreBreakdownConfig;
  protected cardVariant?: CardVariant;

  constructor(
    apiEndpoints: SofascoreAPI,
    sport: SPORT,
    leagues: LeagueSeasonConfig[],
    headings: readonly string[],
    scoreBreakdownConfig?: ScoreBreakdownConfig,
    cardVariant?: CardVariant,
  ) {
    this.apiEndpoints = apiEndpoints;
    this.sport = sport;
    this.leagues = leagues;
    this.headings = headings;
    this.scoreBreakdownConfig = scoreBreakdownConfig;
    this.cardVariant = cardVariant;
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const [lastMatches, nextMatches, dataverseMatches] = await Promise.all([
      this.apiEndpoints.fetchLastEvents(leagueId, seasonId, 0),
      this.apiEndpoints.fetchNextEvents(leagueId, seasonId, 0),
      matchSummariesByTournament(leagueId, seasonId, this.sport),
    ]);

    if (
      !lastMatches &&
      !nextMatches &&
      (!dataverseMatches || dataverseMatches.length === 0)
    ) {
      return null;
    }

    const apiMatches = (lastMatches?.events ?? [])
      .concat(nextMatches?.events ?? [])
      .map((event) =>
        this.eventMapper(event, {
          roundLabel:
            event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
        }),
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
      leagueId,
      seasonId,
    );

    const fixtures = await mapFixtureRounds(
      allMatches,
      leagueConfig,
      this.cardVariant,
    );

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches;
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const matches = await this.apiEndpoints.fetchEventsByDate(date);

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
      this.eventMapper(event, {
        roundLabel: event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
        seriesName: `${
          this.leagues.find(
            (l) => l.slug === event.tournament.uniqueTournament.id.toString(),
          )?.name
        } - ${event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`}`,
        seriesSlug: `/sports/${this.sport}/${event.tournament.uniqueTournament.id}/${event.season.id}`,
      }),
    );

    const fixtures = await mapFixtureRounds(
      allMatches,
      this.leagues,
      this.cardVariant,
    );

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    };
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    const lastMatches = await this.apiEndpoints.fetchTeamLastEvents(teamId, 0);
    const nextMatches = await this.apiEndpoints.fetchTeamNextEvents(teamId, 0);

    if (!lastMatches && !nextMatches) {
      return null;
    }

    const matches = (lastMatches?.events ?? []).concat(
      nextMatches?.events ?? [],
    );

    const allMatches = matches.map((event) =>
      this.eventMapper(event, {
        roundLabel:
          event.tournament.uniqueTournament.name + " " + event.season.year,
        seriesName: event.tournament.name + " " + event.season.year,
        seriesSlug: `/sports/${this.sport}/${event.tournament.uniqueTournament.id}/${event.season.id}`,
      }),
    );

    const fixtures = await mapFixtureRounds(
      allMatches,
      undefined,
      this.cardVariant,
    );

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.ROUND),
    };
  }

  async matchDetails(matchId: string): Promise<MatchDetail | null> {
    const match = await this.apiEndpoints.fetchEventDetails(matchId);
    const incidents = await this.apiEndpoints.fetchEventIncidents(matchId);

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
      matchDetails: matchDetails
        ? this.matchDetailsMapper(matchDetails)
        : {
            awayTeam: { name: "", score: "0" },
            homeTeam: { name: "", score: "0" },
            status: "",
          },
      scoreBreakdown: matchDetails
        ? this.scoreBreakdownMapper(matchDetails)
        : [],
    };
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings<readonly string[]> | null> {
    const standings = await this.apiEndpoints.fetchStandingsTotal(
      leagueId,
      seasonId,
    );

    if (!standings) {
      return null;
    }

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      leagueId,
      seasonId,
    );

    return {
      standings: standings?.standings
        // TODO: How do I want to sort tables??
        .sort(this.standingsSorter)
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

  async brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    const trees = await this.apiEndpoints.fetchCupTrees(leagueId, seasonId);

    if (!trees) {
      return null;
    }

    const tempBrackets = trees.cupTrees.map((tree) => {
      return {
        id: tree.id,
        name: tree.name,
        currentRound: tree.currentRound,
        matches: tree.rounds.flatMap((round, roundIndex) =>
          round.blocks.map(
            (match) =>
              ({
                id: match.blockId,
                nextMatchId: null,
                participants: match.participants.map((team, teamIndex) => ({
                  id: team.team.id,
                  isWinner: team.winner,
                  name: team.team.name,
                  resultText:
                    teamIndex === 0 ? match.homeTeamScore : match.awayTeamScore,
                  status: match.finished ? "PLAYED" : "SCHEDULED",
                })),
                startTime: match.seriesStartDateTimestamp?.toString(),
                tournamentRoundText: (roundIndex + 1).toString(),
                state: match.finished ? "PLAYED" : "SCHEDULED",
                name: "",
                href: `./match/${match?.events?.[0] ?? ""}`,
              }) as BracketMatch,
          ),
        ),
      };
    });

    // Build a lookup map first to avoid O(n²) complexity
    const matchMap = new Map();
    tempBrackets.forEach((bracket) => {
      bracket.matches.forEach((match) => {
        matchMap.set(match.id, match);
      });
    });

    trees.cupTrees.forEach((tree) => {
      tree.rounds.forEach((round) => {
        round.blocks.forEach((match) => {
          match.participants.forEach((team) => {
            if (team.sourceBlockId) {
              const matchToUpdate = matchMap.get(team.sourceBlockId);
              if (matchToUpdate) {
                matchToUpdate.nextMatchId = match.blockId;
              }
            }
          });
        });
      });
    });

    return {
      brackets: tempBrackets,
    };
  }

  protected eventMapper(
    event: Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    const startDate = new Date(0);
    startDate.setUTCSeconds(event.startTimestamp);

    const status =
      event.status.type === "inprogress" || event.status.type === "interrupted"
        ? MatchStatus.LIVE
        : event.status.type === "notstarted"
          ? MatchStatus.UPCOMING
          : MatchStatus.COMPLETED;

    return {
      id: options?.id ?? event.id.toString(),
      startDate: options?.startDate ?? startDate,
      endDate: options?.endDate,
      sport: this.sport,
      status: options?.status ?? status,
      roundLabel: options?.roundLabel ?? `Round ${event.roundInfo?.round}`,
      timer:
        options?.timer ??
        setTimer(
          event.status.type,
          event.status.description,
          options?.startDate ?? startDate,
          event.time.played,
          event.time.periodLength,
        ),
      timerDisplayColour:
        options?.timerDisplayColour ??
        (event.status.type === "inprogress" ||
        event.status.type === "interrupted"
          ? "green"
          : "gray"),
      matchSlug:
        options?.matchSlug ??
        `/sports/${this.sport}/${event.tournament.uniqueTournament.id}/${event.season.id}/match/${event.id}`,
      otherDetail:
        options?.otherDetail ??
        setSeriesInfo(
          event.homeTeam.nameCode,
          event.homeScore.series,
          event.awayTeam.nameCode,
          event.awayScore.series,
        ),
      venue:
        options?.venue ??
        (event?.venue?.name &&
          `${event?.venue?.name}, ${event?.venue?.city.name}`),
      seriesName: options?.seriesName,
      seriesSlug: options?.seriesSlug,
      summaryText:
        options?.summaryText ??
        setMatchSummary(
          event.status.type,
          event.homeTeam.name,
          event.homeScore.current,
          event.awayTeam.name,
          event.awayScore.current,
        ),
      homeDetails: {
        name:
          options?.homeDetails?.name ??
          `${event.homeTeamSeed ? `${event.homeTeamSeed} ` : ""}${shortenTeamNames(event.homeTeam.name)}`,

        score:
          options?.homeDetails?.score ??
          event.homeScore.current?.toString() ??
          "0",
        img:
          options?.homeDetails?.img ?? resolveSportImage(event.homeTeam.name),
        winDrawLoss: options?.homeDetails?.winDrawLoss,
      },
      awayDetails: {
        name:
          options?.awayDetails?.name ??
          `${event.awayTeamSeed ? `${event.awayTeamSeed} ` : ""}${shortenTeamNames(event.awayTeam.name)}`,
        score:
          options?.awayDetails?.score ??
          event.awayScore.current?.toString() ??
          "0",
        img:
          options?.awayDetails?.img ?? resolveSportImage(event.awayTeam.name),
        winDrawLoss: options?.awayDetails?.winDrawLoss,
      },
      seasonId: options?.seasonId ?? event.season.id.toString(),
      tournamentId:
        options?.tournamentId ??
        event.tournament.uniqueTournament.id.toString(),
      winner:
        options?.winner ??
        (event.winnerCode !== 1 && event.winnerCode !== 2
          ? undefined
          : event.winnerCode),
    };
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
          sport: this.sport,

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

  standingsSorter(a: Sofascore_Standing, b: Sofascore_Standing): number {
    return 0;
  }

  protected matchDetailsMapper(matchDetails: Sofascore_Event): {
    homeTeam: TeamScoreDetails;
    awayTeam: TeamScoreDetails;
    status: string;
  } {
    return {
      status: `${matchDetails?.status.description}`,
      homeTeam: {
        name: shortenTeamNames(matchDetails?.homeTeam.name ?? ""),
        score: matchDetails?.homeScore?.current?.toString() ?? "0",
        img: resolveSportImage(matchDetails?.homeTeam.name ?? ""),
      },
      awayTeam: {
        name: shortenTeamNames(matchDetails?.awayTeam.name ?? ""),
        score: matchDetails?.awayScore?.current?.toString() ?? "0",
        img: resolveSportImage(matchDetails?.awayTeam.name ?? ""),
      },
    };
  }

  protected scoreBreakdownMapper(match: Sofascore_Event): PeriodScore[] {
    if (!this.scoreBreakdownConfig) return [];

    const breakdown: PeriodScore[] = this.scoreBreakdownConfig.periodNames.map(
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
      this.scoreBreakdownConfig.overtimeName &&
      match.homeScore?.overtime != undefined
    ) {
      breakdown.push({
        periodName: this.scoreBreakdownConfig.overtimeName,
        teams: {
          home: { score: match.homeScore?.overtime ?? "0" },
          away: { score: match.awayScore?.overtime ?? "0" },
        },
      });
    }

    return breakdown;
  }
}

export function mapSofascoreToStanding(
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
    draws: row.overtimeLosses ?? row.draws ?? 0,
    tiebreakers: {
      pointsFor: row.scoresFor,
      pointsAgainst: row.scoresAgainst,
      pointsDiff: row.scoresFor - row.scoresAgainst,
    },
  };
}
