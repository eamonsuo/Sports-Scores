import {
  fetchAmericanFootballMatchDetails,
  fetchAmericanFootballMatchIncidents,
  fetchAmericanFootballStandings,
} from "@/endpoints/american-football.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import {
  AMERICAN_FOOTBALL_LADDER_HEADINGS,
  AMERICAN_FOOTBALL_LEAGUES,
} from "@/lib/constants";
import { mapMatchSummary } from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import {
  AmericanFootball_Sofascore_Event,
  AmericanFootballLadderPage,
  AmericanFootballMatchPage,
} from "@/types/american-football";
import { API_EVENT_TYPES, MatchSummary, SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
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

  override matchesAll(tournamentId: number, seasonId: number) {
    return super.matchesAll(tournamentId, seasonId, "Week");
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

  override eventMapper(
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
