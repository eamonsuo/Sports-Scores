import {
  fetchCyclingRiderStandings,
  fetchCyclingSubstages,
} from "@/endpoints/cycling.api"
import { withDevCache } from "@/lib/devCache"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { getSportConfigurations } from "@/lib/projUtils"
import {
  Brackets,
  CardVariant,
  DeepPartial,
  LadderGroup,
  Matches,
  MatchSummary,
  SPORT,
  Standings,
  TVConfig,
} from "@/types/misc"
import { Sofascore_Stage } from "@/types/sofascore"
import {
  ladderConfigByLeagueBySeason,
  leaguesBySportByLeague,
} from "./dataverse.service"
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
      CardVariant.SESSION,
    )
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const [stageResponse, leagues] = await Promise.all([
      this.apiEndpoints.fetchStageRaces(seasonId),
      leaguesBySportByLeague(this.sport, leagueId),
    ])

    if (!stageResponse) {
      return null
    }

    const { leagueConfig } = getSportConfigurations(leagues, leagueId, seasonId)

    const apiMatches = (stageResponse?.stages ?? [])
      .filter((stage) => stage.info.discipline?.includes("World Tour"))
      .flatMap((stage) =>
        this.eventMapper(
          stage,
          {
            leagueId,
            leagueSlug: `/sports/cycling/${leagueId}/${seasonId}`,
            seasonId,
            matchSlug: `/sports/cycling/${leagueId}/${seasonId}/match/${stage.id}`,
            roundLabel: isNaN(Number(leagueId)) ? "Stages" : "Races",
          },
          undefined,
        ),
      )

    const allMatches = apiMatches.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )

    if (!allMatches) return null

    const fixtures = await mapFixtureRounds(allMatches, leagueConfig)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    return null
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    const [stageStandings, teamStandings, ladderConfig] = await Promise.all([
      this.apiEndpoints.fetchStageStandings(seasonId),
      this.apiEndpoints.fetchTeamStandings(seasonId),
      ladderConfigByLeagueBySeason(leagueId, seasonId),
    ])

    if (!stageStandings && !teamStandings) return null

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

  override eventMapper(
    event: Sofascore_Stage,
    options?: DeepPartial<MatchSummary>,
    tvConfig?: TVConfig,
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

    return super.eventMapper(
      event,
      {
        roundLabel: "Stages",
        summaryText: event.info.raceDistance
          ? `${stageIcon} | ${(event.info.raceDistance ?? 0) / 1000} km`
          : "Details",
        leagueName: event.info.departureCity
          ? `${event.name} - ${event.info.departureCity} -> ${event.info.arrivalCity}`
          : event.name,
        ...options,
      },
      tvConfig,
    )
  }
}

export const cyclingService = new CyclingService()
