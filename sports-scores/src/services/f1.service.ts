import {
  fetchF1ConstructorStandings,
  fetchF1DriverStandings,
  fetchF1Events,
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

export async function f1SessionResults(season: number) {
  const rawSession = await fetchF1Events(season);

  if (!rawSession) {
    return null;
  }

  return {} as F1SessionPage;
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
