import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchScheduledEvents,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore-rapid-api.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
} from "@/endpoints/sofascore.api";
import {
  AUSSIE_RULES_LADDER_HEADINGS,
  AUSSIE_RULES_LEAGUES,
} from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import { AussieRulesMatchPage } from "@/types/aussie-rules";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class AussieRulesService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchTournamentLastMatches,
        fetchNextEvents: fetchTournamentNextMatches,
        fetchEventsByDate: (date: Date) => fetchScheduledEvents(87, date),
        fetchEventDetails: fetchMatchDetails,
        fetchEventIncidents: fetchMatchIncidents,
        fetchStandingsTotal: fetchTournamentStandings,
        fetchCupTrees: async () => null,
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
