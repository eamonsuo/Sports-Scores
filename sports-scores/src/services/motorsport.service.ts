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
import { resolveSportImage } from "@/lib/imageMapping";
import {
  F1ConstructorStandingsPage,
  F1DriverStandingsPage,
  F1RacesPage,
  F1SessionPage,
  F1SessionType,
  SessionSummary,
} from "@/types/f1";
import { MatchSummary, SPORT } from "@/types/misc";
import { addHours } from "date-fns/addHours";

export async function f1EventSchedule(season: number) {
  const rawEvents = await fetchF1Events(season);

  if (!rawEvents) {
    return null;
  }

  return {
    sessions: rawEvents.flatMap((item) => {
      let gpSessions: SessionSummary[] = [];

      if (item.FirstPractice) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.FirstPractice.date + "T" + item.FirstPractice.time,
          ),
          sessionType: F1SessionType.Practice1,
          sessionName: F1SessionType.Practice1.replace("-", " "),
          sport: `${SPORT.MOTORSPORT}/f1`,
          status: setSessionStatus(
            new Date(item.FirstPractice.date + "T" + item.FirstPractice.time),
            F1SessionType.Practice1,
          ),
          logo: resolveSportImage(item.raceName),
          sessionSlug: `${season}/${item.round}/${F1SessionType.Practice1}`,
        });
      }
      if (item.SecondPractice) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.SecondPractice.date + "T" + item.SecondPractice.time,
          ),
          sessionType: F1SessionType.Practice2,
          sessionName: F1SessionType.Practice2.replace("-", " "),
          sport: `${SPORT.MOTORSPORT}/f1`,
          status: setSessionStatus(
            new Date(item.SecondPractice.date + "T" + item.SecondPractice.time),
            F1SessionType.Practice2,
          ),
          sessionSlug: `${season}/${item.round}/${F1SessionType.Practice2}`,
        });
      }
      if (item.ThirdPractice) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.ThirdPractice.date + "T" + item.ThirdPractice.time,
          ),
          sessionType: F1SessionType.Practice3,
          sessionName: F1SessionType.Practice3.replace("-", " "),
          sport: `${SPORT.MOTORSPORT}/f1`,
          status: setSessionStatus(
            new Date(item.ThirdPractice.date + "T" + item.ThirdPractice.time),
            F1SessionType.Practice3,
          ),
          sessionSlug: `${season}/${item.round}/${F1SessionType.Practice3}`,
        });
      }
      if (item.SprintQualifying) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.SprintQualifying.date + "T" + item.SprintQualifying.time,
          ),
          sessionType: F1SessionType.SprintQualifying,
          sessionName: F1SessionType.SprintQualifying.replace("-", " "),
          sport: `${SPORT.MOTORSPORT}/f1`,
          status: setSessionStatus(
            new Date(
              item.SprintQualifying.date + "T" + item.SprintQualifying.time,
            ),
            F1SessionType.SprintQualifying,
          ),
          sessionSlug: `${season}/${item.round}/${F1SessionType.SprintQualifying}`,
        });
      }
      if (item.Sprint) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(item.Sprint.date + "T" + item.Sprint.time),
          sessionType: F1SessionType.Sprint,
          sport: `${SPORT.MOTORSPORT}/f1`,
          status: setSessionStatus(
            new Date(item.Sprint.date + "T" + item.Sprint.time),
            F1SessionType.Sprint,
          ),
          sessionSlug: `${season}/${item.round}/${F1SessionType.Sprint}`,
        });
      }
      if (item.Qualifying) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.Qualifying.date + "T" + item.Qualifying.time,
          ),
          sessionType: F1SessionType.Qualifying,
          sport: `${SPORT.MOTORSPORT}/f1`,
          status: setSessionStatus(
            new Date(item.Qualifying.date + "T" + item.Qualifying.time),
            F1SessionType.Qualifying,
          ),
          sessionSlug: `${season}/${item.round}/${F1SessionType.Qualifying}`,
        });
      }

      gpSessions.push({
        round: Number(item.round),
        grandPrixName: item.raceName,
        startDate: new Date(item.date + "T" + item.time),
        sessionType: F1SessionType.Race,
        sessionName: F1SessionType.Race,
        sport: `${SPORT.MOTORSPORT}/f1`,
        status: setSessionStatus(
          new Date(item.date + "T" + item.time),
          F1SessionType.Race,
        ),
        sessionSlug: `${season}/${item.round}/${F1SessionType.Race}`,
      });

      return gpSessions;
    }),
  } as F1RacesPage;
}

export async function f1SessionResults(
  season: number,
  round: number,
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

      const curMeeting = meetings?.[round];

      const curSession = await fetchF1Sessions(
        season,
        curMeeting?.meeting_key,
        sessionType.replace("-", " "),
      );

      const rawPosition =
        (await fetchF1Positions(
          curSession?.[0]?.session_key,
          undefined,
          undefined,
          undefined,
          curMeeting?.meeting_key,
        )) ?? undefined;
      const driver = await fetchF1DriverDetails(
        rawPosition?.[0]?.session_key,
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
              name: driverDetails?.first_name + " " + driverDetails?.last_name,
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

export async function f1DriverStandings(season: number) {
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

export async function f1ConstructorStandings(season: number) {
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

function setSessionStatus(sessionDate: Date, sessionType: F1SessionType) {
  let currentDate = new Date();

  if (sessionDate > currentDate) {
    return null;
  } else {
    switch (sessionType) {
      case F1SessionType.Practice1:
      case F1SessionType.Practice2:
      case F1SessionType.Practice3:
        return sessionDate > addHours(currentDate, -1)
          ? "In Progress"
          : "Completed";
      case F1SessionType.Qualifying:
      case F1SessionType.SprintQualifying:
      case F1SessionType.Sprint:
        return sessionDate > addHours(currentDate, -2)
          ? "In Progress"
          : "Completed";
      case F1SessionType.Race:
        return sessionDate > addHours(currentDate, -3)
          ? "In Progress"
          : "Completed";
      default:
        return "Completed";
    }
  }
}

export function motorsportCategoriesByDate(date: Date) {
  // Placeholder for golf matches fetching logic

  function createMotorsportMatchSummary(
    id: number,
    name: string,
    slug: string,
  ) {
    return {
      id: id,
      sport: SPORT.MOTORSPORT,
      summaryText: name,
      startDate: date,
      status: "UPCOMING",
      awayDetails: { score: "", name: "" },
      homeDetails: { score: "", name: "" },
      matchSlug: slug,
    } as MatchSummary;
  }

  const motorsportEvents: MatchSummary[] = [];

  // Basic check for tournaments
  switch (date.getDay()) {
    case 2: // Tuesday
    case 3: // Wednesday
      break;
    case 4: // Thursday
    case 5: // Friday
    case 6: // Saturday
    case 0: // Sunday
    case 1: // Monday
      motorsportEvents.push(
        createMotorsportMatchSummary(2, "F1", "f1/2026"),
        createMotorsportMatchSummary(1, "Supercars", "supercars/2026"),
      );
      break;
  }
  return motorsportEvents;
}
