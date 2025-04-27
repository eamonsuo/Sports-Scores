import {
  fetchF1ConstructorStandings,
  fetchF1DriverStandings,
  fetchF1Events,
  fetchF1QualifyingResult,
  fetchF1RaceResult,
  fetchF1SprintResult,
} from "@/endpoints/f1.api";
import {
  F1ConstructorStandingsPage,
  F1DriverStandingsPage,
  F1RacesPage,
  F1SessionPage,
  SessionSummary,
} from "@/types/f1";

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
          sessionType: "Practice 1",
          sport: "f1",
          status: "",
        });
      }
      if (item.SecondPractice) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.SecondPractice.date + "T" + item.SecondPractice.time,
          ),
          sessionType: "Practice 2",
          sport: "f1",
          status: "",
        });
      }
      if (item.ThirdPractice) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.ThirdPractice.date + "T" + item.ThirdPractice.time,
          ),
          sessionType: "Practice 3",
          sport: "f1",
          status: "",
        });
      }
      if (item.SprintQualifying) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.SprintQualifying.date + "T" + item.SprintQualifying.time,
          ),
          sessionType: "Sprint Qualifying",
          sport: "f1",
          status: "",
        });
      }
      if (item.Sprint) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(item.Sprint.date + "T" + item.Sprint.time),
          sessionType: "Sprint",
          sport: "f1",
          status: "",
        });
      }
      if (item.Qualifying) {
        gpSessions.push({
          round: Number(item.round),
          grandPrixName: item.raceName,
          startDate: new Date(
            item.Qualifying.date + "T" + item.Qualifying.time,
          ),
          sessionType: "Qualifying",
          sport: "f1",
          status: "",
        });
      }

      gpSessions.push({
        round: Number(item.round),
        grandPrixName: item.raceName,
        startDate: new Date(item.date + "T" + item.time),
        sessionType: "Race",
        sport: "f1",
        status: "",
      });

      return gpSessions;
    }),
  } as F1RacesPage;
}

export async function f1SessionResults(
  season: number,
  round: number,
  sessionType: string,
) {
  let rawSession;
  let raceLaps: string;

  switch (sessionType) {
    case "Practice 1":
    case "Practice 2":
    case "Practice 3":
    case "Sprint Qualifying":
      return null;
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
            pits: 0,
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
            pits: 0,
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
    standings: rawStandings.map((item) => {
      return {
        driver: {
          id: Number(item.Driver.permanentNumber),
          name: item.Driver.givenName + " " + item.Driver.familyName,
        },
        position: Number(item.position),
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
    standings: rawStandings.map((item) => {
      return {
        team: {
          id: item.Constructor.constructorId,
          name: item.Constructor.name,
        },
        position: Number(item.position),
        points: Number(item.points),
      };
    }),
  } as F1ConstructorStandingsPage;
}
