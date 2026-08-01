import {
  Brackets,
  MatchDetail,
  Matches,
  SportService,
  Standings,
} from "@/types/misc"

class PlaceholderService implements SportService {
  matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    return Promise.resolve(null)
  }
  matchesByDate(date: Date): Promise<Matches | null> {
    return Promise.resolve(null)
  }
  matchesByTeam(teamId: string): Promise<Matches | null> {
    return Promise.resolve(null)
  }
  matchDetails(
    matchId: string,
    leagueId?: string,
    seasonId?: string,
    dataOptions?: {
      details?: boolean
      incidents?: boolean
      lineups?: boolean
    },
  ): Promise<MatchDetail | null> {
    return Promise.resolve(null)
  }
  standings(leagueId: string, seasonId: string): Promise<Standings | null> {
    return Promise.resolve(null)
  }
  brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    return Promise.resolve(null)
  }
}

export const placeholderService = new PlaceholderService()
