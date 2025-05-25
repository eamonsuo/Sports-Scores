import {
  F1_Jolpica_ConstructorStandings_Response,
  F1_Jolpica_DriverStandings_Response,
  F1_Jolpica_QualifyingResults_Response,
  F1_Jolpica_RaceResults_Response,
  F1_Jolpica_Races_Response,
  F1_Jolpica_SprintResults_Response,
  F1_OpenF1_Drivers_Response,
  F1_OpenF1_Meetings_Response,
  F1_OpenF1_Positions_Response,
  F1_OpenF1_Sessions_Response,
} from "@/types/f1";

const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
};

// function updateQuota(response: Response) {
//   const limit = response.headers.get("x-ratelimit-requests-limit");
//   const remaining = response.headers.get("x-ratelimit-requests-remaining");
//   if (remaining && limit) {
//     updateGlobalApiQuota(
//       parseInt(remaining, 10),
//       parseInt(limit, 10),
//       SPORT.F1,
//     );
//   }
// }

export async function fetchF1Events(season: number) {
  const rawEvents = await fetch(
    `${process.env.F1_BASEURL}/f1/${season}/races`,
    // fetchOptions,
  );

  if (!rawEvents.ok) {
    return null;
  }

  const jsonResponse = (await rawEvents.json()) as F1_Jolpica_Races_Response;

  return jsonResponse.MRData.RaceTable.Races;
}

export async function fetchF1RaceResult(season: number, round: number) {
  const rawSession = await fetch(
    `${process.env.F1_BASEURL}/f1/${season}/${round}/results/`,
    // fetchOptions,
  );

  if (!rawSession.ok) {
    return null;
  }

  const jsonResponse =
    (await rawSession.json()) as F1_Jolpica_RaceResults_Response;

  return jsonResponse.MRData.RaceTable.Races.length > 0
    ? jsonResponse.MRData.RaceTable.Races
    : null;
}

export async function fetchF1QualifyingResult(season: number, round: number) {
  const rawSession = await fetch(
    `${process.env.F1_BASEURL}/f1/${season}/${round}/qualifying/`,
    // fetchOptions,
  );

  if (!rawSession.ok) {
    return null;
  }

  const jsonResponse =
    (await rawSession.json()) as F1_Jolpica_QualifyingResults_Response;

  return jsonResponse.MRData.RaceTable.Races.length > 0
    ? jsonResponse.MRData.RaceTable.Races
    : null;
}

export async function fetchF1SprintResult(season: number, round: number) {
  const rawSession = await fetch(
    `${process.env.F1_BASEURL}/f1/${season}/${round}/sprint/`,
    // fetchOptions,
  );

  if (!rawSession.ok) {
    return null;
  }

  const jsonResponse =
    (await rawSession.json()) as F1_Jolpica_SprintResults_Response;

  return jsonResponse.MRData.RaceTable.Races.length > 0
    ? jsonResponse.MRData.RaceTable.Races
    : null;
}

export async function fetchF1DriverStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.F1_BASEURL}/f1/${season}/driverstandings`,
    // fetchOptions,
  );

  if (!rawStandings.ok) {
    return null;
  }

  const jsonResponse =
    (await rawStandings.json()) as F1_Jolpica_DriverStandings_Response;

  return jsonResponse.MRData.StandingsTable.StandingsLists[0].DriverStandings;
}

export async function fetchF1ConstructorStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.F1_BASEURL}/f1/${season}/constructorstandings`,
    // fetchOptions,
  );

  if (!rawStandings.ok) {
    return null;
  }

  const jsonResponse =
    (await rawStandings.json()) as F1_Jolpica_ConstructorStandings_Response;

  return jsonResponse.MRData.StandingsTable.StandingsLists[0]
    .ConstructorStandings;
}

export async function fetchF1Positions(
  sessionId?: number,
  driverId?: number,
  position?: number,
  date?: string, //UTC ISO format: YYYY-MM-DDTHH:mm:ssZ
  meetingId?: number,
) {
  let searchUrl = `https://api.openf1.org/v1/position?`;

  if (sessionId) searchUrl += `session_key=${sessionId}&`;
  if (driverId) searchUrl += `driver_number=${driverId}&`;
  if (position) searchUrl += `position=${position}&`;
  if (date) searchUrl += `date=${date}&`;
  if (meetingId) searchUrl += `meeting_key=${meetingId}&`;

  const rawPositions = await fetch(searchUrl);

  if (!rawPositions.ok) {
    return null;
  }

  return (await rawPositions.json()) as F1_OpenF1_Positions_Response[];
}

export async function fetchF1DriverDetails(
  sessionId?: number,
  driverId?: number,
) {
  let searchUrl = `https://api.openf1.org/v1/drivers?`;

  if (sessionId) searchUrl += `session_key=${sessionId}&`;
  if (driverId) searchUrl += `driver_number=${driverId}&`;

  const rawDrivers = await fetch(searchUrl);

  if (!rawDrivers.ok) {
    return null;
  }

  return (await rawDrivers.json()) as F1_OpenF1_Drivers_Response[];
}

export async function fetchF1Meetings(year: number) {
  let searchUrl = `https://api.openf1.org/v1/meetings?year=${year}&`;

  // if (session) searchUrl += `session_key=${session}&`;
  // if (driver) searchUrl += `driver_number=${driver}&`;

  const rawMeetings = await fetch(searchUrl);

  if (!rawMeetings.ok) {
    return null;
  }

  return (await rawMeetings.json()) as F1_OpenF1_Meetings_Response[];
}

export async function fetchF1Sessions(
  year: number,
  meetingId?: number,
  sessionName?: string,
) {
  let searchUrl = `https://api.openf1.org/v1/sessions?year=${year}&`;

  if (meetingId) searchUrl += `meeting_key=${meetingId}&`;
  if (sessionName) searchUrl += `session_name=${sessionName}&`;

  const rawSessions = await fetch(searchUrl);

  if (!rawSessions.ok) {
    return null;
  }

  return (await rawSessions.json()) as F1_OpenF1_Sessions_Response[];
}
