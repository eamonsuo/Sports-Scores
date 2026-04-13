import { Match as BracketMatch } from "@/components/bracket/types";
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
import { FOOTBALL_LADDER_HEADINGS, FOOTBALL_LEAGUES } from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
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
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

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

  const allMatches = (lastMatches?.events ?? [])
    .concat(nextMatches?.events ?? [])
    .map((event) =>
      mapFootballMatch(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const leagueConfig = FOOTBALL_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );

  const fixture = await mapFixtureRounds(allMatches, leagueConfig);

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(fixture, leagueConfig?.display),
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
        id: match.id.toString(),
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

  const leagueConfig = FOOTBALL_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );
  const headings = FOOTBALL_LADDER_HEADINGS;

  const seasonConfig = leagueConfig?.seasons.find(
    (s) => Number(s.slug) === seasonId,
  );

  return {
    standings: standings?.standings
      // .sort((a, b) => b.name.localeCompare(a.name))
      .map((table) => {
        return {
          tableName: table.name ?? "test",
          headings,
          data: table.rows.map((standing) => {
            return {
              position: standing.position,
              team: {
                id: standing.team.id,
                name: shortenTeamNames(standing.team.name),
                logo: resolveSportImage(standing.team.name),
              },
              P: standing.matches,
              W: standing.wins,
              D: standing.draws,
              L: standing.losses,
              Pts: standing.points,
            };
          }),
          placingCategories:
            leagueConfig?.ladderConfig?.[seasonConfig?.ladderConfig ?? 0]
              ?.placingCategories ?? [],
        };
      }),
  } as FootballLadderPage<typeof headings>;
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

  const timezone = date instanceof TZDate ? date.timeZone : "UTC";

  matches.events = matches.events
    .filter((item) => {
      const eventDate = new TZDate(item.startTimestamp * 1000, timezone);
      return isSameDay(eventDate, date);
    })
    .filter((item) =>
      validLeagueIds.includes(item.tournament.uniqueTournament.id),
    )
    .sort(
      (a, b) =>
        validLeagueIds.indexOf(a.tournament.uniqueTournament.id) -
        validLeagueIds.indexOf(b.tournament.uniqueTournament.id),
    );

  if (!matches.events || matches.events.length === 0) return null;

  const allMatches = matches.events.map((event) =>
    mapFootballMatch(
      event,
      event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
    ),
  );

  const fixture = await mapFixtureRounds(allMatches, FOOTBALL_LEAGUES);

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(fixture, DISPLAY_TYPES.LEAGUE),
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

function mapFootballMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.FOOTBALL, match, {
    roundLabel,
  });
}
