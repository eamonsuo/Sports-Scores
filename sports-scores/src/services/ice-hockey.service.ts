import {
  fetchIceHockeyLastMatches,
  fetchIceHockeyMatchDetails,
  fetchIceHockeyMatchesByDate,
  fetchIceHockeyMatchIncidents,
  fetchIceHockeyNextMatches,
  fetchIceHockeyStandings,
} from "@/endpoints/ice-hockey.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
} from "@/endpoints/sofascore.api";
import {
  ICE_HOCKEY_LADDER_HEADINGS,
  ICE_HOCKEY_LEAGUES,
} from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import { IceHockeyMatchPage } from "@/types/ice-hockey";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class IceHockeyService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchIceHockeyLastMatches,
        fetchNextEvents: fetchIceHockeyNextMatches,
        fetchEventsByDate: fetchIceHockeyMatchesByDate,
        fetchEventDetails: fetchIceHockeyMatchDetails,
        fetchEventIncidents: fetchIceHockeyMatchIncidents,
        fetchStandingsTotal: fetchIceHockeyStandings,
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: async () => null,
        fetchTeamNextEvents: async () => null,
      },
      SPORT.ICE_HOCKEY,
      SofascoreSportURL.ICE_HOCKEY,
      ICE_HOCKEY_LEAGUES,
      ICE_HOCKEY_LADDER_HEADINGS,
    );
  }

  async iceHockeyMatchDetails(matchId: number) {
    const match = await (
      process.env.DEV_MODE ? fetchEventDetails : fetchIceHockeyMatchDetails
    )(matchId);
    const incidents = await (
      process.env.DEV_MODE ? fetchEventIncidents : fetchIceHockeyMatchIncidents
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
                periodName: "1st Period",
                teams: {
                  home: { score: matchDetails.homeScore?.period1 ?? "0" },
                  away: { score: matchDetails.awayScore?.period1 ?? "0" },
                },
              },
              {
                periodName: "2nd Period",
                teams: {
                  home: { score: matchDetails.homeScore?.period2 ?? "0" },
                  away: { score: matchDetails.awayScore?.period2 ?? "0" },
                },
              },
              {
                periodName: "3rd Period",
                teams: {
                  home: { score: matchDetails.homeScore?.period3 ?? "0" },
                  away: { score: matchDetails.awayScore?.period3 ?? "0" },
                },
              },
            ],
          },
    } as IceHockeyMatchPage;
  }
}

export const iceHockeyService = new IceHockeyService();
