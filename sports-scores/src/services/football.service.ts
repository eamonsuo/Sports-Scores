import { Match as BracketMatch } from "@/components/bracket/types";
import {
  FootballStanding,
  FootballTeamStanding,
} from "@/components/football/FootballLadder";
import {
  fetchFootballCupTrees,
  fetchFootballLastMatches,
  fetchFootballMatchDetails,
  fetchFootballMatchesByDate,
  fetchFootballMatchIncidents,
  fetchFootballNextMatches,
  fetchFootballStandings,
  fetchFootballTeamLastMatches,
  fetchFootballTeamNextMatches,
} from "@/endpoints/football.api";
import {
  fetchCupTrees,
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
  fetchTeamLastEvents,
  fetchTeamNextEvents,
} from "@/endpoints/sofascore.api";
import { FOOTBALL_LEAGUES } from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { setMatchSummary, shortenTeamNames } from "@/lib/projUtils";
import {
  FootballBracketPage,
  FootballFixturesPage,
  FootballLadderPage,
  FootballMatchPage,
  FootballTeamFixturesPage,
  FootballTodayPage,
} from "@/types/football";
import { FixtureRound, MatchSummary, SPORT } from "@/types/misc";

export async function footballMatches(tournamentId: number, seasonId: number) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchFootballLastMatches
  )(tournamentId, seasonId, 0);

  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchFootballNextMatches
  )(tournamentId, seasonId, 0);

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
            let startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel: `Round ${match.roundInfo?.round}`,
              timer:
                match.status.type === "notstarted"
                  ? startDate
                  : match.status.description,
              timerDisplayColour:
                match.status.type === "inprogress" ? "green" : "gray",
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.FOOTBALL,
              status: match.status.description,
              venue: "",
              summaryText: setMatchSummary(
                match.status.type,
                match.homeTeam.name,
                match.homeScore.current,
                match.awayTeam.name,
                match.awayScore.current,
              ),
              homeDetails: {
                name: shortenTeamNames(match.homeTeam.name),
                score: match.homeScore.current?.toString() ?? "0",
                img: resolveSportImage(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveSportImage(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: `Round ${round}`,
        // byes: NRL_TEAM_NAMES.filter((x) => !teams.includes(x)).map((team) => {
        //   return { name: team, img: resolveNRLImages(team) };
        // }),
      } as FixtureRound;
    }),

    currentRound: `Round ${
      nextMatches?.events?.[0]?.roundInfo?.round ??
      lastMatches?.events?.[lastMatches?.events.length - 1]?.roundInfo?.round ??
      0
    }`,
  } as FootballFixturesPage;
}

export async function footballTeamMatches(teamId: number) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchTeamLastEvents : fetchFootballTeamLastMatches
  )(teamId, 0);

  const nextMatches = await (
    process.env.DEV_MODE ? fetchTeamNextEvents : fetchFootballTeamNextMatches
  )(teamId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  return {
    fixtures: matches.toReversed().map((match) => {
      let startDate = new Date(0);
      startDate.setUTCSeconds(match.startTimestamp);

      return {
        startDate: startDate,
        // roundLabel: `Round ${match?.roundInfo?.round ?? "--"}`,
        timer:
          match.status.type === "notstarted"
            ? startDate
            : match.status.description,
        timerDisplayColour: match.status.type === "inprogress" ? "green" : null,
        id: match.id,
        matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
        sport: SPORT.FOOTBALL,
        status: match.status.description,
        venue: "",
        summaryText: setMatchSummary(
          match.status.type,
          match.homeTeam.name,
          match.homeScore.current,
          match.awayTeam.name,
          match.awayScore.current,
        ),
        homeDetails: {
          name: shortenTeamNames(match.homeTeam.name),
          score: match.homeScore.current?.toString() ?? "0",
          img: resolveSportImage(match.homeTeam.name),
        },
        awayDetails: {
          name: shortenTeamNames(match.awayTeam.name),
          score: match.awayScore.current?.toString() ?? "0",
          img: resolveSportImage(match.awayTeam.name),
        },
        otherDetail: match.tournament.name,
      } as MatchSummary;
    }),
  } as FootballTeamFixturesPage;
}

export async function footballStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchFootballStandings
  )(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return {
    tables: standings?.standings
      // .sort((a, b) => b.name.localeCompare(a.name))
      .map((table) => {
        return {
          tableName: table.name ?? "test",
          standings: table.rows.map((standing) => {
            return {
              position: standing.position,
              points: standing.points,
              team: {
                id: standing.team.id,
                name: shortenTeamNames(standing.team.name),
                logo: resolveSportImage(standing.team.name),
              },
              games: {
                played: standing.matches,
                win: standing.wins,
                lost: standing.losses,
                drawn: standing.draws,
              },
              scores: {
                against: standing.scoresAgainst,
                for: standing.scoresFor,
              },
            } as FootballTeamStanding;
          }),
          qualifyingPosition:
            FOOTBALL_LEAGUES.find((l) => Number(l.slug) === tournamentId)
              ?.qualifyingPosition ?? -1,
        } as FootballStanding;
      }),
  } as FootballLadderPage;
}

export async function footballMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchFootballMatchDetails
  )(matchId);
  const incidents = await (
    process.env.DEV_MODE ? fetchEventIncidents : fetchFootballMatchIncidents
  )(matchId);

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
            img: resolveSportImage(matchDetails.homeTeam.name),
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails?.awayTeam.name),
            score: matchDetails?.awayScore?.current?.toString() ?? "0",
            img: resolveSportImage(matchDetails.awayTeam.name),
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
  } as FootballMatchPage;
}

export async function footballMatchesByDate(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("football", date)
    : fetchFootballMatchesByDate(date));

  if (!matches) {
    return null;
  }

  const validLeagueIds = FOOTBALL_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    FOOTBALL_LEAGUES.map((l) => [
      Number(l.slug),
      { name: l.name, currentSeason: l.seasons[0].slug },
    ]),
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
      const roundLabel = leagueIdToName[leagueId]?.name ?? "";
      const seasonId = leagueIdToName[leagueId]?.currentSeason ?? "";
      return {
        matches: matches.events
          .filter((item) => item.tournament.uniqueTournament.id === leagueId)
          .map((match) => {
            let startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel: roundLabel,
              timer:
                match.status.type === "notstarted"
                  ? startDate
                  : match.status.description,
              timerDisplayColour:
                match.status.type === "inprogress" ? "green" : "gray",
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.FOOTBALL,
              status: match.status.description,
              venue: "",
              summaryText: setMatchSummary(
                match.status.type,
                match.homeTeam.name,
                match.homeScore.current,
                match.awayTeam.name,
                match.awayScore.current,
              ),
              homeDetails: {
                name: shortenTeamNames(match.homeTeam.name),
                score: match.homeScore.current?.toString() ?? "0",
                img: resolveSportImage(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveSportImage(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: roundLabel,
        roundSlug: `${SPORT.FOOTBALL}/${leagueId}/${seasonId}`,
      } as FixtureRound;
    }),

    currentRound: leagueIdToName[rounds[0]]?.name ?? "",
  } as FootballTodayPage;
}

export async function footballBrackets(tournamentId: number, seasonId: number) {
  const trees = await (
    process.env.DEV_MODE ? fetchCupTrees : fetchFootballCupTrees
  )(tournamentId, seasonId);
  // const trees = testdata;

  console.log("🟢 Starting footballBrackets processing...");
  console.log("Trees count:", trees?.cupTrees?.length);

  if (!trees) {
    return null;
  }

  console.log("Creating tempBrackets...");
  const tempBrackets = trees.cupTrees.map((tree) => {
    console.log(`Processing tree: ${tree.name}, rounds: ${tree.rounds.length}`);
    return {
      id: tree.id,
      name: tree.name,
      currentRound: tree.currentRound,
      matches: tree.rounds.flatMap((round, roundIndex) =>
        round.blocks.map(
          (match) =>
            ({
              id: match.blockId,
              nextMatchId: null,
              participants: match.participants.map((team, teamIndex) => ({
                id: team.team.id,
                isWinner: team.winner,
                name: team.team.name,
                resultText:
                  teamIndex === 0 ? match.homeTeamScore : match.awayTeamScore,
                status: match.finished ? "PLAYED" : "SCHEDULED",
              })),
              startTime: match.seriesStartDateTimestamp?.toString(),
              tournamentRoundText: (roundIndex + 1).toString(),
              state: match.finished ? "PLAYED" : "SCHEDULED",
              name: "",
              href: `./${match?.events?.[0] ?? ""}`,
            }) as BracketMatch,
        ),
      ),
    };
  });
  console.log(
    "tempBrackets created, total matches:",
    tempBrackets.flatMap((b) => b.matches).length,
  );

  console.log("Setting up nextMatchId connections...");
  // Build a lookup map first to avoid O(n²) complexity
  const matchMap = new Map();
  tempBrackets.forEach((bracket) => {
    bracket.matches.forEach((match) => {
      matchMap.set(match.id, match);
    });
  });

  trees.cupTrees.forEach((tree) => {
    tree.rounds.forEach((round) => {
      round.blocks.forEach((match) => {
        match.participants.forEach((team) => {
          if (team.sourceBlockId) {
            const matchToUpdate = matchMap.get(team.sourceBlockId);
            if (matchToUpdate) {
              matchToUpdate.nextMatchId = match.blockId;
            }
          }
        });
      });
    });
  });

  console.log("footballBrackets processing complete");
  return {
    brackets: tempBrackets,
  } as FootballBracketPage;
}
