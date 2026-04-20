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
} from "@/endpoints/sofascore.api";
import {
  BASKETBALL_LADDER_HEADINGS,
  BASKETBALL_LEAGUES,
} from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import { BasketballMatchPage } from "@/types/basketball";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class BasketballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchBasketballLastMatches,
        fetchNextEvents: fetchBasketballNextMatches,
        fetchEventsByDate: fetchBasketballMatchesByDate,
        fetchEventDetails: fetchBasketballMatchDetails,
        fetchEventIncidents: fetchBasketballMatchIncidents,
        fetchStandingsTotal: fetchBasketballStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: async () => null,
        fetchTeamNextEvents: async () => null,
      },
      SPORT.BASKETBALL,
      SofascoreSportURL.BASKETBALL,
      BASKETBALL_LEAGUES,
      BASKETBALL_LADDER_HEADINGS,
    );
  }

  async basketballMatchDetails(matchId: number) {
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
}

export const basketballService = new BasketballService();
