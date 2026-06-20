import { Match as BracketMatch } from "@/components/bracket/types"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { resolveSportImage } from "@/lib/imageMapping"
import { resolvePlayoffPicture } from "@/lib/playoffPictureMapping"
import {
  getSportConfigurations,
  setMatchSummary,
  setSeriesInfo,
  setTimer,
  shortenTeamNames,
} from "@/lib/projUtils"
import {
  Brackets,
  CardVariant,
  DeepPartial,
  DisplayTypes,
  FixtureRound,
  LadderConfig,
  LadderGroup,
  LadderGroupConfig,
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
} from "@/types/misc"
import { PlayoffPictureStanding } from "@/types/playoff-picture"
import {
  PeriodKey,
  Sofascore_Event,
  Sofascore_Stage,
  Sofascore_StageStandingRow,
  Sofascore_Standing,
  Sofascore_StandingRow,
  Sofascore_TotalStandings_Response,
  SofascoreAPI,
  SofascoreStagesAPI,
} from "@/types/sofascore"
import { TZDate } from "@date-fns/tz/date"
import { addHours, isSameDay } from "date-fns"
import { matchSummariesByTournament } from "./dataverse.service"

export type ScoreBreakdownConfig = {
  periodNames: string[]
  overtimeName?: string
}

export abstract class SofascoreSport implements SportService {
  protected apiEndpoints: SofascoreAPI
  protected sport: SPORT
  protected leagues: LeagueSeasonConfig[]
  protected headings: string[]
  protected scoreBreakdownConfig?: ScoreBreakdownConfig
  protected cardVariant?: CardVariant

  constructor(
    apiEndpoints: SofascoreAPI,
    sport: SPORT,
    leagues: LeagueSeasonConfig[],
    headings: string[],
    scoreBreakdownConfig?: ScoreBreakdownConfig,
    cardVariant?: CardVariant,
  ) {
    this.apiEndpoints = apiEndpoints
    this.sport = sport
    this.leagues = leagues
    this.headings = headings
    this.scoreBreakdownConfig = scoreBreakdownConfig
    this.cardVariant = cardVariant
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const [lastMatches, nextMatches, dataverseMatches] = await Promise.all([
      this.apiEndpoints.fetchLastEvents(leagueId, seasonId, 0),
      this.apiEndpoints.fetchNextEvents(leagueId, seasonId, 0),
      matchSummariesByTournament(leagueId, seasonId, this.sport),
    ])

    if (
      !lastMatches &&
      !nextMatches &&
      (!dataverseMatches || dataverseMatches.length === 0)
    ) {
      return null
    }

    const apiMatches = (lastMatches?.events ?? [])
      .concat(nextMatches?.events ?? [])
      .filter((event) => event.status.type !== "canceled")
      .map((event) => this.eventMapper(event))

    // Merge API and dataverse matches, deduplicating by id (API takes priority)
    const apiIds = new Set(apiMatches.map((m) => m.id))

    const allMatches = apiMatches
      .concat((dataverseMatches ?? []).filter((m) => !apiIds.has(m.id)))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )

    const { leagueConfig } = getSportConfigurations(
      this.leagues,
      leagueId,
      seasonId,
    )

    const fixtures = await mapFixtureRounds(allMatches, leagueConfig)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const matches = await this.apiEndpoints.fetchEventsByDate(date)

    if (!matches) return null

    const validLeagueIds = this.leagues
      .filter((l) => !l.excludeFromToday)
      .map((l) => Number(l.slug))
    const timezone = date instanceof TZDate ? date.timeZone : "UTC"

    matches.events = matches.events
      .filter((item) => {
        const eventDate = new TZDate(item.startTimestamp * 1000, timezone)
        return isSameDay(eventDate, date)
      })
      .filter(
        (item) =>
          validLeagueIds.includes(item.tournament.uniqueTournament.id) &&
          item.status.type !== "canceled",
      )

    if (!matches.events || matches.events.length === 0) return null

    const allMatches = matches.events
      .map((event) =>
        this.eventMapper(event, {
          leagueName:
            `${
              this.leagues.find(
                (l) =>
                  l.slug === event.tournament.uniqueTournament.id.toString(),
              )?.name
            }` +
            (event.roundInfo?.name || event.roundInfo?.round
              ? ` - ${event.roundInfo?.name ?? `Round ${event.roundInfo?.round ?? "x"}`}`
              : ""),
          leagueSlug: `/sports/${this.sport}/${event.tournament.uniqueTournament.id}/${event.season.id}`,
        }),
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )

    const fixtures = await mapFixtureRounds(allMatches, this.leagues)
    const myTeams: FixtureRound = {
      matches: allMatches.filter((match) =>
        match.competitorDetails.some((team) =>
          this.leagues.some((l) => l.slug === `team/${team.id}`),
        ),
      ),
      roundLabel: "My Teams",
    }

    return {
      fixtures: [myTeams, ...fixtures],
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    const lastMatches = await this.apiEndpoints.fetchTeamLastEvents(teamId, 0)
    const nextMatches = await this.apiEndpoints.fetchTeamNextEvents(teamId, 0)

    if (!lastMatches && !nextMatches) {
      return null
    }

    const matches = (lastMatches?.events ?? []).concat(
      nextMatches?.events ?? [],
    )

    const allMatches = matches
      .filter((event) => event.status.type !== "canceled")
      .map((event) =>
        this.eventMapper(event, {
          roundLabel:
            event.tournament.uniqueTournament.name + " " + event.season.year,
          leagueName: event.tournament.name + " " + event.season.year,
          leagueSlug: `/sports/${this.sport}/${event.tournament.uniqueTournament.id}/${event.season.id}`,
        }),
      )

    const fixtures = await mapFixtureRounds(allMatches, undefined)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.ROUND),
    }
  }

  async matchDetails(matchId: string): Promise<MatchDetail | null> {
    const match = await this.apiEndpoints.fetchEventDetails(matchId)
    const incidents = await this.apiEndpoints.fetchEventIncidents(matchId)

    const matchDetails = match?.event
    const scoreIncidents = incidents?.incidents
      ? incidents?.incidents
          .filter((item) => item.incidentType === "goal")
          .toReversed()
      : null

    return {
      scoreEvents: !scoreIncidents
        ? undefined
        : scoreIncidents.map((item) => {
            return {
              event: item.incidentClass ?? "",
              difference: (item.homeScore ?? 0) - (item.awayScore ?? 0),
            }
          }),
      matchDetails: matchDetails
        ? this.matchDetailsMapper(matchDetails)
        : {
            awayTeam: { id: "", name: "", score: "0" },
            homeTeam: { id: "", name: "", score: "0" },
            status: "",
          },
      scoreBreakdown: matchDetails
        ? this.scoreBreakdownMapper(matchDetails)
        : [],
    }
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    const standings = await this.apiEndpoints.fetchStandingsTotal(
      leagueId,
      seasonId,
    )

    if (!standings) {
      return null
    }

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      leagueId,
      seasonId,
    )

    return {
      standings: this.standingsStructureMap(standings, ladderConfig),

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
    }
  }

  async brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    const trees = await this.apiEndpoints.fetchCupTrees(leagueId, seasonId)

    if (!trees) {
      return null
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
      }
    })

    // Build a lookup map first to avoid O(n²) complexity
    const matchMap = new Map()
    tempBrackets.forEach((bracket) => {
      bracket.matches.forEach((match) => {
        matchMap.set(match.id, match)
      })
    })

    trees.cupTrees.forEach((tree) => {
      tree.rounds.forEach((round) => {
        round.blocks.forEach((match) => {
          match.participants.forEach((team) => {
            if (team.sourceBlockId) {
              const matchToUpdate = matchMap.get(team.sourceBlockId)
              if (matchToUpdate) {
                matchToUpdate.nextMatchId = match.blockId
              }
            }
          })
        })
      })
    })

    return {
      brackets: tempBrackets,
    }
  }

  eventMapper(
    event: Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    const startDate = new Date(0)
    const endDate = new Date(0)
    startDate.setUTCSeconds(event.startTimestamp)
    endDate.setUTCSeconds(event?.endTimestamp ?? 0)

    const status =
      event.status.type === "inprogress" || event.status.type === "interrupted"
        ? MatchStatus.LIVE
        : event.status.type === "notstarted"
          ? MatchStatus.UPCOMING
          : MatchStatus.COMPLETED

    return {
      id: options?.id ?? event.id.toString(),
      startDate: options?.startDate ?? startDate,
      endDate:
        options?.endDate ??
        (event?.endTimestamp && !isSameDay(startDate, endDate)
          ? endDate
          : undefined),
      sport: this.sport,
      status: options?.status ?? status,
      roundLabel:
        options?.roundLabel ??
        event.roundInfo?.name ??
        `Round ${event.roundInfo?.round ?? "x"}`,
      summaryText:
        options?.summaryText ??
        setMatchSummary(
          event.status.type,
          event.homeTeam.name,
          event.homeScore.current,
          event.awayTeam.name,
          event.awayScore.current,
        ),
      timer:
        options?.timer ??
        setTimer(
          event.status.type,
          event.status.description,
          options?.startDate ?? startDate,
          event.time?.played ?? 0,
          event.time?.periodLength ?? 0,
        ),
      timerDisplayColour:
        options?.timerDisplayColour ??
        (event.status.type === "inprogress" ||
        event.status.type === "interrupted"
          ? "green"
          : "gray"),
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
      matchSlug:
        options?.matchSlug ??
        `/sports/${this.sport}/${event.tournament.uniqueTournament.id}/${event.season.id}/match/${event.id}`,
      seasonId: options?.seasonId ?? event.season.id.toString(),
      leagueId:
        options?.leagueId ?? event.tournament.uniqueTournament.id.toString(),
      leagueName: options?.leagueName,
      leagueSlug: options?.leagueSlug,
      leagueImg: options?.leagueImg ?? resolveSportImage(""),
      competitorDetails: [
        {
          id:
            options?.competitorDetails?.[0]?.id ?? event.homeTeam.id.toString(),
          name:
            options?.competitorDetails?.[0]?.name ??
            `${event.homeTeamSeed ? `${event.homeTeamSeed} ` : ""}${shortenTeamNames(event.homeTeam.name)}`,
          score:
            options?.competitorDetails?.[0]?.score ??
            event.homeScore.current?.toString() ??
            "0",
          img:
            options?.competitorDetails?.[0]?.img ??
            resolveSportImage(event.homeTeam.name),
          winDrawLoss: options?.competitorDetails?.[0]?.winDrawLoss,
          slug:
            options?.competitorDetails?.[0]?.slug ??
            `/sports/${this.sport}/team/${event.homeTeam.id}`,
        },
        {
          id:
            options?.competitorDetails?.[1]?.id ?? event.awayTeam.id.toString(),
          name:
            options?.competitorDetails?.[1]?.name ??
            `${event.awayTeamSeed ? `${event.awayTeamSeed} ` : ""}${shortenTeamNames(event.awayTeam.name)}`,
          score:
            options?.competitorDetails?.[1]?.score ??
            event.awayScore.current?.toString() ??
            "0",
          img:
            options?.competitorDetails?.[1]?.img ??
            resolveSportImage(event.awayTeam.name),
          winDrawLoss: options?.competitorDetails?.[1]?.winDrawLoss,
          slug:
            options?.competitorDetails?.[1]?.slug ??
            `/sports/${this.sport}/team/${event.awayTeam.id}`,
        },
      ],
      winner:
        options?.winner ??
        (event.winnerCode !== 1 && event.winnerCode !== 2
          ? undefined
          : event.winnerCode),
      cardVariant:
        options?.cardVariant ?? this.cardVariant ?? CardVariant.DEFAULT,
    }
  }

  standingsStructureMap(
    standings: Sofascore_TotalStandings_Response,
    config?: LadderConfig,
  ): LadderGroup[] {
    if (config) {
      return config?.ladderGroup.map((group) => ({
        tables: standings?.standings
          .filter((table) =>
            group.groupFilter ? group.groupFilter(table.name) : true,
          )
          .map((table) =>
            this.standingsMapper(
              table,
              group?.headings,
              group?.placingCategories,
            ),
          ),
        label: group?.label ?? "All",
      }))
    }
    return [
      {
        tables: standings?.standings.map((table) =>
          this.standingsMapper(
            table,
            this.headings,
            // this.placingCategories,
          ),
        ),
      },
    ]
  }

  protected standingsMapper(
    table: Sofascore_Standing,
    headings?: string[],
    placingCategories?: LadderPlacingCategory[],
  ): SportsLadder {
    return {
      tableName: table.name,
      headings: headings ?? this.headings,
      data: table.rows.map((item) => {
        const pointDifferential =
          (item.scoresFor ?? 0) - (item.scoresAgainst ?? 0)
        return {
          position: item.position,
          teamId: item.team.id.toString(),
          teamName: shortenTeamNames(item.team.name),
          teamLogo: resolveSportImage(item.team.name),
          sport: this.sport,

          Pts: item.points,
          P: item.matches,
          W: item.wins,
          OTL: item.overtimeLosses,
          L: item.losses,
          D: item.draws,
          F: item.scoresFor,
          A: item.scoresAgainst,
          Diff:
            pointDifferential > 0 ? `+${pointDifferential}` : pointDifferential,
          PCT: item.percentage,
          "%": item.scoresAgainst
            ? Math.round((item.scoresFor / item.scoresAgainst) * 100)
            : 0,
          BP: (item.points ?? 0) - item.wins * 4 - (item.draws ?? 0) * 2,
        }
      }),
      placingCategories,
    }
  }

  protected matchDetailsMapper(matchDetails: Sofascore_Event): {
    homeTeam: TeamScoreDetails
    awayTeam: TeamScoreDetails
    status: string
  } {
    return {
      status: `${matchDetails?.status.description}`,
      homeTeam: {
        id: matchDetails?.homeTeam.id?.toString() ?? "",
        name: shortenTeamNames(matchDetails?.homeTeam.name ?? ""),
        score: matchDetails?.homeScore?.current?.toString() ?? "0",
        img: resolveSportImage(matchDetails?.homeTeam.name ?? ""),
      },
      awayTeam: {
        id: matchDetails?.awayTeam.id?.toString() ?? "",
        name: shortenTeamNames(matchDetails?.awayTeam.name ?? ""),
        score: matchDetails?.awayScore?.current?.toString() ?? "0",
        img: resolveSportImage(matchDetails?.awayTeam.name ?? ""),
      },
    }
  }

  protected scoreBreakdownMapper(match: Sofascore_Event): PeriodScore[] {
    if (!this.scoreBreakdownConfig) return []

    const breakdown: PeriodScore[] = this.scoreBreakdownConfig.periodNames.map(
      (name, i) => {
        const periodKey = `period${i + 1}` as PeriodKey
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
        }
      },
    )

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
      })
    }

    return breakdown
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
  }
}

const DEFAULT_LADDER_CONFIG: LadderGroupConfig = {
  label: "Overall",
  headings: ["", "Gap", "Pts"],
}

export abstract class SofascoreStageSport implements SportService {
  protected apiEndpoints: SofascoreStagesAPI
  protected sport: SPORT
  protected leagues: LeagueSeasonConfig[]
  protected cardVariant?: CardVariant

  constructor(
    apiEndpoints: SofascoreStagesAPI,
    sport: SPORT,
    leagues: LeagueSeasonConfig[],
    cardVariant?: CardVariant,
  ) {
    this.apiEndpoints = apiEndpoints
    this.sport = sport
    this.leagues = leagues
    this.cardVariant = cardVariant
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const stageResponse = await this.apiEndpoints.fetchStageRaces(seasonId)

    const allSessions: MatchSummary[] = []
    let i = 1
    for (const { id, name } of stageResponse?.stages ?? []) {
      // if (name.includes("Test")) continue

      const raceSessions = await this.apiEndpoints.fetchStageRaces(
        id.toString(),
      )

      allSessions.push(
        ...(raceSessions?.stages ?? []).flatMap((stage) =>
          this.eventMapper(stage, {
            seasonId,
            roundLabel: `Round ${i}`,
            matchSlug: `/sports/motorsport/${leagueId}/${seasonId}/match/${stage.id}`,
            leagueName: name,
          }),
        ),
      )
      i++
    }

    const { leagueConfig } = getSportConfigurations(
      this.leagues,
      leagueId,
      seasonId,
    )

    const fixtures = await mapFixtureRounds(allSessions, leagueConfig)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    return null
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    return null
  }

  async matchDetails(
    matchId: string,
    leagueId: string,
    seasonId: string,
  ): Promise<MatchDetail | null> {
    const stageStandings = await this.apiEndpoints.fetchStageStandings(matchId)

    if (!stageStandings) return null

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      leagueId,
      seasonId,
    )

    const tableConfig = ladderConfig?.ladderGroup.find(
      (label) => label.label === "Session",
    )

    return {
      standings: [this.standingsMapper(stageStandings.standings, tableConfig)],
    }
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    return null
  }

  async brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    return null
  }

  eventMapper(
    event: Sofascore_Stage,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    const startDate = new Date(0)
    const endDate = new Date(0)
    startDate.setUTCSeconds(event.startDateTimestamp)
    endDate.setUTCSeconds(event?.endDateTimestamp ?? 0)

    const status =
      event.status.type === "inprogress" || event.status.type === "interrupted"
        ? MatchStatus.LIVE
        : event.status.type === "notstarted" || event.status.type === ""
          ? MatchStatus.UPCOMING
          : MatchStatus.COMPLETED

    return {
      id: options?.id ?? event.id.toString(),
      startDate: options?.startDate ?? startDate,
      endDate:
        options?.endDate ??
        (event?.endDateTimestamp && !isSameDay(startDate, endDate)
          ? endDate
          : undefined),
      sport: this.sport,
      status: options?.status ?? status,
      roundLabel: options?.roundLabel,
      summaryText: options?.summaryText ?? event.name,
      timer:
        (options?.timer ?? status === MatchStatus.UPCOMING)
          ? startDate
          : status.charAt(0) + status.slice(1).toLowerCase(),
      timerDisplayColour:
        options?.timerDisplayColour ??
        (event.status.type === "inprogress" ||
        event.status.type === "interrupted"
          ? "green"
          : "gray"),
      otherDetail: options?.otherDetail,
      venue: options?.venue,
      matchSlug: options?.matchSlug,
      seasonId: options?.seasonId ?? event.stageParent.id.toString(),
      leagueId: options?.leagueId ?? event.uniqueStage.id.toString(),
      leagueName: options?.leagueName ?? event.stageParent.description,
      leagueSlug:
        options?.leagueSlug ??
        `/sports/${this.sport}/${event.uniqueStage.id}/${event.stageParent.id}`,
      leagueImg:
        options?.leagueImg ??
        resolveSportImage(event.country?.name ?? event.name),
      competitorDetails: event?.winner
        ? [
            {
              id:
                options?.competitorDetails?.[0]?.id ??
                event.winner.id.toString(),
              name: options?.competitorDetails?.[0]?.name ?? event.winner.name,
              score: options?.competitorDetails?.[0]?.score ?? "",
              img:
                options?.competitorDetails?.[0]?.img ??
                resolveSportImage(event.winner.country.name ?? ""),
              winDrawLoss: options?.competitorDetails?.[0]?.winDrawLoss,
              slug:
                options?.competitorDetails?.[0]?.slug ??
                `/sports/${this.sport}/team/${event.winner.id}`,
            },
          ]
        : [],
      winner: options?.winner ?? 1,
      cardVariant:
        options?.cardVariant ?? this.cardVariant ?? CardVariant.DEFAULT,
    }
  }

  matchSummaryMapper(
    event: MatchSummary,
    options?: DeepPartial<Omit<MatchSummary, "competitorDetails">>,
  ): MatchSummary {
    let currentDate = new Date()

    const status =
      event.startDate > currentDate
        ? MatchStatus.UPCOMING
        : event.startDate > addHours(currentDate, -2) ||
            (event.endDate && event.endDate > currentDate)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
    return {
      ...event,
      ...options,
      status,
      leagueImg: event.leagueImg ?? resolveSportImage(event.leagueName ?? ""),
      timer:
        status === MatchStatus.UPCOMING
          ? event.startDate
          : status.charAt(0) + status.slice(1).toLowerCase(),
      timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
      cardVariant: event.cardVariant ?? CardVariant.SESSION,
    }
  }

  protected standingsMapper(
    table: Sofascore_StageStandingRow[],
    config?: LadderGroupConfig,
    label?: string,
  ): LadderGroup {
    return {
      label: config?.label ?? label ?? "Session",
      tables: [
        {
          headings: config?.headings ?? ["", "Gap"],
          data: table.map((item) => {
            return {
              position: item.position ?? "-",
              teamId: item.team?.id?.toString() ?? "",
              teamName: shortenTeamNames(item.team?.name ?? ""),
              teamLogo: resolveSportImage(
                item.team?.country?.name ?? item.team?.name ?? "",
              ),
              sport: this.sport,

              Pts: item.points,
              Wins: item.victories,
              Podiums: item.podiums,
              Gap:
                item.gap ??
                item.time ??
                (item.lapsBehind ? `+${item.lapsBehind} Laps` : "-"),
              Time: item.time,
              Grid: item.gridPosition,
            }
          }),
          placingCategories: config?.placingCategories,
        },
      ],
    }
  }
}
