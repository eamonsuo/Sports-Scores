import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
} from "@/endpoints/rugby-league.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
} from "@/endpoints/sofascore.api";
import {
  RUGBY_UNION_LADDER_HEADINGS,
  RUGBY_UNION_LEAGUES,
} from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import { SPORT } from "@/types/misc";
import { RugbyUnionMatchPage } from "@/types/rugby-union";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class RugbyUnionService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchNextEvents: fetchRugbyLeagueNextMatches,
        fetchLastEvents: fetchRugbyLeagueLastMatches,
        fetchEventsByDate: fetchRugbyLeagueMatchesByDate,
        fetchEventDetails: fetchRugbyLeagueMatchDetails,
        fetchEventIncidents: fetchRugbyLeagueMatchIncidents,
        fetchStandingsTotal: fetchRugbyLeagueStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: async () => null,
        fetchTeamNextEvents: async () => null,
      },
      SPORT.RUGBY_UNION,
      SofascoreSportURL.RUGBY,
      RUGBY_UNION_LEAGUES,
      RUGBY_UNION_LADDER_HEADINGS,
    );
  }

  async rugbyUnionMatchDetails(matchId: number) {
    const match = await (
      process.env.DEV_MODE ? fetchEventDetails : fetchRugbyLeagueMatchDetails
    )(matchId);
    const incidents = await (
      process.env.DEV_MODE
        ? fetchEventIncidents
        : fetchRugbyLeagueMatchIncidents
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
    } as RugbyUnionMatchPage;
  }
}

export const rugbyUnionService = new RugbyUnionService();
