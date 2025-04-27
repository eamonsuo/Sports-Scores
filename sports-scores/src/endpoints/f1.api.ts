import {
  F1_Jolpica_ConstructorStandings_Response,
  F1_Jolpica_DriverStandings_Response,
  F1_Jolpica_QualifyingResults_Response,
  F1_Jolpica_RaceResults_Response,
  F1_Jolpica_Races_Response,
  F1_Jolpica_SprintResults_Response,
} from "@/types/f1";

const reqHeaders = new Headers();
reqHeaders.append("x-apisports-key", `${process.env.APISportsKey}`);

const fetchOptions = {
  headers: reqHeaders,
};

export async function fetchF1Events(season: number) {
  const rawEvents = await fetch(
    `${process.env.F1_JOLPICA_BASEURL}/f1/${season}/races`,
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
    `${process.env.F1_JOLPICA_BASEURL}/f1/${season}/${round}/results/`,
    // fetchOptions,
  );

  if (!rawSession.ok) {
    return null;
  }

  const jsonResponse =
    (await rawSession.json()) as F1_Jolpica_RaceResults_Response;

  return jsonResponse.MRData.RaceTable.Races;
}

export async function fetchF1QualifyingResult(season: number, round: number) {
  const rawSession = await fetch(
    `${process.env.F1_JOLPICA_BASEURL}/f1/${season}/${round}/qualifying/`,
    // fetchOptions,
  );

  if (!rawSession.ok) {
    return null;
  }

  const jsonResponse =
    (await rawSession.json()) as F1_Jolpica_QualifyingResults_Response;

  return jsonResponse.MRData.RaceTable.Races;
}

export async function fetchF1SprintResult(season: number, round: number) {
  const rawSession = await fetch(
    `${process.env.F1_JOLPICA_BASEURL}/f1/${season}/${round}/sprint/`,
    // fetchOptions,
  );

  if (!rawSession.ok) {
    return null;
  }

  const jsonResponse =
    (await rawSession.json()) as F1_Jolpica_SprintResults_Response;

  return jsonResponse.MRData.RaceTable.Races;
}

export async function fetchF1DriverStandings(season: number) {
  const rawStandings = await fetch(
    `${process.env.F1_JOLPICA_BASEURL}/f1/${season}/driverstandings`,
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
    `${process.env.F1_JOLPICA_BASEURL}/f1/${season}/constructorstandings`,
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
