import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchScheduledEvents,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore.api";
import { AFL_TEAM_NAMES, AUSSIE_RULES_LEAGUES } from "@/lib/constants";
import { resolveAussieRulesImages } from "@/lib/imageMapping";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import {
  AussieRulesFixturesPage,
  AussieRulesLadderPage,
  AussieRulesMatchPage,
  AussieRulesStanding,
} from "@/types/aussie-rules";
import { MatchSummary, RoundDetails, SPORT } from "@/types/misc";

export async function aussieRulesMatches(league: number, season: number) {
  const lastMatches = await fetchTournamentLastMatches(league, season, 0);
  const nextMatches = await fetchTournamentNextMatches(league, season, 0);

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
                match.status.type === "inprogress" ? "green" : null,
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.AUSSIE_RULES,
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
                img: resolveAussieRulesImages(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveAussieRulesImages(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: `Round ${round}`,
        byes: AFL_TEAM_NAMES.filter((x) => !teams.includes(x)).map((team) => {
          return { name: team, img: resolveAussieRulesImages(team) };
        }),
      } as RoundDetails;
    }),

    currentRound: `Round ${
      nextMatches?.events?.[0]?.roundInfo?.round ??
      lastMatches?.events?.[lastMatches?.events.length - 1]?.roundInfo?.round ??
      0
    }`,
  } as AussieRulesFixturesPage;
}

export async function aussieRulesStandings(league: number, season: number) {
  const standings = await fetchTournamentStandings(league, season);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings[0].rows.map((item) => {
      return {
        position: item.position,
        pts: item.points,
        team: {
          id: item.team.id,
          name: shortenTeamNames(item.team.name),
          logo: resolveAussieRulesImages(item.team.name),
        },
        games: {
          played: item.matches,
          win: item.wins,
          lost: item.losses,
          drawn: item.draws,
        },
        scores: { against: item.scoresAgainst, for: item.scoresFor },
      } as AussieRulesStanding;
    }),
    qualifyingPosition:
      AUSSIE_RULES_LEAGUES.find((l) => Number(l.slug) === league)
        ?.qualifyingPosition ?? -1,
  } as AussieRulesLadderPage;
}

export async function aussieRulesMatchDetails(matchId: number) {
  const match = await fetchMatchDetails(matchId);
  const incidents = await fetchMatchIncidents(matchId);

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
            img: resolveAussieRulesImages(matchDetails.homeTeam.name),
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails?.awayTeam.name),
            score: matchDetails?.awayScore?.current?.toString() ?? "0",
            img: resolveAussieRulesImages(matchDetails.awayTeam.name),
          },
          scoreBreakdown: [1, 2, 3, 4].map((quarter) => ({
            quarter,
            teams: {
              home: {
                id: matchDetails.homeTeam.id,
                goals: undefined,
                behinds: undefined,
                points:
                  (matchDetails.homeScore as Record<string, any>)[
                    `period${quarter}`
                  ] ?? "0",
              },
              away: {
                id: matchDetails.awayTeam.id,
                goals: undefined,
                behinds: undefined,
                points:
                  (matchDetails.awayScore as Record<string, any>)[
                    `period${quarter}`
                  ] ?? "0",
              },
            },
          })),
        },
  } as AussieRulesMatchPage;
}

export async function aussieRulesCurrentMatches(
  date: "TODAY" | "YESTERDAY" | "TOMORROW",
) {
  const matches = await fetchScheduledEvents(87);

  if (!matches) {
    return null;
  }

  const validLeagueIds = AUSSIE_RULES_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    AUSSIE_RULES_LEAGUES.map((l) => [Number(l.slug), l.name]),
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
                match.status.type === "inprogress" ? "green" : null,
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.AUSSIE_RULES,
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
                img: resolveAussieRulesImages(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveAussieRulesImages(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: roundLabel,
      } as RoundDetails;
    }),

    currentRound: "AFL",
  } as AussieRulesFixturesPage;
}
