import {
  fetchCyclingRiderStandings,
  fetchCyclingSubstages,
} from "@/endpoints/cycling.api"
import { CYCLING_TOURS } from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { getSportConfigurations } from "@/lib/projUtils"
import {
  Brackets,
  CardVariant,
  DeepPartial,
  DisplayTypes,
  LadderGroup,
  MatchDetail,
  Matches,
  MatchSummary,
  SPORT,
  Standings,
} from "@/types/misc"
import { Sofascore_Stage } from "@/types/sofascore"
import { TZDate } from "@date-fns/tz/date"
import { isSameDay, isWithinInterval } from "date-fns"
import { SofascoreStageSport } from "./sofascore.service"

class CyclingService extends SofascoreStageSport {
  constructor() {
    super(
      {
        fetchStageRaces: withDevCache(
          "cycling",
          "stage-races",
          fetchCyclingSubstages,
        ),
        fetchStageStandings: withDevCache(
          "cycling",
          "stage-standings",
          fetchCyclingRiderStandings,
        ),
        fetchTeamStandings: withDevCache("cycling", "team-standings", () =>
          Promise.resolve(null),
        ),
      },
      SPORT.CYCLING,
      CYCLING_TOURS,
      CardVariant.SESSION,
    )
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const stageResponse = await this.apiEndpoints.fetchStageRaces(seasonId)
    // const dataverseMatches = await matchSummariesByTournament(
    //   leagueId,
    //   seasonId,
    //   this.sport,
    // )

    if (
      !stageResponse
      // &&
      // (!dataverseMatches || dataverseMatches.length === 0)
    ) {
      return null
    }

    const apiMatches = (stageResponse?.stages ?? [])
      .filter(
        (stage) =>
          stage.info.discipline === "World Tour" ||
          stage.info.discipline === "World Tour 1 Grand Tour" ||
          stage.info.stageRound,
      )
      .flatMap((stage) =>
        this.eventMapper(stage, {
          leagueId,
          leagueSlug: `/sports/cycling/${leagueId}/${seasonId}`,
          seasonId,
          matchSlug: `/sports/cycling/${leagueId}/${seasonId}/match/${stage.id}`,
          roundLabel: isNaN(Number(leagueId)) ? "Stages" : "Races",
        }),
      )

    // Merge API and dataverse matches, deduplicating by id (API takes priority)
    // const apiIds = new Set(apiMatches.map((m) => m.id))

    const allMatches = apiMatches
      // .concat((dataverseMatches ?? []).filter((m) => !apiIds.has(m.id)))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )

    if (!allMatches) return null

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
    const menLeague = this.leagues.filter((league) => league.slug === "9")
    const womenLeague = this.leagues.filter((league) => league.slug === "94")

    const [menRaces, womenRaces] = await Promise.all([
      this.apiEndpoints.fetchStageRaces(menLeague[0].seasons[0].slug),
      this.apiEndpoints.fetchStageRaces(womenLeague[0].seasons[0].slug),
    ])
    // const [dataverseMatches] = await Promise.all([
    //   matchSummariesBySportAndDay(this.sport, date),
    // ])

    if (
      !menRaces &&
      !womenRaces
      // &&
      // (!dataverseMatches || dataverseMatches.length === 0)
    ) {
      return null
    }

    const timezone = date instanceof TZDate ? date.timeZone : "UTC"

    const apiMatches = this.processByDateEvents(
      menRaces?.stages ?? [],
      date,
      timezone,
      menLeague[0].slug,
      menLeague[0].seasons[0].slug,
    ).concat(
      this.processByDateEvents(
        womenRaces?.stages ?? [],
        date,
        timezone,
        womenLeague[0].slug,
        womenLeague[0].seasons[0].slug,
      ),
    )

    // Merge API and dataverse matches, deduplicating by id (API takes priority)
    // const apiIds = new Set(apiMatches.map((m) => m.id))
    const allMatches = apiMatches
      // .concat((dataverseMatches ?? []).filter((m) => !apiIds.has(m.id)))
      // .map((match) => this.eventMapperMatchSummary(match))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )

    if (!allMatches || allMatches.length === 0) return null

    const fixtures = await mapFixtureRounds(allMatches, this.leagues)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    } as Matches
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    return null
  }

  async matchDetails(
    matchId: string,
    leagueId: string,
    seasonId: string,
  ): Promise<MatchDetail | null> {
    return await super.matchDetails(matchId, leagueId, seasonId)
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    const stageStandings = await this.apiEndpoints.fetchStageStandings(seasonId)
    const teamStandings = await this.apiEndpoints.fetchTeamStandings(seasonId)

    if (!stageStandings && !teamStandings) return null

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      leagueId,
      seasonId,
    )

    const standingsMapped: LadderGroup[] = []

    if (teamStandings) {
      const teamStandingsMapped = this.standingsMapper(
        teamStandings.standings,
        ladderConfig?.ladderGroup.find((group) => group.label === "Team"),
        "Team",
      )
      standingsMapped.push(teamStandingsMapped)
    }

    // Filter different jersey types from standingresults
    if (stageStandings) {
      const overallStandings = this.standingsMapper(
        stageStandings.standings,
        ladderConfig?.ladderGroup.find((group) => group.label === "Overall"),
        "Overall",
      )

      const mountainStandings = this.standingsMapper(
        stageStandings.standings
          .filter((row) => row.climbPosition !== undefined)
          .map((row) => ({
            ...row,
            points: row.climb,
            position: row.climbPosition,
          }))
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        ladderConfig?.ladderGroup.find((group) => group.label === "Mountain"),
        "Mountain",
      )
      const sprintStandings = this.standingsMapper(
        stageStandings.standings
          .filter((row) => row.sprintPosition !== undefined)
          .map((row) => ({
            ...row,
            points: row.sprint,
            position: row.sprintPosition,
          }))
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        ladderConfig?.ladderGroup.find((group) => group.label === "Sprint"),
        "Sprint",
      )
      const youngRiderStandings = this.standingsMapper(
        stageStandings.standings
          .filter((row) => row.youngRiderPosition !== undefined)
          .map((row) => ({
            ...row,
            gap: row.youngRider,
            position: row.youngRiderPosition,
          }))
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        ladderConfig?.ladderGroup.find(
          (group) => group.label === "Young (U26)",
        ),
        "Young (U26)",
      )

      standingsMapped.push(
        ...[overallStandings],
        ...[mountainStandings],
        ...[sprintStandings],
        ...[youngRiderStandings],
      )
    }

    return {
      standings: standingsMapped.filter(
        (item) =>
          item.tables.filter((table) => table.data.length !== 0).length !== 0,
      ),
    }
  }

  async brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    return null
  }

  async matchesFromAPI(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    return super.matchesByLeagueSeason(leagueId, seasonId)
  }

  override eventMapper(
    event: Sofascore_Stage,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    let stageIcon = ""
    switch (event.info.stageType) {
      case "highmountain":
        stageIcon = "🏔️"
        break
      case "intermediate":
        stageIcon = "⛰️"
        break
      case "timetrial":
        stageIcon = "⏱️"
        break
      case "flat":
        stageIcon = "🛣️"
        break
      default:
        stageIcon = "🚲"
    }

    return super.eventMapper(event, {
      roundLabel: "Stages",
      summaryText: event.info.raceDistance
        ? `${stageIcon} | ${(event.info.raceDistance ?? 0) / 1000} km`
        : "Details",
      leagueName: event.info.departureCity
        ? `${event.name} - ${event.info.departureCity} -> ${event.info.arrivalCity}`
        : event.name,
      ...options,
    })
  }

  processByDateEvents(
    events: Sofascore_Stage[],
    date: Date,
    timezone: string = "UTC",
    leagueId: string,
    seasonId: string,
  ) {
    return events
      .filter(
        (stage) =>
          stage.info.discipline === "World Tour" ||
          stage.info.discipline === "World Tour 1 Grand Tour" ||
          stage.info.stageRound,
      )
      .filter((item) => {
        const startDate = new TZDate(item.startDateTimestamp * 1000, timezone)
        const endDate = new TZDate(item.endDateTimestamp * 1000, timezone)
        return (
          isWithinInterval(date, { start: startDate, end: endDate }) ||
          isSameDay(date, startDate) ||
          isSameDay(date, endDate)
        )
      })
      .map((stage) =>
        this.eventMapper(stage, {
          leagueId: leagueId,
          leagueSlug: `/sports/cycling/${leagueId}/${seasonId}`,
          leagueName: stage.name,
          summaryText: "Details",
          seasonId: seasonId,
          matchSlug: `/sports/cycling/${leagueId}/${seasonId}/match/${stage.id}`,
        }),
      )
  }
}

export const cyclingService = new CyclingService()
