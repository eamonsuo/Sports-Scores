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

async function fetchJolpicaApi(endpoint: string) {
  const res = await fetch(process.env.F1_BASEURL + endpoint);

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function fetchOpenF1Api(endpoint: string) {
  const res = await fetch(process.env.OPENF1_BASEURL + endpoint);

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function fetchF1Events(season: string | number) {
  const data = (await fetchJolpicaApi(
    `/f1/${season}/races`,
  )) as F1_Jolpica_Races_Response | null;
  return data?.MRData.RaceTable.Races ?? null;
}

export async function fetchF1RaceResult(season: string, round: string) {
  const data = (await fetchJolpicaApi(
    `/f1/${season}/${round}/results/`,
  )) as F1_Jolpica_RaceResults_Response | null;
  if (!data) return null;
  return data.MRData.RaceTable.Races.length > 0
    ? data.MRData.RaceTable.Races
    : null;
}

export async function fetchF1QualifyingResult(season: string, round: string) {
  const data = (await fetchJolpicaApi(
    `/f1/${season}/${round}/qualifying/`,
  )) as F1_Jolpica_QualifyingResults_Response | null;
  if (!data) return null;
  return data.MRData.RaceTable.Races.length > 0
    ? data.MRData.RaceTable.Races
    : null;
}

export async function fetchF1SprintResult(season: string, round: string) {
  const data = (await fetchJolpicaApi(
    `/f1/${season}/${round}/sprint/`,
  )) as F1_Jolpica_SprintResults_Response | null;
  if (!data) return null;
  return data.MRData.RaceTable.Races.length > 0
    ? data.MRData.RaceTable.Races
    : null;
}

export async function fetchF1DriverStandings(season: string) {
  const data = (await fetchJolpicaApi(
    `/f1/${season}/driverstandings`,
  )) as F1_Jolpica_DriverStandings_Response | null;
  return data?.MRData.StandingsTable.StandingsLists[0].DriverStandings ?? null;
}

export async function fetchF1ConstructorStandings(season: string) {
  const data = (await fetchJolpicaApi(
    `/f1/${season}/constructorstandings`,
  )) as F1_Jolpica_ConstructorStandings_Response | null;
  return (
    data?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings ?? null
  );
}

export async function fetchF1Positions(
  sessionId?: string,
  driverId?: string,
  position?: number,
  date?: string, //UTC ISO format: YYYY-MM-DDTHH:mm:ssZ
  meetingId?: string,
) {
  let endpoint = `/position?`;
  if (sessionId) endpoint += `session_key=${sessionId}&`;
  if (driverId) endpoint += `driver_number=${driverId}&`;
  if (position) endpoint += `position=${position}&`;
  if (date) endpoint += `date=${date}&`;
  if (meetingId) endpoint += `meeting_key=${meetingId}&`;

  return (await fetchOpenF1Api(endpoint)) as
    | F1_OpenF1_Positions_Response[]
    | null;
}

export async function fetchF1DriverDetails(
  sessionId?: string,
  driverId?: string,
) {
  let endpoint = `/drivers?`;
  if (sessionId) endpoint += `session_key=${sessionId}&`;
  if (driverId) endpoint += `driver_number=${driverId}&`;

  return (await fetchOpenF1Api(endpoint)) as
    | F1_OpenF1_Drivers_Response[]
    | null;
}

export async function fetchF1Meetings(year: string) {
  return (await fetchOpenF1Api(`/meetings?year=${year}&`)) as
    | F1_OpenF1_Meetings_Response[]
    | null;
}

export async function fetchF1Sessions(
  year: string,
  meetingId?: string,
  sessionName?: string,
) {
  let endpoint = `/sessions?year=${year}&`;
  if (meetingId) endpoint += `meeting_key=${meetingId}&`;
  if (sessionName) endpoint += `session_name=${sessionName}&`;

  return (await fetchOpenF1Api(endpoint)) as
    | F1_OpenF1_Sessions_Response[]
    | null;
}
