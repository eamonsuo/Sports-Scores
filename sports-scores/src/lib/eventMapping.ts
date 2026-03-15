import { LeagueSeasonConfig } from "@/components/all-sports/LeagueSeasonToggle";
import {
  API_EVENT_TYPES,
  DeepPartial,
  DISPLAY_TYPES,
  FixtureRound,
  MatchStatus,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { SportsDB_Event } from "@/types/sportsdb";
import { format } from "date-fns/format";
import { resolveSportImage } from "./imageMapping";
import { setMatchSummary, shortenTeamNames } from "./projUtils";

export function mapMatchSummary(
  type: API_EVENT_TYPES,
  sport: SPORT,
  event: any,
  options?: DeepPartial<MatchSummary>,
) {
  switch (type) {
    case API_EVENT_TYPES.SOFASCORE:
      return mapSofascoreEventToMatchSummary(sport, event, options);
    case API_EVENT_TYPES.SPORTSDB:
      return mapSportsDBEventToMatchSummary(sport, event, options);
    case API_EVENT_TYPES.SPORTSMONKS_CRICKET:
    default:
      return {
        id: Math.random().toString(),
        sport: sport,
        summaryText: "",
        status: "UPCOMING",
        startDate: new Date(),
        awayDetails: {},
        homeDetails: {},
        ...options,
      } as MatchSummary;
  }
}

function mapSofascoreEventToMatchSummary(
  sport: SPORT,
  event: Sofascore_Event,
  options?: DeepPartial<MatchSummary>,
): MatchSummary {
  var startDate = new Date(0);
  startDate.setUTCSeconds(event.startTimestamp);

  return {
    id: options?.id ?? event.id.toString(),
    startDate: options?.startDate ?? startDate,
    endDate: options?.endDate,
    sport: sport,
    status:
      options?.status ??
      (event.status.type === "inprogress" || event.status.type === "interrupted"
        ? "LIVE"
        : event.status.type === "notstarted"
          ? "UPCOMING"
          : "COMPLETED"),
    roundLabel: options?.roundLabel ?? `Round ${event.roundInfo?.round}`,
    timer:
      options?.timer ??
      (event.status.type === "notstarted"
        ? (options?.startDate ?? startDate)
        : event.status.description),
    timerDisplayColour:
      options?.timerDisplayColour ??
      (event.status.type === "inprogress" || event.status.type === "interrupted"
        ? "green"
        : "gray"),
    matchSlug:
      options?.matchSlug ??
      `${event.tournament.uniqueTournament.id}/${event.season.id}/${event.id}`,
    venue: options?.venue ?? event?.venue?.name ?? "",
    seriesName: options?.seriesName,
    seriesSlug: options?.seriesSlug,
    summaryText:
      options?.summaryText ??
      setMatchSummary(
        event.status.type,
        event.homeTeam.name,
        event.homeScore.current,
        event.awayTeam.name,
        event.awayScore.current,
      ),
    homeDetails: {
      name: options?.homeDetails?.name ?? shortenTeamNames(event.homeTeam.name),
      score:
        options?.homeDetails?.score ??
        event.homeScore.current?.toString() ??
        "0",
      img: options?.homeDetails?.img ?? resolveSportImage(event.homeTeam.name),
      winDrawLoss: options?.homeDetails?.winDrawLoss,
    },
    awayDetails: {
      name: options?.awayDetails?.name ?? shortenTeamNames(event.awayTeam.name),
      score:
        options?.awayDetails?.score ??
        event.awayScore.current?.toString() ??
        "0",
      img: options?.awayDetails?.img ?? resolveSportImage(event.awayTeam.name),
      winDrawLoss: options?.awayDetails?.winDrawLoss,
    },
    seasonId: options?.seasonId ?? event.season.id.toString(),
    tournamentId:
      options?.tournamentId ?? event.tournament.uniqueTournament.id.toString(),
  };
}

function mapSportsDBEventToMatchSummary(
  sport: SPORT,
  event: SportsDB_Event,
  options?: DeepPartial<MatchSummary>,
): MatchSummary {
  const timeStamp =
    event.strTimestamp.length > 19
      ? event.strTimestamp.slice(0, 19)
      : event.strTimestamp;
  const startDate = new Date(timeStamp + "Z");

  const status: MatchStatus =
    event.intHomeScore !== null && event.intAwayScore !== null
      ? "COMPLETED"
      : "UPCOMING";

  return {
    id: options?.id ?? event.idEvent,
    startDate: options?.startDate ?? startDate,
    endDate: options?.endDate,
    sport: sport,
    status: options?.status ?? status,
    roundLabel: options?.roundLabel ?? `Round ${event.intRound}`,
    timer:
      options?.timer ??
      (status === "UPCOMING" ? (options?.startDate ?? startDate) : "Ended"),
    timerDisplayColour: options?.timerDisplayColour ?? "gray",
    matchSlug:
      options?.matchSlug ??
      `${event.idLeague}/${event.strSeason}/${event.idEvent}`,
    venue: options?.venue ?? event?.strVenue ?? "",
    seriesName: options?.seriesName,
    seriesSlug: options?.seriesSlug,
    summaryText:
      options?.summaryText ??
      setMatchSummary(
        status === "UPCOMING" ? "notstarted" : "finished",
        event.strHomeTeam,
        event.intHomeScore ?? 0,
        event.strAwayTeam,
        event.intAwayScore ?? 0,
      ),
    homeDetails: {
      name: options?.homeDetails?.name ?? shortenTeamNames(event.strHomeTeam),
      score:
        options?.homeDetails?.score ?? (event.intHomeScore ?? 0).toString(),
      img: options?.homeDetails?.img ?? event.strHomeTeamBadge,
      winDrawLoss: options?.homeDetails?.winDrawLoss,
    },
    awayDetails: {
      name: options?.awayDetails?.name ?? shortenTeamNames(event.strAwayTeam),
      score:
        options?.awayDetails?.score ?? (event.intAwayScore ?? 0).toString(),
      img: options?.awayDetails?.img ?? event.strAwayTeamBadge,
      winDrawLoss: options?.awayDetails?.winDrawLoss,
    },
    seasonId: options?.seasonId ?? event.strSeason,
    tournamentId: options?.tournamentId ?? event.idLeague,
  };
}

export function mapFixtureRound(
  type: API_EVENT_TYPES,
  sport: SPORT,
  leagueConfig: LeagueSeasonConfig | LeagueSeasonConfig[],
  matches: any[],
  matchesMapper: (match: any, roundLabel: string) => MatchSummary,
  extraMatches?: MatchSummary[],
) {
  switch (type) {
    case API_EVENT_TYPES.SOFASCORE:
      return mapSofascoreEventsToFixtureRounds(
        sport,
        leagueConfig,
        matches,
        matchesMapper,
        extraMatches,
      );
    case API_EVENT_TYPES.SPORTSDB:
      return mapSportsDBEventsToFixtureRounds(
        sport,
        leagueConfig,
        matches,
        matchesMapper,
        extraMatches,
      );
    case API_EVENT_TYPES.SPORTSMONKS_CRICKET:
    default:
      return [
        {
          matches: matches.map((match) => matchesMapper(match, "")),
          roundLabel: "",
        } as FixtureRound,
      ];
  }
}

function mapSofascoreEventsToFixtureRounds(
  sport: SPORT,
  leagueConfig: LeagueSeasonConfig | LeagueSeasonConfig[],
  matches: Sofascore_Event[],
  matchesMapper: (match: Sofascore_Event, roundLabel: string) => MatchSummary,
  extraMatches?: MatchSummary[],
) {
  const isMultiLeague = Array.isArray(leagueConfig);
  const displayType: DISPLAY_TYPES = isMultiLeague
    ? DISPLAY_TYPES.LEAGUE
    : (leagueConfig.display ?? DISPLAY_TYPES.ROUND);
  const byes = isMultiLeague ? undefined : leagueConfig.byes;
  const showByes = byes !== undefined;

  // Create rounds object { round: string; matches: Sofascore_Event[]; byes: { name: string; img: string }[] }
  const tempRounds = Object.values(
    matches.reduce(
      (acc, match) => {
        let round = "";
        switch (displayType) {
          case DISPLAY_TYPES.ROUND:
            round =
              match.roundInfo?.name ?? `Round ${match.roundInfo?.round ?? 0}`;
            break;
          case DISPLAY_TYPES.DATE:
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);
            round = format(startDate, "eee d MMM");
            break;
          case DISPLAY_TYPES.LEAGUE:
            round = isMultiLeague
              ? (leagueConfig.find(
                  (l) =>
                    l.slug === match.tournament.uniqueTournament.id.toString(),
                )?.name ?? match.tournament.name)
              : match.tournament.name;
            break;
        }

        if (round !== undefined) {
          if (!acc[round]) {
            acc[round] = { round, matches: [], byes: byes };
          }

          acc[round].matches.push(match);
          acc[round].roundSlug =
            displayType === DISPLAY_TYPES.LEAGUE
              ? `${sport}/${match.tournament.uniqueTournament.id}/${match.season.id}`
              : undefined;
          if (showByes) {
            acc[round].byes = acc[round]?.byes?.filter(
              (team) =>
                team.name !== match.homeTeam.name &&
                team.name !== match.awayTeam.name,
            );
          }
        }
        return acc;
      },
      {} as Record<
        string,
        {
          round: string;
          matches: Sofascore_Event[];
          byes?: { name: string; img: string }[];
          roundSlug?: string;
        }
      >,
    ),
  );

  const fixture = tempRounds.map((roundData) => {
    return {
      matches: roundData.matches.map((match) =>
        matchesMapper(match, roundData.round),
      ),
      roundLabel: roundData.round,
      byes: roundData.byes,
      roundSlug: roundData.roundSlug,
    } as FixtureRound;
  });

  mergeExtraMatches(fixture, extraMatches, byes);
  return fixture;
}

function mapSportsDBEventsToFixtureRounds(
  sport: SPORT,
  leagueConfig: LeagueSeasonConfig | LeagueSeasonConfig[],
  matches: SportsDB_Event[],
  matchesMapper: (match: SportsDB_Event, roundLabel: string) => MatchSummary,
  extraMatches?: MatchSummary[],
) {
  const isMultiLeague = Array.isArray(leagueConfig);
  const displayType: DISPLAY_TYPES = isMultiLeague
    ? DISPLAY_TYPES.LEAGUE
    : (leagueConfig.display ?? DISPLAY_TYPES.ROUND);
  const byes = isMultiLeague ? undefined : leagueConfig.byes;
  const showByes = byes !== undefined;

  // Create rounds object { round: string; matches: SportsDB_Event[]; byes: { name: string; img: string }[] }
  const tempRounds = Object.values(
    matches.reduce(
      (acc, match) => {
        let round = "";
        switch (displayType) {
          case DISPLAY_TYPES.ROUND:
            round = `Round ${match.intRound ?? 0}`;
            break;
          case DISPLAY_TYPES.DATE:
            const startDate = new Date(match.strTimestamp + "Z");

            round = format(startDate, "eee d MMM");
            break;
          case DISPLAY_TYPES.LEAGUE:
            round = match.strLeague;
            break;
        }

        if (round !== undefined) {
          if (!acc[round]) {
            acc[round] = showByes
              ? { round, matches: [], byes: byes }
              : { round, matches: [] };
          }

          acc[round].matches.push(match);
          acc[round].roundSlug = sport
            ? `${sport}/${match.idLeague}/${match.strSeason}`
            : undefined;
          // if (showByes) {
          //   acc[round].byes = acc[round]?.byes?.filter(
          //     (team) =>
          //       team.name !== match.homeTeam.name &&
          //       team.name !== match.awayTeam.name,
          //   );
          // }
        }
        return acc;
      },
      {} as Record<
        string,
        {
          round: string;
          matches: SportsDB_Event[];
          byes?: { name: string; img: string }[];
          roundSlug?: string;
        }
      >,
    ),
  );

  const fixture = tempRounds.map((roundData) => {
    return {
      matches: roundData.matches.map((match) =>
        matchesMapper(match, roundData.round),
      ),
      roundLabel: roundData.round,
      byes: roundData.byes,
      roundSlug: roundData.roundSlug,
    } as FixtureRound;
  });

  mergeExtraMatches(fixture, extraMatches);
  return fixture;
}

function mergeExtraMatches(
  fixture: FixtureRound[],
  extraMatches?: MatchSummary[],
  teamForByes?: { name: string; img: string }[],
) {
  if (!extraMatches || extraMatches.length === 0) return;

  const existingIds = new Set(
    fixture.flatMap((r) => r.matches.map((m) => m.id)),
  );
  const newMatches = extraMatches.filter((m) => !existingIds.has(m.id));

  for (const match of newMatches) {
    const label = match.roundLabel ?? "";
    const existing = fixture.find((r) => r.roundLabel === label);
    if (existing) {
      existing.matches.push(match);
    } else {
      fixture.push({ roundLabel: label, matches: [match] });
    }
  }

  // Sort matches within each round by startDate
  for (const round of fixture) {
    round.matches.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }

  // Sort rounds by their earliest match startDate
  fixture.sort((a, b) => {
    const aTime = Math.min(
      ...a.matches.map((m) => new Date(m.startDate).getTime()),
    );
    const bTime = Math.min(
      ...b.matches.map((m) => new Date(m.startDate).getTime()),
    );
    return aTime - bTime;
  });

  // Recompute byes: teams from teamForByes not playing in the round
  if (teamForByes && teamForByes.length > 0) {
    for (const round of fixture) {
      const playingTeams = new Set(
        round.matches.flatMap((m) => [m.homeDetails.name, m.awayDetails.name]),
      );
      round.byes = teamForByes.filter(
        (team) => !playingTeams.has(shortenTeamNames(team.name)),
      );
    }
  }
}

export function getCurrentRound(
  leagueConfig: DISPLAY_TYPES,
  rounds: FixtureRound[],
) {
  switch (leagueConfig) {
    case DISPLAY_TYPES.ROUND:
    case DISPLAY_TYPES.DATE:
      // Find first round with upcoming matches
      return (
        rounds.find((r) =>
          r.matches.some((m) => m.status === "UPCOMING" || m.status === "LIVE"),
        )?.roundLabel ??
        rounds[rounds.length - 1]?.roundLabel ??
        "Round 0"
      );

    case DISPLAY_TYPES.LEAGUE:
      return rounds[0].roundLabel ?? "League";
  }
}
