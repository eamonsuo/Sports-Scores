import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
  fetchRugbyLeagueTeamLastMatches,
  fetchRugbyLeagueTeamNextMatches,
} from "@/endpoints/rugby-league.api";
import { fetchStandingsTotal } from "@/endpoints/sofascore.api";
import {
  RUGBY_LEAGUE_LADDER_HEADINGS,
  RUGBY_LEAGUE_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants";
import { mapSofascoreToStanding } from "@/lib/eventMapping";
import { resolvePlayoffPicture } from "@/lib/playoffPictureMapping";
import { getSportConfigurations } from "@/lib/projUtils";
import { SPORT, Standings } from "@/types/misc";
import { Sofascore_Standing, SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class RugbyLeagueService extends SofascoreSport {
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
        fetchTeamLastEvents: fetchRugbyLeagueTeamLastMatches,
        fetchTeamNextEvents: fetchRugbyLeagueTeamNextMatches,
      },
      SPORT.RUGBY_LEAGUE,
      SofascoreSportURL.RUGBY,
      RUGBY_LEAGUE_LEAGUES,
      RUGBY_LEAGUE_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    );
  }

  override async standings(tournamentId: number, seasonId: number) {
    const standings = await (
      process.env.DEV_MODE
        ? fetchStandingsTotal
        : this.apiEndpoints.fetchStandingsTotal
    )(tournamentId, seasonId);

    if (!standings) {
      return null;
    }

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      String(tournamentId),
      String(seasonId),
    );

    const remappedStandings: Sofascore_Standing[] = standings.standings.map(
      (table) => ({
        ...table,
        rows: table.rows
          .map((row) => ({
            ...row,
            points: row.wins * 2 + (row.draws ?? 0),
          }))
          .sort(
            (a, b) =>
              b.points! - a.points! ||
              b.scoresFor - b.scoresAgainst - (a.scoresFor - a.scoresAgainst),
          )
          .map((row, index) => ({ ...row, position: index + 1 })),
      }),
    );

    return {
      standings: remappedStandings.map((table) =>
        this.standingsMapper(table, ladderConfig?.placingCategories),
      ),
      playoffPicture: resolvePlayoffPicture(
        ladderConfig?.playoffPictureConfig,
        remappedStandings.map((table) => ({
          name: table.name,
          standings: table.rows.map((row) =>
            mapSofascoreToStanding(
              row,
              ladderConfig?.playoffPictureConfig?.totalSeasonGames ?? 0,
            ),
          ),
        })),
      ),
    } as Standings<typeof RUGBY_LEAGUE_LADDER_HEADINGS>;
  }
}

export const rugbyLeagueService = new RugbyLeagueService();
