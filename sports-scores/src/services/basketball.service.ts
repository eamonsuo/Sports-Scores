import {
  BasketballStanding,
  BasketballTeamStanding,
} from "@/components/basketball/BasketballLadder";
import {
  fetchBasketballLastMatches,
  fetchBasketballMatchDetails,
  fetchBasketballMatchesByDate,
  fetchBasketballMatchIncidents,
  fetchBasketballNextMatches,
  fetchBasketballStandings,
} from "@/endpoints/basketball.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import { BASKETBALL_LEAGUES } from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import {
  BasketballFixturesPage,
  BasketballLadderPage,
  BasketballMatchPage,
  BasketballTodayPage,
} from "@/types/basketball";
import { DISPLAY_TYPES, FixtureRound, MatchSummary, SPORT } from "@/types/misc";
import { addHours, format } from "date-fns";

export async function basketballMatches(
  tournamentId: number,
  seasonId: number,
) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchBasketballLastMatches
  )(tournamentId, seasonId, 0);

  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchBasketballNextMatches
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

  const displayType =
    BASKETBALL_LEAGUES.find((l) => Number(l.slug) === tournamentId)?.display ??
    "round";

  function getMatchDate(match: any) {
    let startDate = new Date(0);
    startDate.setUTCSeconds(match.startTimestamp);
    startDate = addHours(startDate, 10);
    return format(startDate, "eee d MMM");
  }

  let rounds = [];
  if (displayType === DISPLAY_TYPES.ROUND) {
    rounds = [
      ...new Set(
        matches.map((item) => item.roundInfo?.name ?? item.roundInfo?.round),
      ),
    ].filter((round) => round !== undefined);
  } else {
    rounds = [
      ...new Set(
        matches
          .sort((a, b) => a.startTimestamp - b.startTimestamp)
          .map((item) => getMatchDate(item)),
      ),
    ];
  }

  return {
    fixtures: rounds.map((round) => {
      //Get all teams playing in the round
      let teams = matches
        .filter((item) =>
          displayType === DISPLAY_TYPES.ROUND
            ? item.roundInfo?.round === round || item.roundInfo?.name === round
            : getMatchDate(item) === round,
        )
        .flatMap((game) => [game.homeTeam.name, game.awayTeam.name]);

      return {
        matches: matches
          .filter((item) =>
            displayType === DISPLAY_TYPES.ROUND
              ? item.roundInfo?.round === round ||
                item.roundInfo?.name === round
              : getMatchDate(item) === round,
          )
          .map((match) => {
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel:
                match.roundInfo?.name ?? `Round ${match.roundInfo?.round}`,
              timer:
                match.status.type === "notstarted"
                  ? toShortTimeString(startDate)
                  : match.status.description,
              timerDisplayColour:
                match.status.type === "inprogress" ? "green" : "gray",
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.BASKETBALL,
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
        roundLabel: typeof round === "string" ? round : `Round ${round}`,
        // byes: NRL_TEAM_NAMES.filter((x) => !teams.includes(x)).map((team) => {
        //   return { name: team, img: resolveNRLImages(team) };
        // }),
      } as FixtureRound;
    }),

    currentRound: (() => {
      if (displayType === DISPLAY_TYPES.ROUND) {
        if (nextMatches !== null && nextMatches.events.length > 0) {
          if (nextMatches?.events[0]?.roundInfo?.name !== undefined) {
            return nextMatches?.events[0]?.roundInfo?.name;
          } else {
            const round = nextMatches?.events[0]?.roundInfo?.round ?? 0;
            return `Round ${round}`;
          }
        } else {
          return lastMatches?.events[lastMatches?.events.length - 1]?.roundInfo
            ?.name;
        }
      } else {
        let startDate = new Date();
        startDate = addHours(startDate, 10);
        return rounds.includes(format(startDate, "eee d MMM"))
          ? format(startDate, "eee d MMM")
          : rounds[0];
      }
    })(),
  } as BasketballFixturesPage;
}

export async function basketballStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchBasketballStandings
  )(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings
      // .sort((a, b) => b.name.localeCompare(a.name))
      .map((table) => {
        return {
          tableName: table.name,
          standings: table.rows.map((standing) => {
            return {
              position: standing.position,
              played: standing.matches,
              won: standing.wins,
              lost: standing.losses,
              // ties: standing.draws,
              team: {
                id: standing.team.id,
                name: shortenTeamNames(standing.team.name),
                logo: resolveSportImage(standing.team.name),
              },
              points: {
                for: standing.scoresFor,
                against: standing.scoresAgainst,
              },
              pct: standing.percentage,
            } as BasketballTeamStanding;
          }),
        } as BasketballStanding;
      }),

    qualifyingPosition:
      BASKETBALL_LEAGUES.find((l) => Number(l.slug) === tournamentId)
        ?.qualifyingPosition ?? -1,
  } as BasketballLadderPage;
}

export async function basketballMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchBasketballMatchDetails
  )(matchId);
  const incidents = await (
    process.env.DEV_MODE ? fetchEventIncidents : fetchBasketballMatchIncidents
  )(matchId);

  const matchDetails = match?.event;
  const scoreIncidents = incidents?.incidents
    ? incidents?.incidents
        .filter((item) => item.incidentType === "goal")
        .toReversed()
    : null;

  let scoreDetails = !matchDetails
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
            periodName: "Q1",
            teams: {
              home: { score: matchDetails.homeScore?.period1 ?? "0" },
              away: { score: matchDetails.awayScore?.period1 ?? "0" },
            },
          },
          {
            periodName: "Q2",
            teams: {
              home: { score: matchDetails.homeScore?.period2 ?? "0" },
              away: { score: matchDetails.awayScore?.period2 ?? "0" },
            },
          },
          {
            periodName: "Q3",
            teams: {
              home: { score: matchDetails.homeScore?.period3 ?? "0" },
              away: { score: matchDetails.awayScore?.period3 ?? "0" },
            },
          },
          {
            periodName: "Q4",
            teams: {
              home: { score: matchDetails.homeScore?.period4 ?? "0" },
              away: { score: matchDetails.awayScore?.period4 ?? "0" },
            },
          },
        ],
      };

  if (scoreDetails && matchDetails?.homeScore.overtime) {
    scoreDetails.scoreBreakdown.push({
      periodName: "OT",
      teams: {
        home: { score: matchDetails.homeScore?.overtime ?? "0" },
        away: { score: matchDetails.awayScore?.overtime ?? "0" },
      },
    });
  }

  return {
    scoreEvents: !scoreIncidents
      ? null
      : scoreIncidents.map((item) => {
          return {
            event: item.incidentClass,
            difference: (item.homeScore ?? 0) - (item.awayScore ?? 0),
          };
        }),
    matchDetails: scoreDetails,
  } as BasketballMatchPage;
}

export async function basketballMatchesByDate(
  date: Date,
  // categoryId: number,
) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("basketball", date)
    : fetchBasketballMatchesByDate(date));

  if (!matches) {
    return null;
  }

  const validLeagueIds = BASKETBALL_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    BASKETBALL_LEAGUES.map((l) => [
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
              sport: SPORT.BASKETBALL,
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
        roundSlug: `${SPORT.BASKETBALL}/${leagueId}/${seasonId}`,
      } as FixtureRound;
    }),

    currentRound: leagueIdToName[rounds[0]]?.name ?? "",
  } as BasketballTodayPage;
}
