import { fetchEventsByCategoryDate, fetchRapidApi } from "@/lib/projUtils"
import {
  Sofascore_Cricket_Incidents_Response,
  Sofascore_Cricket_MatchInnings_Response,
} from "@/types/cricket"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Event_Response,
  Sofascore_EventLineups_Response,
  Sofascore_Events_Response,
  Sofascore_TournamentCupTrees_Response,
} from "@/types/sofascore"

async function fetchCricketApi(endpoint: string) {
  return fetchRapidApi(process.env.CRICKET_BASEURL, endpoint, SPORT.CRICKET)
}

/**
 * SOFASCORE ENDPOINTS
 */
import {
  Sofascore_EventPage_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore"

export async function fetchCricketLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchCricketApi(
    `/cricket/tournament/${tournamentId}/season/${seasonId}/matches/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchCricketNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchCricketApi(
    `/cricket/tournament/${tournamentId}/season/${seasonId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchCricketTeamLastMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchCricketApi(
    `/cricket/team/${teamId}/matches/previous/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchCricketTeamNextMatches(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchCricketApi(
    `/cricket/team/${teamId}/matches/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchCricketStandings(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchCricketApi(
    `/cricket/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response
}

export async function fetchCricketMatchDetails(matchId: string) {
  return (await fetchCricketApi(
    `/cricket/match/${matchId}`,
  )) as Sofascore_Event_Response
}

export async function fetchCricketMatchIncidents(matchId: string) {
  return (await fetchCricketApi(
    `/cricket/match/${matchId}/incidents`,
  )) as Sofascore_Cricket_Incidents_Response
}

export async function fetchCricketMatchLineups(matchId: string) {
  return (await fetchCricketApi(
    `/cricket/match/${matchId}/lineups`,
  )) as Sofascore_EventLineups_Response
}

export async function fetchCricketMatchInnings(matchId: string) {
  return (await fetchCricketApi(
    `/cricket/match/${matchId}/innings`,
  )) as Sofascore_Cricket_MatchInnings_Response
}

//Deprecated
export async function fetchCricketMatchesByDate(date: Date) {
  return (await fetchCricketApi(
    `/cricket/matches/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  )) as Sofascore_Events_Response
}

export async function fetchCricketCupTrees(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchCricketApi(
    `/cricket/tournament/${tournamentId}/season/${seasonId}/cuptrees`,
  )) as Sofascore_TournamentCupTrees_Response
}

export async function fetchCricketMatchesByCategoryDate(
  category: string[],
  date: Date,
) {
  return fetchEventsByCategoryDate<Sofascore_Events_Response>(
    fetchCricketApi,
    "/cricket",
    category,
    date,
  )
}

/**
 * LIVE SCORE API ENDPOINTS
 */
/*

const SERIES_IDS = [
  1445395, //Darwin T20 Series
  1445044, //T20 Spring Series (Pre WBBL)
  1442625, //WBBL
  1443056, //BBL
  1444468, //Sheffield Shield
  1444469, //One Day Cup (Men Domestic)
  1445042, //WNCL
]

const MY_TEAMS_IDs = [
  86103, // Australia Men
  86295, // QLD men
]


export async function fetchCricketMyTeams() {
  let matches: Cricket_LiveScoreAPI_TeamDetails[] = []

  for (const teamId of MY_TEAMS_IDs) {
    const result = await fetchCricketApi(`/teams/detail?ID=${teamId}`)
    if (result) {
      matches.push(result as Cricket_LiveScoreAPI_TeamDetails)
    }
  }

  if (matches.length <= 0) {
    return null
  }

  return matches
}

export async function fetchCricketAllSeries() {
  return (await fetchCricketApi(
    `/leagues/v2/list-popular?Category=cricket`,
  )) as Cricket_LiveScoreAPI_LeaguesListPopular
}

export async function fetchCricketMatchesByDateLiveScore(date: Date) {
  return (await fetchCricketApi(
    `/matches/v2/list-by-date?Category=cricket&Date=${format(date, "yyyyMMdd")}&Timezone=10`,
  )) as Cricket_LiveScoreAPI_MatchesListByDate
}

export async function fetchCricketMatchInnings(id: string) {
  return (await fetchCricketApi(
    `/matches/v2/get-innings?Category=cricket&Eid=${id}`,
  )) as Cricket_LiveScoreAPI_MatchesGetInnings
}

export async function OLD_fetchCricketMatchDetails(id: string) {
  return (await fetchCricketApi(
    `/matches/v2/get-scoreboard?Category=cricket&Eid=${id}`,
  )) as Cricket_LiveScoreAPI_MatchesGetScoreBoard
}

export async function fetchCricketSeriesMatches(ccd: string, scd: string) {
  return (await fetchCricketApi(
    `/matches/v2/list-by-league?Category=cricket&Ccd=${ccd}&Scd=${scd}`,
  )) as Cricket_LiveScoreAPI_MatchesListByLeague
}

export async function fetchCricketSeriesStandings(url: string) {}
*/
