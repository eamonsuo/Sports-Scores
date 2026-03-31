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
import { TZDate } from "@date-fns/tz/date";
import { format } from "date-fns/format";
import { resolveSportImage } from "./imageMapping";
import { setMatchSummary, shortenTeamNames } from "./projUtils";
import { getClientTimezone } from "./serverUtils";

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

export async function mapFixtureRounds(
  leagueConfig: LeagueSeasonConfig | LeagueSeasonConfig[],
  matches: MatchSummary[],
) {
  const isMultiLeague = Array.isArray(leagueConfig);
  const displayType: DISPLAY_TYPES = isMultiLeague
    ? DISPLAY_TYPES.LEAGUE
    : (leagueConfig.display ?? DISPLAY_TYPES.ROUND);
  const byes = isMultiLeague ? undefined : leagueConfig.byes;
  const showByes = byes !== undefined;
  const timezone = await getClientTimezone();

  return Object.values(
    matches.reduce(
      (acc, match) => {
        let roundLabel = "";
        switch (displayType) {
          case DISPLAY_TYPES.ROUND:
            roundLabel = match.roundLabel ?? "Round 0";
            break;
          case DISPLAY_TYPES.DATE:
            roundLabel =
              // match.roundLabel ??
              format(
                new TZDate(match.startDate, timezone ?? "UTC"),
                "eee d MMM",
              );
            break;
          case DISPLAY_TYPES.LEAGUE:
            roundLabel = isMultiLeague
              ? (leagueConfig.find((l) => l.slug === match.tournamentId)
                  ?.name ?? roundLabel)
              : (match.roundLabel ?? "");
            break;
        }

        if (!acc[roundLabel]) {
          acc[roundLabel] = { roundLabel, matches: [], byes: byes };
        }

        acc[roundLabel].matches.push(match);
        acc[roundLabel].roundSlug =
          displayType === DISPLAY_TYPES.LEAGUE
            ? `${match.sport}/${match.tournamentId}/${match.seasonId}`
            : undefined;
        if (showByes) {
          acc[roundLabel].byes = acc[roundLabel]?.byes?.filter(
            (team) =>
              shortenTeamNames(team.name ?? "") !== match.homeDetails.name &&
              shortenTeamNames(team.name ?? "") !== match.awayDetails.name,
          );
        }

        return acc;
      },
      {} as Record<string, FixtureRound>,
    ),
  );
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
