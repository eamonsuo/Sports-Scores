import {
  fetchF1ConstructorStandings,
  fetchF1DriverDetails,
  fetchF1DriverStandings,
  fetchF1Events,
  fetchF1Meetings,
  fetchF1Positions,
  fetchF1QualifyingResult,
  fetchF1RaceResult,
  fetchF1Sessions,
  fetchF1SprintResult,
} from "@/endpoints/f1.api"
import {
  MOTORSPORT_CATEGORIES,
  MOTORSPORT_CONSTRUCTOR_STANDINGS_HEADINGS,
  MOTORSPORT_DRIVER_STANDINGS_HEADINGS,
  MOTORSPORT_SESSION_STANDINGS_HEADINGS,
} from "@/lib/constants"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { resolveSportImage } from "@/lib/imageMapping"
import { getSportConfigurations } from "@/lib/projUtils"
import { F1SessionType, Jolpica_Race } from "@/types/f1"
import {
  Brackets,
  CardVariant,
  DeepPartial,
  DisplayTypes,
  LadderRow,
  LeagueSeasonConfig,
  MatchDetail,
  Matches,
  MatchStatus,
  MatchSummary,
  SPORT,
  SportService,
  Standings,
} from "@/types/misc"
import { isSameDay } from "date-fns"
import { addHours } from "date-fns/addHours"
import { TZDate } from "react-day-picker"

class F1Service implements SportService {
  protected sport: SPORT
  protected categories: LeagueSeasonConfig[]
  protected cardVariant?: CardVariant

  constructor() {
    this.sport = SPORT.MOTORSPORT
    this.categories = MOTORSPORT_CATEGORIES
    this.cardVariant = CardVariant.SESSION
  }

  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    const rawEvents = await fetchF1Events(seasonId)

    if (!rawEvents) {
      return null
    }

    const allEvents = rawEvents
      ?.flatMap((race) => mapRaceToMatchSummaries(race))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    const { leagueConfig } = getSportConfigurations(
      this.categories,
      leagueId,
      seasonId,
    )

    const fixtures = await mapFixtureRounds(allEvents, leagueConfig)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    }
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const rawEvents = await fetchF1Events(date.getFullYear())

    if (!rawEvents) {
      return null
    }

    const timezone = date instanceof TZDate ? date.timeZone : "UTC"

    const filteredEvents = rawEvents
      .flatMap((race) => mapRaceToMatchSummaries(race))
      .filter((item) => {
        const eventDate = new TZDate(item.startDate, timezone)
        return isSameDay(eventDate, date)
      })

    if (!filteredEvents || filteredEvents.length === 0) return null

    const fixtures = await mapFixtureRounds(filteredEvents, this.categories)

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }

  async matchesByTeam(teamId: string): Promise<Matches | null> {
    return null
  }
  async matchDetails(matchId: string): Promise<MatchDetail | null> {
    return null
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

  async sessionResults(
    season: string,
    round: string,
    sessionType: F1SessionType,
  ): Promise<Standings | null> {
    let raceResult: LadderRow[]

    switch (sessionType) {
      case F1SessionType.Practice1:
      case F1SessionType.Practice2:
      case F1SessionType.Practice3:
      case F1SessionType.SprintQualifying: {
        const result = await fetchOpenF1SessionResult(
          season,
          round,
          sessionType,
        )
        if (!result) return null
        raceResult = result
        break
      }
      case F1SessionType.Sprint: {
        const rawSession = await fetchF1SprintResult(season, round)
        if (!rawSession) return null
        raceResult = mapJolpicaRaceResults(
          rawSession[0].SprintResults,
          rawSession[0].SprintResults[0].laps,
        )
        break
      }
      case F1SessionType.Qualifying: {
        const rawSession = await fetchF1QualifyingResult(season, round)
        if (!rawSession) return null
        raceResult = mapJolpicaQualifyingResults(
          rawSession[0].QualifyingResults,
        )
        break
      }
      case F1SessionType.Race: {
        const rawSession = await fetchF1RaceResult(season, round)
        if (!rawSession) return null
        raceResult = mapJolpicaRaceResults(
          rawSession[0].Results,
          rawSession[0].Results[0].laps,
        )
        break
      }
      default:
        return null
    }

    return {
      standings: [
        {
          tables: [
            {
              headings: MOTORSPORT_SESSION_STANDINGS_HEADINGS,
              data: raceResult,
            },
          ],
        },
      ],
    }
  }

  async standingsDrivers(season: string): Promise<Standings | null> {
    const rawStandings = await fetchF1DriverStandings(season)

    if (!rawStandings) {
      return null
    }

    return {
      standings: [
        {
          tables: [
            {
              headings: MOTORSPORT_DRIVER_STANDINGS_HEADINGS,
              data: rawStandings.map((item, index) => {
                return {
                  position: Number(item.position) ?? index + 1,
                  teamId: item.Driver.permanentNumber,
                  teamName:
                    item.Driver.givenName + " " + item.Driver.familyName,
                  teamLogo: [
                    resolveSportImage(
                      item.Driver.givenName + " " + item.Driver.familyName,
                    ),
                    resolveSportImage(item.Constructors[0].name),
                  ],

                  Pts: item.points,
                  Wins: item.wins,
                }
              }),
            },
          ],
        },
      ],
    }
  }

  async standingsConstructor(season: string): Promise<Standings | null> {
    const rawStandings = await fetchF1ConstructorStandings(season)

    if (!rawStandings) {
      return null
    }

    return {
      standings: [
        {
          tables: [
            {
              headings: MOTORSPORT_CONSTRUCTOR_STANDINGS_HEADINGS,
              data: rawStandings.map((item, index) => {
                return {
                  position: Number(item.position) ?? index + 1,
                  teamId: item.Constructor.constructorId,
                  teamName: item.Constructor.name,
                  teamLogo: resolveSportImage(item.Constructor.name),
                  Pts: item.points,
                }
              }),
            },
          ],
        },
      ],
    }
  }
}

export function mapRaceToMatchSummaries(session: Jolpica_Race) {
  let startDate: Date
  let sessions: MatchSummary[] = []

  if (session.FirstPractice) {
    startDate = new Date(
      session.FirstPractice.date + "T" + session.FirstPractice.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Practice1, startDate),
    )
  }
  if (session.SecondPractice) {
    startDate = new Date(
      session.SecondPractice.date + "T" + session.SecondPractice.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Practice2, startDate),
    )
  }
  if (session.ThirdPractice) {
    startDate = new Date(
      session.ThirdPractice.date + "T" + session.ThirdPractice.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Practice3, startDate),
    )
  }
  if (session.Qualifying) {
    startDate = new Date(
      session.Qualifying.date + "T" + session.Qualifying.time,
    )
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Qualifying, startDate),
    )
  }
  if (session.Sprint) {
    startDate = new Date(session.Sprint.date + "T" + session.Sprint.time)
    sessions.push(
      mapSessionToMatchSummary(session, F1SessionType.Sprint, startDate),
    )
  }
  if (session.SprintQualifying) {
    startDate = new Date(
      session.SprintQualifying.date + "T" + session.SprintQualifying.time,
    )
    sessions.push(
      mapSessionToMatchSummary(
        session,
        F1SessionType.SprintQualifying,
        startDate,
      ),
    )
  }
  startDate = new Date(session.date + "T" + session.time)
  sessions.push(
    mapSessionToMatchSummary(session, F1SessionType.Race, startDate),
  )

  return sessions
}

function mapSessionToMatchSummary(
  session: Jolpica_Race,
  sessionType: F1SessionType,
  startDate: Date,
  options?: DeepPartial<MatchSummary>,
) {
  const status = setSessionStatus(startDate, sessionType)

  return {
    id: options?.id ?? session.season + session.round + sessionType,
    startDate: options?.startDate ?? startDate,
    endDate: options?.endDate,
    sport: SPORT.MOTORSPORT,
    status: options?.status ?? status,
    roundLabel: options?.roundLabel ?? `Round ${session.round}`,
    summaryText: options?.summaryText ?? sessionType.replace("-", " "),
    timer:
      options?.timer ??
      (status === MatchStatus.UPCOMING
        ? (options?.startDate ?? startDate)
        : status.charAt(0) + status.slice(1).toLowerCase()),
    timerDisplayColour:
      options?.timerDisplayColour ??
      (status === MatchStatus.LIVE ? "green" : "gray"),
    otherDetail: options?.otherDetail,
    venue:
      options?.venue ??
      session.Circuit.circuitName + ", " + session.Circuit.Location.locality,
    matchSlug:
      options?.matchSlug ??
      `/sports/${SPORT.MOTORSPORT}/f1/${session.season}/${session.round}/${sessionType}`,
    seasonId: options?.seasonId ?? session.season,
    leagueId: options?.leagueId ?? "f1",
    leagueName: options?.leagueName ?? session.raceName,
    leagueSlug:
      options?.leagueSlug ?? `/sports/${SPORT.MOTORSPORT}/f1/${session.season}`,
    leagueImg:
      options?.leagueImg ?? resolveSportImage(session.Circuit.Location.country),
    competitorDetails: [],
    winner: options?.winner,
    cardVariant: options?.cardVariant ?? CardVariant.SESSION,
  }
}

async function fetchOpenF1SessionResult(
  season: string,
  round: string,
  sessionType: F1SessionType,
): Promise<LadderRow[] | null> {
  const meetings = await fetchF1Meetings(season)
  const curMeeting = meetings?.[Number(round)]

  const curSession = await fetchF1Sessions(
    season,
    curMeeting?.meeting_key != null
      ? String(curMeeting.meeting_key)
      : undefined,
    sessionType.replace("-", " "),
  )

  const rawPosition =
    (await fetchF1Positions(
      curSession?.[0]?.session_key != null
        ? String(curSession[0].session_key)
        : undefined,
      undefined,
      undefined,
      undefined,
      curMeeting?.meeting_key != null
        ? String(curMeeting.meeting_key)
        : undefined,
    )) ?? undefined

  if (!rawPosition) return null

  const drivers = await fetchF1DriverDetails(
    String(rawPosition[0].session_key),
    undefined,
  )

  const mostRecentPositions = Array.from(
    new Set(rawPosition.map((item) => item.position)),
  )
    .map((position) =>
      rawPosition
        .filter((item) => item.position === position)
        .reduce((latest, current) =>
          new Date(latest.date) > new Date(current.date) ? latest : current,
        ),
    )
    .sort((a, b) => a.position - b.position)

  return mostRecentPositions.map((item) => {
    const driverDetails = drivers?.find(
      (x) => x.driver_number === item.driver_number,
    )
    const driverName =
      driverDetails?.first_name + " " + driverDetails?.last_name

    return {
      position: item.position,
      teamId: item.driver_number,
      teamName: driverName,
      teamLogo: [
        resolveSportImage(driverName),
        resolveSportImage(driverDetails?.team_name ?? ""),
      ],

      Gap: "",
      Pts: "",
      Grid: "",
    }
  })
}

function mapJolpicaRaceResults(
  results: {
    position: string
    number: string
    laps: string
    Driver: { givenName: string; familyName: string }
    Constructor: { name: string }
    Time?: { time: string }
    status: string
    points: string
    grid: string
  }[],
  leaderLaps: string,
): LadderRow[] {
  return results.map((item) => {
    const lappedCount = Number(leaderLaps) - Number(item.laps)
    const lappedStatus =
      lappedCount === 0
        ? ""
        : lappedCount === 1
          ? "+1 Lap "
          : `+${lappedCount} Laps `

    const driverName = item.Driver.givenName + " " + item.Driver.familyName

    return {
      position: Number(item.position),
      teamId: item.number,
      teamName: driverName,
      teamLogo: [
        resolveSportImage(driverName),
        resolveSportImage(item.Constructor.name),
      ],
      Gap: item.Time ? lappedStatus + item.Time.time : item.status,
      Pts: item.points,
      Grid: item.grid,
    }
  })
}

function mapJolpicaQualifyingResults(
  results: {
    position: string
    number: string
    Driver: { givenName: string; familyName: string }
    Constructor: { name: string }
    Q1?: string
    Q2?: string
    Q3?: string
  }[],
): LadderRow[] {
  const fastestQ3 = results[0].Q3

  return results.map((item) => {
    let gap: string | undefined
    if (item.position === "1") {
      gap = item.Q3
    } else if (item.Q3 && fastestQ3) {
      gap =
        "+" +
        (
          Number(item.Q3.split(":")[1]) - Number(fastestQ3.split(":")[1])
        ).toFixed(3)
    } else {
      gap = item.Q2 ?? item.Q1
    }

    const driverName = item.Driver.givenName + " " + item.Driver.familyName

    return {
      position: Number(item.position),
      teamId: item.number,
      teamName: driverName,
      teamLogo: [
        resolveSportImage(driverName),
        resolveSportImage(item.Constructor.name),
      ],
      Gap: gap ?? "",
      Pts: "",
      Grid: "",
    }
  })
}

export function setSessionStatus(
  sessionDate: Date,
  sessionType: F1SessionType,
) {
  const currentDate = new Date()

  if (sessionDate > currentDate) {
    return MatchStatus.UPCOMING
  } else {
    switch (sessionType) {
      case F1SessionType.Practice1:
      case F1SessionType.Practice2:
      case F1SessionType.Practice3:
        return sessionDate > addHours(currentDate, -1)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
      case F1SessionType.Qualifying:
      case F1SessionType.SprintQualifying:
      case F1SessionType.Sprint:
        return sessionDate > addHours(currentDate, -2)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
      case F1SessionType.Race:
        return sessionDate > addHours(currentDate, -3)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED
      default:
        return MatchStatus.COMPLETED
    }
  }
}

export const f1Service = new F1Service()
