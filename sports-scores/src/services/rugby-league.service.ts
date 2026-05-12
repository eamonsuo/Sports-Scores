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
import {
  RUGBY_LEAGUE_LADDER_HEADINGS,
  RUGBY_LEAGUE_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants";
import { withDevCache } from "@/lib/devCache";
import { resolvePlayoffPicture } from "@/lib/playoffPictureMapping";
import { getSportConfigurations } from "@/lib/projUtils";
import { SPORT, Standings } from "@/types/misc";
import { Sofascore_Standing } from "@/types/sofascore";
import { mapSofascoreToStanding, SofascoreSport } from "./sofascore.service";

class RugbyLeagueService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchNextEvents: withDevCache(
          "rugby-league",
          "next-matches",
          fetchRugbyLeagueNextMatches,
        ),
        // fetchNextEvents: async () => null,
        fetchLastEvents: withDevCache(
          "rugby-league",
          "last-matches",
          fetchRugbyLeagueLastMatches,
        ),
        fetchEventsByDate: withDevCache(
          "rugby-league",
          "matches-by-date",
          fetchRugbyLeagueMatchesByDate,
        ),
        fetchEventDetails: withDevCache(
          "rugby-league",
          "match-details",
          fetchRugbyLeagueMatchDetails,
        ),
        fetchEventIncidents: withDevCache(
          "rugby-league",
          "match-incidents",
          fetchRugbyLeagueMatchIncidents,
        ),
        fetchStandingsTotal: withDevCache(
          "rugby-league",
          "standings",
          fetchRugbyLeagueStandings,
        ),
        fetchCupTrees: async () => null,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "rugby-league",
          "team-last-matches",
          fetchRugbyLeagueTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "rugby-league",
          "team-next-matches",
          fetchRugbyLeagueTeamNextMatches,
        ),
      },
      SPORT.RUGBY_LEAGUE,
      RUGBY_LEAGUE_LEAGUES,
      RUGBY_LEAGUE_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    );
  }

  override async standings(leagueId: string, seasonId: string) {
    const standings = await this.apiEndpoints.fetchStandingsTotal(
      leagueId,
      seasonId,
    );

    if (!standings) {
      return null;
    }

    const { ladderConfig } = getSportConfigurations(
      this.leagues,
      String(leagueId),
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
