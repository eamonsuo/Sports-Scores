import { rugbyLeagueAPI } from "@/endpoints/rugby-league.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
} from "@/endpoints/sofascore.api";
import {
  RUGBY_LEAGUE_LADDER_HEADINGS,
  RUGBY_LEAGUE_LEAGUES,
} from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import { SPORT } from "@/types/misc";
import { RugbyLeagueMatchPage } from "@/types/rugby-league";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class RugbyLeagueService extends SofascoreSport {
  constructor() {
    super(
      rugbyLeagueAPI,
      SPORT.RUGBY_LEAGUE,
      SofascoreSportURL.RUGBY,
      RUGBY_LEAGUE_LEAGUES,
      RUGBY_LEAGUE_LADDER_HEADINGS,
    );
  }

  override async matchDetails(matchId: number) {
    const match = await (
      process.env.DEV_MODE
        ? fetchEventDetails
        : this.apiEndpoints.fetchEventDetails
    )(matchId);
    const incidents = await (
      process.env.DEV_MODE
        ? fetchEventIncidents
        : this.apiEndpoints.fetchEventIncidents
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
    } as RugbyLeagueMatchPage;
  }
}

export const rugbyLeagueService = new RugbyLeagueService();
