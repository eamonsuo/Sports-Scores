import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import { F1SessionResults } from "@/components/motorsport/f1/F1SessionStandings";
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
} from "@/endpoints/f1.api";
import { MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { getSportConfigurations } from "@/lib/projUtils";
import {
  F1ConstructorStandingsPage,
  F1DriverStandingsPage,
  F1SessionPage,
  F1SessionType,
  Jolpica_Race,
} from "@/types/f1";
import {
  Brackets,
  CardVariant,
  DeepPartial,
  DisplayTypes,
  FixtureRound,
  MatchDetail,
  Matches,
  MatchStatus,
  MatchSummary,
  SPORT,
  SportService,
  Standings,
} from "@/types/misc";
import { isSameDay } from "date-fns";
import { addHours } from "date-fns/addHours";
import { TZDate } from "react-day-picker";

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

class F1Service implements SportService {
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
    const rawEvents = await fetchF1Events(seasonId);

    if (!rawEvents) {
      return null;
    }

    const allEvents = rawEvents
      ?.flatMap((race) => this.mapRaceToMatchSummaries(race))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const { leagueConfig } = getSportConfigurations(
      this.categories,
      leagueId,
      seasonId,
    );

    const fixtures = await mapFixtureRounds(
      allEvents,
      leagueConfig,
      this.cardVariant,
    );

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    };
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const rawEvents = await fetchF1Events(date.getFullYear());

    if (!rawEvents) {
      return null;
    }

    const timezone = date instanceof TZDate ? date.timeZone : "UTC";

    const filteredEvents = rawEvents
      .flatMap((race) => this.mapRaceToMatchSummaries(race))
      .filter((item) => {
        const eventDate = new TZDate(item.startDate, timezone);
        return isSameDay(eventDate, date);
      });

    if (!filteredEvents || filteredEvents.length === 0) return null;

    const fixtures = await mapFixtureRounds(
      filteredEvents,
      this.categories,
      this.cardVariant,
    );

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    };
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

  async f1SessionResults(
    season: string,
    round: string,
    sessionType: F1SessionType,
  ) {
    let rawSession;
    let raceLaps: string;

    switch (sessionType) {
      case F1SessionType.Practice1:
      case F1SessionType.Practice2:
      case F1SessionType.Practice3:
      case F1SessionType.SprintQualifying:
        const meetings = await fetchF1Meetings(season);

        const curMeeting = meetings?.[Number(round)];

        const curSession = await fetchF1Sessions(
          season,
          curMeeting?.meeting_key != null
            ? String(curMeeting.meeting_key)
            : undefined,
          sessionType.replace("-", " "),
        );

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
          )) ?? undefined;
        const driver = await fetchF1DriverDetails(
          rawPosition?.[0]?.session_key != null
            ? String(rawPosition[0].session_key)
            : undefined,
          undefined,
        );

        if (!rawPosition) {
          return null;
        }

        const distinctPositions = Array.from(
          new Set(rawPosition.map((item) => item.position)),
        );

        const mostRecentPositions = distinctPositions
          .map((position) => {
            return rawPosition
              .filter((item) => item.position === position)
              .reduce((latest, current) => {
                return new Date(latest.date) > new Date(current.date)
                  ? latest
                  : current;
              });
          })
          .sort((a, b) => a.position - b.position);

        return {
          results: mostRecentPositions.map((item) => {
            let driverDetails = driver?.find(
              (x) => x.driver_number === item.driver_number,
            );

            return {
              position: item.position,
              driver: {
                id: item.driver_number,
                name:
                  driverDetails?.first_name + " " + driverDetails?.last_name,
              },
              // laps: Number(item.laps),
              time: "",
              team: { name: driverDetails?.team_name ?? "Unknown" },
            } as F1SessionResults;
          }),
          sessionName: sessionType,
        } as F1SessionPage;
      case "Sprint":
        rawSession = await fetchF1SprintResult(season, round);

        if (!rawSession) {
          return null;
        }

        raceLaps = rawSession[0].SprintResults[0].laps;

        return {
          results: rawSession[0].SprintResults.map((item) => {
            let lappedStatus = "";

            if (raceLaps !== item.laps) {
              let lappedlaps = Number(raceLaps) - Number(item.laps);
              lappedStatus = lappedlaps == 1 ? "Lap" : lappedlaps + "Lap";
            }

            return {
              position: Number(item.position),
              driver: {
                id: Number(item.number),
                name: item.Driver.givenName + " " + item.Driver.familyName,
              },
              grid: item.grid,
              laps: Number(item.laps),
              time: item.Time ? lappedStatus + item.Time.time : item.status,
              // pits: 0,
              team: { name: item.Constructor.name },
              points: Number(item.points),
            };
          }),
          sessionName: sessionType,
        } as F1SessionPage;
      case "Qualifying":
        rawSession = await fetchF1QualifyingResult(season, round);

        if (!rawSession) {
          return null;
        }

        let fastestQualifier = rawSession[0].QualifyingResults[0].Q3;

        return {
          results: rawSession[0].QualifyingResults.map((item) => {
            let qualyGap = "";
            if (item.Q3 && item.position !== "1") {
              qualyGap =
                "+" +
                (
                  Number(item.Q3.split(":")[1]) -
                  Number(fastestQualifier?.split(":")[1])
                ).toFixed(3);
            }

            return {
              position: Number(item.position),
              driver: {
                id: Number(item.number),
                name: item.Driver.givenName + " " + item.Driver.familyName,
              },
              time:
                item.position === "1"
                  ? item.Q3
                  : item.Q3
                    ? qualyGap
                    : item.Q2
                      ? item.Q2
                      : item.Q1,
              team: { name: item.Constructor.name },
            };
          }),
          sessionName: sessionType,
        } as F1SessionPage;
      case "Race":
        rawSession = await fetchF1RaceResult(season, round);

        if (!rawSession) {
          return null;
        }

        raceLaps = rawSession[0].Results[0].laps;

        return {
          results: rawSession[0].Results.map((item) => {
            let lappedStatus = "";

            if (raceLaps !== item.laps) {
              let lappedlaps = Number(raceLaps) - Number(item.laps);
              lappedStatus = lappedlaps == 1 ? "Lap" : lappedlaps + "Lap";
            }

            return {
              position: Number(item.position),
              driver: {
                id: Number(item.number),
                name: item.Driver.givenName + " " + item.Driver.familyName,
              },
              grid: item.grid,
              laps: Number(item.laps),
              time: item.Time ? lappedStatus + item.Time.time : item.status,
              // pits: 0,
              team: { name: item.Constructor.name },
              points: Number(item.points),
            };
          }),
          sessionName: sessionType,
        } as F1SessionPage;
      default:
        return null;
    }
  }

  async f1DriverStandings(season: string) {
    const rawStandings = await fetchF1DriverStandings(season);

    if (!rawStandings) {
      return null;
    }

    return {
      standings: rawStandings.map((item, index) => {
        return {
          driver: {
            id: Number(item.Driver.permanentNumber),
            name: item.Driver.givenName + " " + item.Driver.familyName,
            img: resolveSportImage(
              item.Driver.givenName + " " + item.Driver.familyName,
            ),
            teamimg: resolveSportImage(item.Constructors[0].name),
          },
          position: Number(item.position) ?? index + 1,
          points: Number(item.points),
          wins: Number(item.wins),
        };
      }),
    } as F1DriverStandingsPage;
  }

  async f1ConstructorStandings(season: string) {
    const rawStandings = await fetchF1ConstructorStandings(season);

    if (!rawStandings) {
      return null;
    }

    return {
      standings: rawStandings.map((item, index) => {
        return {
          team: {
            id: item.Constructor.constructorId,
            name: item.Constructor.name,
            logo: resolveSportImage(item.Constructor.name),
          },
          position: Number(item.position) ?? index + 1,
          points: Number(item.points),
        };
      }),
    } as F1ConstructorStandingsPage;
  }

  mapRaceToMatchSummaries(session: Jolpica_Race) {
    let startDate: Date;
    let sessions: MatchSummary[] = [];

    if (session.FirstPractice) {
      startDate = new Date(
        session.FirstPractice.date + "T" + session.FirstPractice.time,
      );
      sessions.push(
        this.mapSessionToMatchSummary(
          session,
          F1SessionType.Practice1,
          startDate,
        ),
      );
    }
    if (session.SecondPractice) {
      startDate = new Date(
        session.SecondPractice.date + "T" + session.SecondPractice.time,
      );
      sessions.push(
        this.mapSessionToMatchSummary(
          session,
          F1SessionType.Practice2,
          startDate,
        ),
      );
    }
    if (session.ThirdPractice) {
      startDate = new Date(
        session.ThirdPractice.date + "T" + session.ThirdPractice.time,
      );
      sessions.push(
        this.mapSessionToMatchSummary(
          session,
          F1SessionType.Practice3,
          startDate,
        ),
      );
    }
    if (session.Qualifying) {
      startDate = new Date(
        session.Qualifying.date + "T" + session.Qualifying.time,
      );
      sessions.push(
        this.mapSessionToMatchSummary(
          session,
          F1SessionType.Qualifying,
          startDate,
        ),
      );
    }
    if (session.Sprint) {
      startDate = new Date(session.Sprint.date + "T" + session.Sprint.time);
      sessions.push(
        this.mapSessionToMatchSummary(session, F1SessionType.Sprint, startDate),
      );
    }
    if (session.SprintQualifying) {
      startDate = new Date(
        session.SprintQualifying.date + "T" + session.SprintQualifying.time,
      );
      sessions.push(
        this.mapSessionToMatchSummary(
          session,
          F1SessionType.SprintQualifying,
          startDate,
        ),
      );
    }
    startDate = new Date(session.date + "T" + session.time);
    sessions.push(
      this.mapSessionToMatchSummary(session, F1SessionType.Race, startDate),
    );

    return sessions;
  }

  mapSessionToMatchSummary(
    session: Jolpica_Race,
    sessionType: F1SessionType,
    startDate: Date,
    options?: DeepPartial<MatchSummary>,
  ) {
    const status = setSessionStatus(startDate, sessionType);

    return {
      id: options?.id ?? session.season + session.round + sessionType,
      sport: SPORT.MOTORSPORT,
      summaryText: options?.summaryText ?? sessionType.replace("-", " "),
      startDate: options?.startDate ?? startDate,
      endDate: options?.endDate,
      status: options?.status ?? status,
      seriesName: options?.seriesName ?? session.raceName,
      seriesImg: options?.seriesImg ?? resolveSportImage(session.raceName),
      seriesSlug: options?.seriesSlug ?? `f1/${session.season}`,
      matchSlug:
        options?.matchSlug ??
        `f1/${session.season}/${session.round}/${sessionType}`,
      roundLabel: options?.roundLabel ?? `Round ${session.round}`,
      timer:
        options?.timer ??
        (status === MatchStatus.UPCOMING
          ? (options?.startDate ?? startDate)
          : status.charAt(0) + status.slice(1).toLowerCase()),
      timerDisplayColour:
        options?.timerDisplayColour ??
        (status === MatchStatus.LIVE ? "green" : "gray"),
      awayDetails: { score: "", name: "" },
      homeDetails: { score: "", name: "" },
      venue:
        options?.venue ??
        session.Circuit.circuitName + ", " + session.Circuit.Location.locality,

      seasonId: options?.seasonId ?? session.season,
      tournamentId: options?.tournamentId ?? "f1",
      winner: options?.winner,
    };
  }
}

function setSessionStatus(sessionDate: Date, sessionType: F1SessionType) {
  let currentDate = new Date();

  if (sessionDate > currentDate) {
    return MatchStatus.UPCOMING;
  } else {
    switch (sessionType) {
      case F1SessionType.Practice1:
      case F1SessionType.Practice2:
      case F1SessionType.Practice3:
        return sessionDate > addHours(currentDate, -1)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED;
      case F1SessionType.Qualifying:
      case F1SessionType.SprintQualifying:
      case F1SessionType.Sprint:
        return sessionDate > addHours(currentDate, -2)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED;
      case F1SessionType.Race:
        return sessionDate > addHours(currentDate, -3)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED;
      default:
        return MatchStatus.COMPLETED;
    }
  }
}

export const f1Service = new F1Service(
  SPORT.MOTORSPORT,
  MOTORSPORT_CATEGORIES,
  CardVariant.MOTORSPORT,
);

export const motorsportService = new MotorsportService(
  SPORT.MOTORSPORT,
  MOTORSPORT_CATEGORIES,
  CardVariant.MOTORSPORT,
);
