import {
  fetchNetballLastMatches,
  fetchNetballMatchDetails,
  fetchNetballMatchesByDate,
  fetchNetballNextMatches,
  fetchNetballSeasonMatches,
  fetchNetballStandings,
} from "@/endpoints/netball.api"
import { NETBALL_LEAGUES } from "@/lib/constants"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { setMatchSummary, shortenTeamNames } from "@/lib/projUtils"
import {
  DeepPartial,
  DisplayTypes,
  MatchStatus,
  MatchSummary,
  SPORT,
} from "@/types/misc"
import {
  NetballFixturesPage,
  NetballMatchPage,
  NetballTodayPage,
} from "@/types/netball"
import { SportsDB_Event } from "@/types/sportsdb"

export async function netballMatches(leagueId: string, seasonId: string) {
  const seasonMatches = await fetchNetballSeasonMatches(leagueId, seasonId)
  const lastMatches = await fetchNetballLastMatches(leagueId, seasonId)
  const nextMatches = await fetchNetballNextMatches(leagueId, seasonId)

  if (!lastMatches && !nextMatches && !seasonMatches) {
    return null
  }

  const allMatches = (lastMatches?.events ?? [])
    .concat(nextMatches?.events ?? [])
    .concat(seasonMatches?.events ?? [])

  // Remove duplicates based on idEvent
  const matches = Array.from(
    new Map(allMatches.map((match) => [match.idEvent, match])).values(),
  )

  const leagueConfig = NETBALL_LEAGUES.find((l) => l.slug === leagueId)

  const sortedMatches = matches
    .map((match) =>
      mapNetballMatch(match, { roundLabel: `Round ${match.intRound ?? 0}` }),
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )

  const fixture = await mapFixtureRounds(sortedMatches, leagueConfig)

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(fixture, leagueConfig?.display),
  } as NetballFixturesPage
}

export async function netballStandings(leagueId: string, seasonId: string) {
  const standings = await fetchNetballStandings(leagueId, seasonId)

  if (!standings) {
    return null
  }

  return null
  // return {
  //   standings: standings?.standings.map((table) =>
  //     table.rows.map((item) => {
  //       return {
  //         position: item.position,
  //         points: item.points,
  //         team: {
  //           id: item.team.id,
  //           name: shortenTeamNames(item.team.name),
  //           logo: resolveSportImage(item.team.name),
  //         },
  //         games: {
  //           played: item.matches,
  //           win: item.wins,
  //           lost: item.losses,
  //           drawn: item.draws,
  //         },
  //         scores: { against: item.scoresAgainst, for: item.scoresFor },
  //       } as NetballStanding;
  //     }),
  //   ),
  //   qualifyingPosition:
  //     NETBALL_LEAGUES.find((l) => Number(l.slug) === leagueId)
  //       ?.qualifyingPosition ?? -1,
  // } as NetballLadderPage;
}

export async function netballMatchDetails(matchId: string) {
  const match = await fetchNetballMatchDetails(matchId)
  // const incidents = await fetchNetballMatchIncidents(matchId);

  const matchDetails = match?.events[0]
  // const scoreIncidents = incidents?.incidents
  //   ? incidents?.incidents
  //       .filter((item) => item.incidentType === "goal")
  //       .toReversed()
  //   : null;

  return {
    // scoreEvents: null
    matchDetails: !matchDetails
      ? null
      : {
          status:
            matchDetails.intHomeScore !== null &&
            matchDetails.intAwayScore !== null
              ? "COMPLETED"
              : "UPCOMING",
          homeTeam: {
            name: shortenTeamNames(matchDetails.strHomeTeam),
            score: matchDetails?.intHomeScore?.toString() ?? "0",
            img: matchDetails.strHomeTeamBadge,
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails.strAwayTeam),
            score: matchDetails?.intAwayScore?.toString() ?? "0",
            img: matchDetails.strAwayTeamBadge,
          },
          // scoreBreakdown: [
          //   {
          //     periodName: "1st Half",
          //     teams: {
          //       home: { score: matchDetails.homeScore?.period1 ?? "0" },
          //       away: { score: matchDetails.awayScore?.period1 ?? "0" },
          //     },
          //   },
          //   {
          //     periodName: "2nd Half",
          //     teams: {
          //       home: { score: matchDetails.homeScore?.period2 ?? "0" },
          //       away: { score: matchDetails.awayScore?.period2 ?? "0" },
          //     },
          //   },
          // ],
        },
  } as NetballMatchPage
}

export async function netballMatchesByDate(date: Date) {
  const matches = await fetchNetballMatchesByDate(date)

  if (!matches || !matches.events) return null

  const validLeagueIds = NETBALL_LEAGUES.filter((l) => !l.excludeFromToday).map(
    (l) => Number(l.slug),
  )

  matches.events = matches.events
    // .filter((item) =>
    //   validLeagueIds.includes(item.tournament.uniqueTournament.id),
    // )
    .sort(
      (a, b) =>
        validLeagueIds.indexOf(Number(a.idLeague)) -
        validLeagueIds.indexOf(Number(b.idLeague)),
    )

  if (!matches.events || matches.events.length === 0) return null

  const allMatches = matches.events.map((match) =>
    mapNetballMatch(match, { roundLabel: `Round ${match.intRound ?? 0}` }),
  )

  const fixture = await mapFixtureRounds(allMatches, NETBALL_LEAGUES)

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(fixture, DisplayTypes.LEAGUE),
  } as NetballTodayPage
}

function mapNetballMatch(
  event: SportsDB_Event,
  options?: DeepPartial<MatchSummary>,
): MatchSummary {
  const timeStamp =
    event.strTimestamp.length > 19
      ? event.strTimestamp.slice(0, 19)
      : event.strTimestamp
  const startDate = new Date(timeStamp + "Z")

  const status: MatchStatus =
    event.intHomeScore !== null && event.intAwayScore !== null
      ? MatchStatus.COMPLETED
      : MatchStatus.UPCOMING

  return {
    id: options?.id ?? event.idEvent,
    startDate: options?.startDate ?? startDate,
    endDate: options?.endDate,
    sport: SPORT.NETBALL,
    status: options?.status ?? status,
    roundLabel: options?.roundLabel ?? `Round ${event.intRound}`,
    timer:
      options?.timer ??
      (status === MatchStatus.UPCOMING
        ? (options?.startDate ?? startDate)
        : "Ended"),
    timerDisplayColour: options?.timerDisplayColour ?? "gray",
    matchSlug:
      options?.matchSlug ??
      `/sports/${SPORT.NETBALL}/${event.idLeague}/${event.strSeason}/match/${event.idEvent}`,
    venue: options?.venue ?? event?.strVenue ?? "",
    leagueName: options?.leagueName,
    leagueSlug: options?.leagueSlug,
    summaryText:
      options?.summaryText ??
      setMatchSummary(
        status === MatchStatus.UPCOMING ? "notstarted" : "finished",
        event.strHomeTeam,
        event.intHomeScore ?? 0,
        event.strAwayTeam,
        event.intAwayScore ?? 0,
      ),
    competitorDetails: [
      {
        id: options?.competitorDetails?.[0]?.id ?? event.idHomeTeam ?? "",
        name:
          options?.competitorDetails?.[0]?.name ??
          shortenTeamNames(event.strHomeTeam),
        score:
          options?.competitorDetails?.[0]?.score ??
          (event.intHomeScore ?? 0).toString(),
        img: options?.competitorDetails?.[0]?.img ?? event.strHomeTeamBadge,
        winDrawLoss: options?.competitorDetails?.[0]?.winDrawLoss,
      },
      {
        id: options?.competitorDetails?.[1]?.id ?? event.idAwayTeam ?? "",
        name:
          options?.competitorDetails?.[1]?.name ??
          shortenTeamNames(event.strAwayTeam),
        score:
          options?.competitorDetails?.[1]?.score ??
          (event.intAwayScore ?? 0).toString(),
        img: options?.competitorDetails?.[1]?.img ?? event.strAwayTeamBadge,
        winDrawLoss: options?.competitorDetails?.[1]?.winDrawLoss,
      },
    ],
    seasonId: options?.seasonId ?? event.strSeason,
    leagueId: options?.leagueId ?? event.idLeague,
  }
}
