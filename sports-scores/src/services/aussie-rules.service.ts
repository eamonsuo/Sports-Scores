import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchTournamentStandings,
} from "@/endpoints/sofascore-rapid-api.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import {
  AUSSIE_RULES_LADDER_HEADINGS,
  AUSSIE_RULES_LEAGUES,
} from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import {
  AussieRulesLadderPage,
  AussieRulesMatchPage,
} from "@/types/aussie-rules";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class AussieRulesService extends SofascoreSport {
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
      SPORT.AUSSIE_RULES,
      SofascoreSportURL.AUSSIE_RULES,
      AUSSIE_RULES_LEAGUES,
      AUSSIE_RULES_LADDER_HEADINGS,
    );
  }

  async aussieRulesStandings(league: number, season: number) {
    const standings = await (
      process.env.DEV_MODE ? fetchStandingsTotal : fetchTournamentStandings
    )(league, season);

    if (!standings) {
      return null;
    }

    const leagueConfig = AUSSIE_RULES_LEAGUES.find(
      (l) => Number(l.slug) === league,
    );
    const headings = AUSSIE_RULES_LADDER_HEADINGS;

    const seasonConfig = leagueConfig?.seasons.find(
      (s) => Number(s.slug) === season,
    );

    return {
      standings: standings?.standings.map((table) => {
        return {
          headings,
          data: table.rows.map((item) => {
            return {
              position: item.position,
              team: {
                id: item.team.id,
                name: shortenTeamNames(item.team.name),
                logo: resolveSportImage(item.team.name),
              },
              P: item.matches,
              W: item.wins,
              "%": item.scoresAgainst
                ? Math.round((item.scoresFor / item.scoresAgainst) * 100)
                : 0,
              Pts: item.points,
            };
          }),
          placingCategories:
            leagueConfig?.ladderConfig?.[seasonConfig?.ladderConfig ?? 0]
              ?.placingCategories ?? [],
        };
      }),
    } as AussieRulesLadderPage<typeof headings>;
  }

  async aussieRulesMatchDetails(matchId: number) {
    const match = await (
      process.env.DEV_MODE ? fetchEventDetails : fetchMatchDetails
    )(matchId);
    const incidents = await (
      process.env.DEV_MODE ? fetchEventIncidents : fetchMatchIncidents
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
}

export const aussieRulesService = new AussieRulesService();
