import { Match as BracketMatch } from "@/components/bracket/types";
import {
  fetchCupTrees,
  fetchEventDetails,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchTeamLastEvents,
  fetchTeamNextEvents,
} from "@/endpoints/sofascore.api";
import {
  fetchTennisATPRankings,
  fetchTennisBracket,
  fetchTennisMatchDetails,
  fetchTennisMatchesByDate,
  fetchTennisPlayerLastMatches,
  fetchTennisPlayerNextMatches,
  fetchTennisTournamentLastMatches,
  fetchTennisTournamentNextMatches,
  fetchTennisWTARankings,
} from "@/endpoints/tennis.api";
import { TENNIS_CATEGORIES, TENNIS_LEAGUES } from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { setTennisMatchSummary, shortenTeamNames } from "@/lib/projUtils";
import { FixtureRound, MatchSummary, SPORT } from "@/types/misc";
import {
  Tennis_Sofascore_Event,
  TennisBracketPage,
  TennisFixturesPage,
  TennisMatchPage,
  TennisRankingPage,
  TennisTeamFixturesPage,
  TennisTodayPage,
} from "@/types/tennis";

export async function tennisTournamentMatches(
  tournamentId: number,
  seasonId: number,
) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchTennisTournamentLastMatches
  )(tournamentId, seasonId);

  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchTennisTournamentNextMatches
  )(tournamentId, seasonId);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  for (let i = 1; i < matches.length; i++) {
    if (matches[i].roundInfo === undefined) {
      matches[i].roundInfo = { round: 0, name: "Unknown" };
    }
  }

  const rounds = [...new Set(matches.map((item) => item.roundInfo?.name))];

  return {
    fixtures: rounds.map((round) => {
      return {
        matches: matches
          .filter(
            (item) =>
              item.roundInfo?.name === round && item.status.type !== "canceled",
          )
          .map((match) => {
            return mapTennisMatches(match);
          }),
        roundLabel: `${round}`,
        cardVariant: "tennis",
      } as FixtureRound;
    }),

    currentRound: `${
      nextMatches?.events?.[0]?.roundInfo?.name ??
      lastMatches?.events?.[lastMatches?.events.length - 1]?.roundInfo?.name ??
      0
    }`,
  } as TennisFixturesPage;
}

export async function TennisPlayerMatches(teamId: number) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchTeamLastEvents : fetchTennisPlayerLastMatches
  )(teamId, 0);

  const nextMatches = await (
    process.env.DEV_MODE ? fetchTeamNextEvents : fetchTennisPlayerNextMatches
  )(teamId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  return {
    fixtures: matches
      .toReversed()

      .map((match) => {
        return mapTennisMatches(match);
      }),
  } as TennisTeamFixturesPage;
}

// export async function TennisStandings(tournamentId: number, seasonId: number) {
//   const standings = await fetchTennisStandings(tournamentId, seasonId);

//   if (!standings) {
//     return null;
//   }

//   return {
//     standings: standings?.standings[0].rows.map((item) => {
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
//       } as TennisStanding;
//     }),
//     qualifyingPosition:
//       TENNIS_LEAGUES.find((l) => Number(l.slug) === tournamentId)
//         ?.qualifyingPosition ?? -1,
//   } as TennisLadderPage;
// }

export async function TennisMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchTennisMatchDetails
  )(matchId);
  // const incidents = await fetchTennisMatchIncidents(matchId);

  const matchDetails = match?.event;
  // const scoreIncidents = incidents?.incidents
  //   ? incidents?.incidents
  //       .filter((item) => item.incidentType === "goal")
  //       .toReversed()
  //   : null;

  return {
    // scoreEvents: !scoreIncidents
    //   ? null
    //   : scoreIncidents.map((item) => {
    //       return {
    //         event: item.incidentClass,
    //         difference: (item.homeScore ?? 0) - (item.awayScore ?? 0),
    //       };
    //     }),
    matchDetails: !matchDetails
      ? null
      : {
          status: matchDetails?.status.description,
          homeTeam: {
            name: shortenTeamNames(matchDetails.homeTeam.name),
            score: matchDetails?.homeScore?.current?.toString() ?? "0",
            img: resolveSportImage(
              matchDetails.homeTeam.country.name ?? matchDetails.homeTeam.name,
            ),
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails?.awayTeam.name),
            score: matchDetails?.awayScore?.current?.toString() ?? "0",
            img: resolveSportImage(
              matchDetails.awayTeam.country.name ?? matchDetails.awayTeam.name,
            ),
          },
          scoreBreakdown: [
            {
              periodName: "1st",
              teams: {
                home: { score: matchDetails.homeScore?.period1 ?? "0" },
                away: { score: matchDetails.awayScore?.period1 ?? "0" },
              },
            },
            {
              periodName: "2nd",
              teams: {
                home: { score: matchDetails.homeScore?.period2 ?? "0" },
                away: { score: matchDetails.awayScore?.period2 ?? "0" },
              },
            },
            matchDetails.homeScore?.period3
              ? {
                  periodName: "3rd",
                  teams: {
                    home: { score: matchDetails.homeScore?.period3 ?? "0" },
                    away: { score: matchDetails.awayScore?.period3 ?? "0" },
                  },
                }
              : null,
            matchDetails.homeScore?.period4
              ? {
                  periodName: "4th",
                  teams: {
                    home: { score: matchDetails.homeScore?.period4 ?? "0" },
                    away: { score: matchDetails.awayScore?.period4 ?? "0" },
                  },
                }
              : null,
            matchDetails.homeScore?.period5
              ? {
                  periodName: "5th",
                  teams: {
                    home: { score: matchDetails.homeScore?.period5 ?? "0" },
                    away: { score: matchDetails.awayScore?.period5 ?? "0" },
                  },
                }
              : null,
          ].filter((set) => set !== null),
        },
  } as TennisMatchPage;
}

export async function TennisMatchesByDate(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("tennis", date)
    : fetchTennisMatchesByDate(date));

  if (!matches) {
    return null;
  }

  const validLeagueIds = TENNIS_CATEGORIES.concat(TENNIS_LEAGUES).map((l) =>
    Number(l.slug),
  );
  const leagueIdToName = Object.fromEntries(
    TENNIS_CATEGORIES.concat(TENNIS_LEAGUES).map((l) => [
      Number(l.slug),
      l.name,
    ]),
  );

  const filteredMatches = matches.events.filter(
    (item) =>
      (validLeagueIds.includes(item.tournament.category.id) ||
        validLeagueIds.includes(item.tournament.uniqueTournament.id)) &&
      item.status.type !== "canceled",
  );

  const aussieMatches = matches.events.filter(
    (item) =>
      (item.homeTeam.country.name === "Australia" ||
        item.awayTeam.country.name === "Australia") &&
      item.status.type !== "canceled",
  );

  // Get unique league ids in order
  const rounds = [
    ...new Set(filteredMatches.map((item) => item.tournament.category.id)),
  ];

  let firstTournament = "";

  return {
    fixtures: rounds
      .map((leagueId) => {
        const roundLabel = leagueIdToName[leagueId] ?? "Other";
        return {
          matches: filteredMatches
            .filter((item) => item.tournament.category.id === leagueId)
            .map((match) => {
              if (firstTournament === "") {
                firstTournament = roundLabel;
              }

              return mapTennisMatches(match);
            })
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),

          roundLabel: roundLabel,
          cardVariant: "tennis",
          roundSlug: `${SPORT.TENNIS}/today`,
        } as FixtureRound;
      })
      .concat({
        matches: aussieMatches
          .map(mapTennisMatches)
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
        roundLabel: "Australians",
        cardVariant: "tennis",
        roundSlug: `${SPORT.TENNIS}/today`,
      } as FixtureRound),

    currentRound: firstTournament,
  } as TennisTodayPage;
}

export async function tennisBrackets(tournamentId: number, seasonId: number) {
  const trees = await (
    process.env.DEV_MODE ? fetchCupTrees : fetchTennisBracket
  )(tournamentId, seasonId);

  if (!trees) {
    return null;
  }

  const tempBrackets = trees.cupTrees.map((tree) => {
    return {
      id: tree.id,
      name: tree.name,
      currentRound: tree.currentRound,
      matches: tree.rounds.flatMap((round, roundIndex) =>
        round.blocks.map((match) => {
          let startDate = new Date(0);
          startDate.setUTCSeconds(match.seriesStartDateTimestamp ?? 0);
          return {
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
            startTime: startDate,
            tournamentRoundText: (roundIndex + 1).toString(),
            state: match.finished ? "PLAYED" : "SCHEDULED",
            name: "",
            href: `./${match?.events?.[0] ?? ""}`,
          } as BracketMatch;
        }),
      ),
    };
  });

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

  return {
    brackets: tempBrackets,
  } as TennisBracketPage;
}

const RANKING_LIST = {
  WTA: "wta",
  ATP: "atp",
} as const;

type RankingList = (typeof RANKING_LIST)[keyof typeof RANKING_LIST];

export async function TennisWorldRankings(rankingList: RankingList) {
  let rankings;
  if (process.env.DEV_MODE) {
    // rankings = await fetchPlayerRankings(rankingList);
  } else {
    switch (rankingList) {
      case RANKING_LIST.WTA:
        rankings = await fetchTennisWTARankings();
        break;
      case RANKING_LIST.ATP:
        rankings = await fetchTennisATPRankings();
        break;
      default:
        return null;
    }
  }

  if (!rankings) {
    return null;
  }

  return {
    players: rankings.rankings.map((rank) => ({
      name: rank.rowName,
      position: rank.ranking,
      img: resolveSportImage(rank.team.country.name ?? rank.team.name),
      totalPoints: rank.points,
      previousRank: rank.previousRanking,
    })),
  } as TennisRankingPage;
}

function mapTennisMatches(match: Tennis_Sofascore_Event) {
  let startDate = new Date(0);
  startDate.setUTCSeconds(match.startTimestamp);
  return {
    startDate: startDate,
    roundLabel: `${match.roundInfo?.name}`,
    timer:
      match.status.type === "notstarted" ? startDate : match.status.description,
    timerDisplayColour: match.status.type === "inprogress" ? "green" : "gray",
    id: match.id,
    matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
    sport: SPORT.TENNIS,
    status: match.status.description,
    venue: "",
    otherDetail: match.roundInfo?.name ?? undefined,
    summaryText: setTennisMatchSummary(
      match.status.type,
      match.winnerCode,
      match.homeTeam.name,
      match.awayTeam.name,
      match.homeScore.current ?? 0,
      match.awayScore.current ?? 0,
    ),
    seriesName: `${match.tournament.category.name} ${match.tournament.uniqueTournament?.tennisPoints ?? ""} - ${match.tournament.name}`,
    seriesSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}`,
    homeDetails: {
      name:
        `${match.homeTeamSeed ? match.homeTeamSeed + " " : ""}` +
        shortenTeamNames(match.homeTeam.name),
      score: [
        match.homeScore.period1 !== undefined
          ? `${match.homeScore.period1}${match.homeScore.period1TieBreak !== undefined ? ` (${match.homeScore.period1TieBreak})` : ""}`
          : null,
        match.homeScore.period2 !== undefined
          ? `${match.homeScore.period2}${match.homeScore.period2TieBreak !== undefined ? ` (${match.homeScore.period2TieBreak})` : ""}`
          : null,
        match.homeScore.period3 !== undefined
          ? `${match.homeScore.period3}${match.homeScore.period3TieBreak !== undefined ? ` (${match.homeScore.period3TieBreak})` : ""}`
          : null,
        match.homeScore.period4 !== undefined
          ? `${match.homeScore.period4}${match.homeScore.period4TieBreak !== undefined ? ` (${match.homeScore.period4TieBreak})` : ""}`
          : null,
        match.homeScore.period5 !== undefined
          ? `${match.homeScore.period5}${match.homeScore.period5TieBreak !== undefined ? ` (${match.homeScore.period5TieBreak})` : ""}`
          : null,
      ].filter((s): s is string => s !== null),
      img: resolveSportImage(
        match.homeTeam.country.name ?? match.homeTeam.name,
      ),
    },
    awayDetails: {
      name:
        `${match.awayTeamSeed ? match.awayTeamSeed + " " : ""}` +
        shortenTeamNames(match.awayTeam.name),
      score: [
        match.awayScore.period1 !== undefined
          ? `${match.awayScore.period1}${match.awayScore.period1TieBreak !== undefined ? ` (${match.awayScore.period1TieBreak})` : ""}`
          : null,
        match.awayScore.period2 !== undefined
          ? `${match.awayScore.period2}${match.awayScore.period2TieBreak !== undefined ? ` (${match.awayScore.period2TieBreak})` : ""}`
          : null,
        match.awayScore.period3 !== undefined
          ? `${match.awayScore.period3}${match.awayScore.period3TieBreak !== undefined ? ` (${match.awayScore.period3TieBreak})` : ""}`
          : null,
        match.awayScore.period4 !== undefined
          ? `${match.awayScore.period4}${match.awayScore.period4TieBreak !== undefined ? ` (${match.awayScore.period4TieBreak})` : ""}`
          : null,
        match.awayScore.period5 !== undefined
          ? `${match.awayScore.period5}${match.awayScore.period5TieBreak !== undefined ? ` (${match.awayScore.period5TieBreak})` : ""}`
          : null,
      ].filter((s): s is string => s !== null),
      img: resolveSportImage(
        match.awayTeam.country.name ?? match.awayTeam.name,
      ),
    },
    winner: match.winnerCode,
  } as MatchSummary;
}

export async function TESTTennisMatchesByDate(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("tennis", date)
    : fetchTennisMatchesByDate(date));

  if (!matches) {
    return null;
  }

  const validLeagueIds = TENNIS_CATEGORIES.concat(TENNIS_LEAGUES).map((l) =>
    Number(l.slug),
  );
  const leagueIdToName = Object.fromEntries(
    TENNIS_CATEGORIES.concat(TENNIS_LEAGUES).map((l) => [
      Number(l.slug),
      l.name,
    ]),
  );

  const filteredMatches = matches.events.filter(
    (item) =>
      (validLeagueIds.includes(item.tournament.category.id) ||
        validLeagueIds.includes(item.tournament.uniqueTournament.id)) &&
      item.status.type !== "canceled",
  );

  const aussieMatches = matches.events.filter(
    (item) =>
      (item.homeTeam.country.name === "Australia" ||
        item.awayTeam.country.name === "Australia") &&
      item.status.type !== "canceled",
  );

  // Get unique league ids in order
  const roundsParent = [
    ...new Set(filteredMatches.map((item) => item.tournament.category.id)),
  ];

  let firstTournament = "";

  const aussieRoundsChild = [
    ...new Set(
      aussieMatches.map((item) => item.tournament.uniqueTournament.id),
    ),
  ];

  const fixtures = roundsParent
    .map((parent) => {
      const roundsChild = [
        ...new Set(
          filteredMatches
            .filter((item) => item.tournament.category.id === parent)
            .map((item) => item.tournament.uniqueTournament.id),
        ),
      ];

      let tourLabel = leagueIdToName[parent] ?? "Other";

      return {
        tourLabel: tourLabel,
        tournament: roundsChild.map((leagueId) => {
          let roundLabel = "";
          return {
            matches: filteredMatches
              .filter(
                (item) => item.tournament.uniqueTournament.id === leagueId,
              )
              .map((match) => {
                if (roundLabel === "") {
                  roundLabel = match.tournament.name;
                }
                if (firstTournament === "") {
                  firstTournament = roundLabel;
                }

                return mapTennisMatches(match);
              }),

            roundLabel,
            cardVariant: "tennis",
            roundSlug: `${SPORT.TENNIS}/today`,
          } as FixtureRound;
        }),
      };
    })
    .concat({
      tourLabel: "Australians",
      tournament: aussieRoundsChild.map((leagueId) => {
        let roundLabel = "";
        return {
          matches: aussieMatches
            .filter((item) => item.tournament.uniqueTournament.id === leagueId)
            .map((match) => {
              if (roundLabel === "") {
                roundLabel = match.tournament.name;
              }
              return mapTennisMatches(match);
            }),
          // .sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
          roundLabel,
          cardVariant: "tennis",
          roundSlug: `${SPORT.TENNIS}/today`,
        } as FixtureRound;
      }),
    });

  return { firstItem: fixtures[0].tourLabel, fixtures };
}
