import {
  fetchAmericanFootballLastMatches,
  fetchAmericanFootballMatchDetails,
  fetchAmericanFootballCurrentMatches as fetchAmericanFootballMatchesByDate,
  fetchAmericanFootballMatchIncidents,
  fetchAmericanFootballNextMatches,
  fetchAmericanFootballStandings,
} from "@/endpoints/american-football.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import {
  AMERICAN_FOOTBALL_LADDER_HEADINGS,
  AMERICAN_FOOTBALL_LEAGUES,
} from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import {
  AmericanFootball_AmericanFootballApi_CategorySchedule_Response,
  AmericanFootball_Sofascore_Event,
  AmericanFootballFixturesPage,
  AmericanFootballLadderPage,
  AmericanFootballMatchPage,
} from "@/types/american-football";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";
import { SofascoreSport } from "./sofascore.service";

class AmericanFootballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchStandingsTotal,
        fetchLastEvents,
        fetchNextEvents,
        fetchEventDetails,
        fetchEventIncidents,
        fetchCupTrees: async () => null,
        fetchEventsByDate: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: async () => null,
        fetchTeamNextEvents: async () => null,
      },
      SPORT.AMERICAN_FOOTBALL,
      SofascoreSportURL.AMERICAN_FOOTBALL,
      AMERICAN_FOOTBALL_LEAGUES,
      AMERICAN_FOOTBALL_LADDER_HEADINGS,
    );
  }

  async americanFootballMatches(league: number, season: number) {
    const lastMatches = await (
      process.env.DEV_MODE ? fetchLastEvents : fetchAmericanFootballLastMatches
    )(league, season, 0);
    const nextMatches = await (
      process.env.DEV_MODE ? fetchNextEvents : fetchAmericanFootballNextMatches
    )(league, season, 0);

    if (!lastMatches && !nextMatches) {
      return null;
    }

    const allMatches = (
      (lastMatches?.events ?? []).concat(
        nextMatches?.events ?? [],
      ) as AmericanFootball_Sofascore_Event[]
    )
      .map((event) =>
        this.mapAmericanFootballMatch(
          event,
          event.roundInfo?.name ?? `Week ${event.roundInfo?.round}`,
        ),
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

    const leagueConfig = AMERICAN_FOOTBALL_LEAGUES.find(
      (l) => Number(l.slug) === league,
    );

    const fixture = await mapFixtureRounds(allMatches, leagueConfig);

    return {
      fixtures: fixture,
      currentRound: getCurrentRound(fixture, leagueConfig?.display),
    } as AmericanFootballFixturesPage;
  }

  async americanFootballStandings(league: number, season: number) {
    const standings = await (
      process.env.DEV_MODE
        ? fetchStandingsTotal
        : fetchAmericanFootballStandings
    )(league, season);
    if (!standings) {
      return null;
    }

    const headings = AMERICAN_FOOTBALL_LADDER_HEADINGS;

    return {
      standings: standings?.standings
        .sort((a, b) => b.name.localeCompare(a.name))
        .map((table) => {
          return {
            tableName: table.name,
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
                L: standing.losses,
                D: standing.draws,
              };
            }),
            placingCategories: [],
          };
        }),
    } as AmericanFootballLadderPage<typeof headings>;
  }

  async americanFootballMatchDetails(matchId: number) {
    const match = await (
      process.env.DEV_MODE
        ? fetchEventDetails
        : fetchAmericanFootballMatchDetails
    )(matchId);
    const incidents = await (
      process.env.DEV_MODE
        ? fetchEventIncidents
        : fetchAmericanFootballMatchIncidents
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
    } as AmericanFootballMatchPage;
  }

  async americanFootballMatchesByDate(date: Date) {
    const matches = (await (process.env.DEV_MODE
      ? fetchEventsByDate(SofascoreSportURL.AMERICAN_FOOTBALL, date)
      : fetchAmericanFootballMatchesByDate(
          date,
        ))) as AmericanFootball_AmericanFootballApi_CategorySchedule_Response;

    if (!matches || matches.events.length === 0) {
      return null;
    }

    const validLeagueIds = AMERICAN_FOOTBALL_LEAGUES.map((l) => Number(l.slug));

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
      this.mapAmericanFootballMatch(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    );

    const fixture = await mapFixtureRounds(
      allMatches,
      AMERICAN_FOOTBALL_LEAGUES,
    );

    return {
      fixtures: fixture,
      currentRound: getCurrentRound(fixture, DISPLAY_TYPES.LEAGUE),
    } as AmericanFootballFixturesPage;
  }

  mapAmericanFootballMatch(
    match: AmericanFootball_Sofascore_Event,
    roundLabel: string,
  ): MatchSummary {
    return mapMatchSummary(
      API_EVENT_TYPES.SOFASCORE,
      SPORT.AMERICAN_FOOTBALL,
      match,
      {
        roundLabel,
        homeDetails: {
          winDrawLoss: match.homeTeamSeasonHistoricalForm
            ? `${match.homeTeamSeasonHistoricalForm.wins ?? 0}-${match.homeTeamSeasonHistoricalForm.losses ?? 0}${match.homeTeamSeasonHistoricalForm.draws ? "-" + match.homeTeamSeasonHistoricalForm.draws : ""}`
            : undefined,
        },
        awayDetails: {
          winDrawLoss: match.awayTeamSeasonHistoricalForm
            ? `${match.awayTeamSeasonHistoricalForm.wins ?? 0}-${match.awayTeamSeasonHistoricalForm.losses ?? 0}${match.awayTeamSeasonHistoricalForm.draws ? "-" + match.awayTeamSeasonHistoricalForm.draws : ""}`
            : undefined,
        },
      },
    );
  }
}

export const americanFootballService = new AmericanFootballService();
