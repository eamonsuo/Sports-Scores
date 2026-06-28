import {
  fetchTennisATPRankings,
  fetchTennisBracket,
  fetchTennisMatchDetails,
  fetchTennisMatchesByCategoryDate,
  fetchTennisPlayerLastMatches,
  fetchTennisPlayerNextMatches,
  fetchTennisTournamentLastMatches,
  fetchTennisTournamentNextMatches,
  fetchTennisWTARankings,
} from "@/endpoints/tennis.api"
import { TENNIS_CATEGORIES, TENNIS_LEAGUES } from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { resolveSportImage } from "@/lib/imageMapping"
import { setTennisMatchSummary, shortenTeamNames } from "@/lib/projUtils"
import {
  CardVariant,
  DeepPartial,
  FixtureRound,
  MatchSummary,
  PeriodScore,
  SPORT,
  Standings,
  TeamScoreDetails,
} from "@/types/misc"
import { Sofascore_Event } from "@/types/sofascore"
import {
  RankingList,
  Tennis_Sofascore_Event,
  Tennis_TennisApi_Rankings_Response,
} from "@/types/tennis"
import { TZDate } from "@date-fns/tz"
import { isSameDay } from "date-fns"
import { SofascoreSport } from "./sofascore.service"

const TENNIS_RANKING_HEADINGS = ["Player", "Total", "Prev"]

class TennisService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "tennis",
          "tournament-last-matches",
          fetchTennisTournamentLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "tennis",
          "tournament-next-matches",
          fetchTennisTournamentNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "tennis",
          "matches-by-date",
          fetchTennisMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "tennis",
          "match-details",
          fetchTennisMatchDetails,
        ),
        fetchEventIncidents: async () => null,
        fetchStandingsTotal: async () => null,
        fetchCupTrees: withDevCache("tennis", "bracket", fetchTennisBracket),
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "tennis",
          "player-last-matches",
          fetchTennisPlayerLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "tennis",
          "player-next-matches",
          fetchTennisPlayerNextMatches,
        ),
      },
      SPORT.TENNIS,
      TENNIS_CATEGORIES.map((c) => c.slug),
      TENNIS_LEAGUES,
      [] as const,
      undefined,
      CardVariant.TENNIS,
    )
  }

  override async matchesByDate(date: Date) {
    const timezone = date instanceof TZDate ? date.timeZone : "UTC"
    const matches = await this.apiEndpoints.fetchEventsByDate(
      this.categories,
      date,
    )

    if (!matches) return null

    const validLeagueIds = TENNIS_LEAGUES.filter((l) => !l.excludeFromToday)
      .map((l) => Number(l.slug))
      .concat(TENNIS_CATEGORIES.map((c) => Number(c.slug)))

    const leagueIdToName = Object.fromEntries(
      TENNIS_CATEGORIES.concat(TENNIS_LEAGUES).map((l) => [
        Number(l.slug),
        l.name,
      ]),
    )

    matches.events = matches.events
      .filter((item) => {
        const eventDate = new TZDate(item.startTimestamp * 1000, timezone)
        return isSameDay(eventDate, date)
      })
      .filter((item) => item.status.type !== "canceled")

    const filteredMatches = matches.events.filter(
      (item) =>
        validLeagueIds.includes(item.tournament.category.id) ||
        validLeagueIds.includes(item.tournament.uniqueTournament?.id),
    )

    const aussieMatches = matches.events.filter(
      (item) =>
        item.homeTeam.country.name === "Australia" ||
        item.awayTeam.country.name === "Australia" ||
        item.homeTeam.subTeams?.some(
          (subTeam) => subTeam.country.name === "Australia",
        ) ||
        item.awayTeam.subTeams?.some(
          (subTeam) => subTeam.country.name === "Australia",
        ),
    )

    if (!filteredMatches.length && !aussieMatches.length) return null

    // Get unique league ids in order
    const rounds = [
      ...new Set(filteredMatches.map((item) => item.tournament.category.id)),
    ]

    const firstTournament =
      rounds.length > 0 ? (leagueIdToName[rounds[0]] ?? "Other") : ""

    return {
      fixtures: rounds
        .map((leagueId) => {
          const roundLabel = leagueIdToName[leagueId] ?? "Other"

          // Filter matches for this league
          const leagueMatches = filteredMatches.filter(
            (item) => item.tournament.category.id === leagueId,
          )

          return {
            matches: this.sortMatchesByDateAndTournament(leagueMatches),
            roundLabel: roundLabel,
            cardVariant: "tennis",
            roundSlug: `${SPORT.TENNIS}/today`,
          } as FixtureRound
        })
        .concat(
          aussieMatches.length > 0
            ? ({
                matches: this.sortMatchesByDateAndTournament(aussieMatches),
                roundLabel: "Australians",
                cardVariant: "tennis",
                roundSlug: `${SPORT.TENNIS}/today`,
              } as FixtureRound)
            : [],
        ),

      currentRound: firstTournament,
    }
  }

  override async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings | null> {
    let rankings: Tennis_TennisApi_Rankings_Response

    switch (leagueId) {
      case RankingList.WTA:
        rankings = await withDevCache(
          "tennis",
          "wta-rankings",
          fetchTennisWTARankings,
        )()
        break
      case RankingList.ATP:
        rankings = await withDevCache(
          "tennis",
          "atp-rankings",
          fetchTennisATPRankings,
        )()
        break
      default:
        return null
    }

    if (!rankings) {
      return null
    }

    return {
      standings: [
        {
          tables: [
            {
              headings: TENNIS_RANKING_HEADINGS,
              data: rankings.rankings.map((rank) => ({
                position: rank.ranking,
                teamId: rank.id,
                teamName: rank.rowName,
                teamLogo: resolveSportImage([
                  rank.team.country.name,
                  rank.team.name,
                ]),

                Total: rank.points,
                Prev: rank.previousRanking,
              })),
            },
          ],
        },
      ],
    }
  }

  async tennisRankings(rankingList: RankingList): Promise<Standings | null> {
    return null
  }

  override eventMapper(
    match: Tennis_Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    return super.eventMapper(match, {
      ...options,
      otherDetail: match.roundInfo?.name ?? undefined,
      summaryText: setTennisMatchSummary(
        match.status.type,
        match.winnerCode,
        match.homeTeam.name,
        match.awayTeam.name,
        match.homeScore.current ?? 0,
        match.awayScore.current ?? 0,
      ),
      leagueName: `${match.tournament.category.name} ${match.tournament.uniqueTournament?.tennisPoints ?? ""} - ${match.tournament.category.name === "ATP" || match.tournament.category.name === "WTA" || match.tournament.category.name === "Challenger" ? match.tournament.name : match.tournament.uniqueTournament.name}`,
      leagueSlug: `/sports/${this.sport}/${match.tournament.uniqueTournament.id}/${match.season.id}`,
      competitorDetails: [
        {
          id: match.homeTeam.id.toString(),
          name: `${match.homeTeamSeed ? match.homeTeamSeed + " " : ""}${shortenTeamNames(match.homeTeam.name)}`,
          score: [
            match.homeScore.period1 !== undefined
              ? `${match.homeScore.period1}${match.homeScore.period1TieBreak !== undefined ? ` ${match.homeScore.period1TieBreak}` : ""}`
              : null,
            match.homeScore.period2 !== undefined
              ? `${match.homeScore.period2}${match.homeScore.period2TieBreak !== undefined ? ` ${match.homeScore.period2TieBreak}` : ""}`
              : null,
            match.homeScore.period3 !== undefined
              ? `${match.homeScore.period3}${match.homeScore.period3TieBreak !== undefined ? ` ${match.homeScore.period3TieBreak}` : ""}`
              : null,
            match.homeScore.period4 !== undefined
              ? `${match.homeScore.period4}${match.homeScore.period4TieBreak !== undefined ? ` ${match.homeScore.period4TieBreak}` : ""}`
              : null,
            match.homeScore.period5 !== undefined
              ? `${match.homeScore.period5}${match.homeScore.period5TieBreak !== undefined ? ` ${match.homeScore.period5TieBreak}` : ""}`
              : null,
          ].filter((s): s is string => s !== null),
          img:
            match.homeTeam.subTeams && match.homeTeam.subTeams.length > 0
              ? match.homeTeam.subTeams.map((subTeam) =>
                  resolveSportImage(subTeam.country.name ?? subTeam.name),
                )
              : resolveSportImage(
                  match.homeTeam.country.name ?? match.homeTeam.name,
                ),
        },
        {
          id: match.awayTeam.id.toString(),
          name:
            `${match.awayTeamSeed ? match.awayTeamSeed + " " : ""}` +
            shortenTeamNames(match.awayTeam.name),
          score: [
            match.awayScore.period1 !== undefined
              ? `${match.awayScore.period1}${match.awayScore.period1TieBreak !== undefined ? ` ${match.awayScore.period1TieBreak}` : ""}`
              : null,
            match.awayScore.period2 !== undefined
              ? `${match.awayScore.period2}${match.awayScore.period2TieBreak !== undefined ? ` ${match.awayScore.period2TieBreak}` : ""}`
              : null,
            match.awayScore.period3 !== undefined
              ? `${match.awayScore.period3}${match.awayScore.period3TieBreak !== undefined ? ` ${match.awayScore.period3TieBreak}` : ""}`
              : null,
            match.awayScore.period4 !== undefined
              ? `${match.awayScore.period4}${match.awayScore.period4TieBreak !== undefined ? ` ${match.awayScore.period4TieBreak}` : ""}`
              : null,
            match.awayScore.period5 !== undefined
              ? `${match.awayScore.period5}${match.awayScore.period5TieBreak !== undefined ? ` ${match.awayScore.period5TieBreak}` : ""}`
              : null,
          ].filter((s): s is string => s !== null),
          img:
            match.awayTeam.subTeams && match.awayTeam.subTeams.length > 0
              ? match.awayTeam.subTeams.map((subTeam) =>
                  resolveSportImage(subTeam.country.name ?? subTeam.name),
                )
              : resolveSportImage(
                  match.awayTeam.country.name ?? match.awayTeam.name,
                ),
        },
      ],
    })
  }

  protected override matchDetailsMapper(matchDetails: Sofascore_Event): {
    homeTeam: TeamScoreDetails
    awayTeam: TeamScoreDetails
    status: string
  } {
    const parentMatchDetails = super.matchDetailsMapper(matchDetails)
    return {
      ...parentMatchDetails,
      homeTeam: {
        ...parentMatchDetails.homeTeam,
        img:
          matchDetails?.homeTeam.subTeams &&
          matchDetails?.homeTeam.subTeams.length > 0
            ? matchDetails.homeTeam.subTeams.map((subTeam) =>
                resolveSportImage(subTeam.country.name ?? subTeam.name),
              )
            : resolveSportImage(
                matchDetails?.homeTeam.country?.name ??
                  matchDetails?.homeTeam.name ??
                  "",
              ),
      },
      awayTeam: {
        ...parentMatchDetails.awayTeam,
        img:
          matchDetails?.awayTeam.subTeams &&
          matchDetails?.awayTeam.subTeams.length > 0
            ? matchDetails?.awayTeam.subTeams.map((subTeam) =>
                resolveSportImage(subTeam.country.name ?? subTeam.name),
              )
            : resolveSportImage(
                matchDetails?.awayTeam.country?.name ??
                  matchDetails?.awayTeam.name ??
                  "",
              ),
      },
    }
  }

  // AI Generated Helper
  private sortMatchesByDateAndTournament(
    matches: Tennis_Sofascore_Event[],
  ): MatchSummary[] {
    // Map to MatchSummary first
    const mapped = matches.map((match) => this.eventMapper(match))

    // Group by leagueName
    const groups = new Map<string, MatchSummary[]>()
    mapped.forEach((match) => {
      const key = match.leagueName ?? ""
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(match)
    })

    // Sort each group internally by start time
    groups.forEach((group) => {
      group.sort(
        (a, b) =>
          (a.startDate as Date).getTime() - (b.startDate as Date).getTime(),
      )
    })

    // Sort groups alphabetically by seriesName, with WTA directly after ATP
    const getSortKey = (name: string) => {
      if (name.startsWith("ATP")) return 0
      if (name.startsWith("WTA")) return 1
      return 2
    }

    const getPoints = (name: string) => {
      const num = Number(name.split(" ")[1])
      return isNaN(num) ? 0 : num
    }

    return Array.from(groups.entries())
      .sort(([nameA], [nameB]) => {
        const groupDiff = getSortKey(nameA) - getSortKey(nameB)
        if (groupDiff !== 0) return groupDiff
        const pointsDiff = getPoints(nameB) - getPoints(nameA)
        if (pointsDiff !== 0) return pointsDiff
        return nameA.localeCompare(nameB)
      })
      .flatMap(([, group]) => group)
  }

  protected override scoreBreakdownMapper(
    match: Sofascore_Event,
  ): PeriodScore[] {
    return [
      {
        periodName: "1st",
        teams: {
          home: { score: match.homeScore?.period1 ?? "0" },
          away: { score: match.awayScore?.period1 ?? "0" },
        },
      },
      {
        periodName: "2nd",
        teams: {
          home: { score: match.homeScore?.period2 ?? "0" },
          away: { score: match.awayScore?.period2 ?? "0" },
        },
      },
      match.homeScore?.period3
        ? {
            periodName: "3rd",
            teams: {
              home: { score: match.homeScore?.period3 ?? "0" },
              away: { score: match.awayScore?.period3 ?? "0" },
            },
          }
        : null,
      match.homeScore?.period4
        ? {
            periodName: "4th",
            teams: {
              home: { score: match.homeScore?.period4 ?? "0" },
              away: { score: match.awayScore?.period4 ?? "0" },
            },
          }
        : null,
      match.homeScore?.period5
        ? {
            periodName: "5th",
            teams: {
              home: { score: match.homeScore?.period5 ?? "0" },
              away: { score: match.awayScore?.period5 ?? "0" },
            },
          }
        : null,
    ].filter((set) => set !== null)
  }
}

export const tennisService = new TennisService()
