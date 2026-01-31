import { RugbyLeagueStanding } from "@/components/rugby-league/NRLLadder";
import {
  fetchRugbyLeagueCurrentMatches,
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
} from "@/endpoints/rugby-league.api";
import { NRL_TEAM_NAMES, RUGBY_LEAGUE_LEAGUES } from "@/lib/constants";
import { resolveNRLImages } from "@/lib/imageMapping";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import { MatchSummary, RoundDetails, SPORT } from "@/types/misc";
import {
  RugbyLeagueFixturesPage,
  RugbyLeagueLadderPage,
  RugbyLeagueMatchPage,
  RugbyLeagueTodayPage,
} from "@/types/rugby-league";

export async function rugbyLeagueMatches(
  tournamentId: number,
  seasonId: number,
) {
  const lastMatches = await fetchRugbyLeagueLastMatches(
    tournamentId,
    seasonId,
    0,
  );

  const nextMatches = await fetchRugbyLeagueNextMatches(
    tournamentId,
    seasonId,
    0,
  );

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  for (let i = 1; i < matches.length; i++) {
    if (matches[i].roundInfo === undefined) {
      matches[i].roundInfo = { round: 0 };
    }
  }

  const rounds = [...new Set(matches.map((item) => item.roundInfo?.round))];

  return {
    fixtures: rounds.map((round) => {
      //Get all teams playing in the round
      let teams = matches
        .filter((item) => item.roundInfo?.round === round)
        .flatMap((game) => [game.homeTeam.name, game.awayTeam.name]);

      return {
        matches: matches
          .filter((item) => item.roundInfo?.round === round)
          .map((match) => {
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel: `Round ${match.roundInfo?.round}`,
              timer:
                match.status.type === "notstarted"
                  ? toShortTimeString(startDate)
                  : match.status.description,
              timerDisplayColour:
                match.status.type === "inprogress" ? "green" : "gray",
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.RUGBY_LEAGUE,
              status: match.status.description,
              venue: "",
              summaryText: setMatchSummary(
                match.status.type,
                toShortTimeString(startDate),
                match.homeTeam.name,
                match.homeScore.current,
                match.awayTeam.name,
                match.awayScore.current,
              ),
              homeDetails: {
                name: shortenTeamNames(match.homeTeam.name),
                score: match.homeScore.current?.toString() ?? "0",
                img: resolveNRLImages(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveNRLImages(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: `Round ${round}`,
        byes: NRL_TEAM_NAMES.filter((x) => !teams.includes(x)).map((team) => {
          return { name: team, img: resolveNRLImages(team) };
        }),
      } as RoundDetails;
    }),

    currentRound: `Round ${
      nextMatches?.events?.[0]?.roundInfo?.round ??
      lastMatches?.events?.[lastMatches?.events.length - 1]?.roundInfo?.round ??
      0
    }`,
  } as RugbyLeagueFixturesPage;
}

export async function rugbyLeagueStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await fetchRugbyLeagueStandings(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings.map((table) =>
      table.rows.map((item) => {
        return {
          position: item.position,
          points: item.points,
          team: {
            id: item.team.id,
            name: shortenTeamNames(item.team.name),
            logo: resolveNRLImages(item.team.name),
          },
          games: {
            played: item.matches,
            win: item.wins,
            lost: item.losses,
            drawn: item.draws,
          },
          scores: { against: item.scoresAgainst, for: item.scoresFor },
        } as RugbyLeagueStanding;
      }),
    ),
    qualifyingPosition:
      RUGBY_LEAGUE_LEAGUES.find((l) => Number(l.slug) === tournamentId)
        ?.qualifyingPosition ?? -1,
  } as RugbyLeagueLadderPage;
}

export async function rugbyLeagueMatchDetails(matchId: number) {
  const match = await fetchRugbyLeagueMatchDetails(matchId);
  const incidents = await fetchRugbyLeagueMatchIncidents(matchId);

  const matchDetails = match?.event;
  const scoreIncidents = incidents?.incidents
    ? incidents?.incidents
        .filter((item) => item.incidentType === "goal")
        .toReversed()
    : null;

  return {
    scoreEvents: !scoreIncidents
      ? null
      : scoreIncidents.map((item) => {
          return {
            event: item.incidentClass,
            difference: (item.homeScore ?? 0) - (item.awayScore ?? 0),
          };
        }),
    matchDetails: !matchDetails
      ? null
      : {
          status: matchDetails?.status.description,
          homeTeam: {
            name: shortenTeamNames(matchDetails.homeTeam.name),
            score: matchDetails?.homeScore?.current?.toString() ?? "0",
            img: resolveNRLImages(matchDetails.homeTeam.name),
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails?.awayTeam.name),
            score: matchDetails?.awayScore?.current?.toString() ?? "0",
            img: resolveNRLImages(matchDetails.awayTeam.name),
          },
          scoreBreakdown: [
            {
              periodName: "1st Half",
              teams: {
                home: { score: matchDetails.homeScore?.period1 ?? "0" },
                away: { score: matchDetails.awayScore?.period1 ?? "0" },
              },
            },
            {
              periodName: "2nd Half",
              teams: {
                home: { score: matchDetails.homeScore?.period2 ?? "0" },
                away: { score: matchDetails.awayScore?.period2 ?? "0" },
              },
            },
          ],
        },
  } as RugbyLeagueMatchPage;
}

export async function rugbyLeagueCurrentMatches(
  date: "TODAY" | "YESTERDAY" | "TOMORROW",
  // categoryId: number,
) {
  const matches = await fetchRugbyLeagueCurrentMatches(date, 83);

  if (!matches) {
    return null;
  }

  const validLeagueIds = RUGBY_LEAGUE_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    RUGBY_LEAGUE_LEAGUES.map((l) => [Number(l.slug), l.name]),
  );

  matches.events = matches.events
    .filter((item) =>
      validLeagueIds.includes(item.tournament.uniqueTournament.id),
    )
    .sort(
      (a, b) =>
        validLeagueIds.indexOf(a.tournament.uniqueTournament.id) -
        validLeagueIds.indexOf(b.tournament.uniqueTournament.id),
    );

  // Get unique league ids in order
  const rounds = [
    ...new Set(
      matches.events.map((item) => item.tournament.uniqueTournament.id),
    ),
  ];

  return {
    fixtures: rounds.map((leagueId) => {
      const roundLabel = leagueIdToName[leagueId] ?? "";
      return {
        matches: matches.events
          .filter((item) => item.tournament.uniqueTournament.id === leagueId)
          .map((match) => {
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel: roundLabel,
              timer:
                match.status.type === "notstarted"
                  ? toShortTimeString(startDate)
                  : match.status.description,
              timerDisplayColour:
                match.status.type === "inprogress" ? "green" : "gray",
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.RUGBY_LEAGUE,
              status: match.status.description,
              venue: "",
              summaryText: setMatchSummary(
                match.status.type,
                toShortTimeString(startDate),
                match.homeTeam.name,
                match.homeScore.current,
                match.awayTeam.name,
                match.awayScore.current,
              ),
              homeDetails: {
                name: shortenTeamNames(match.homeTeam.name),
                score: match.homeScore.current?.toString() ?? "0",
                img: resolveNRLImages(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveNRLImages(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: roundLabel,
      } as RoundDetails;
    }),

    currentRound: "NRL",
  } as RugbyLeagueTodayPage;
}
