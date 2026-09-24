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
} from "@/endpoints/tennis.api";
import {
    EVENT_TODAY_EXTENTION_HOURS,
    FALLBACK_TIMEZONE,
    TENNIS_CATEGORIES,
    TENNIS_LEAGUES,
} from "@/lib/constants";
import { withDevCache } from "@/lib/devCache";
import { resolveSportImage } from "@/lib/imageMapping";
import { setTennisMatchSummary, shortenTeamNames } from "@/lib/projUtils";
import {
    CardVariant,
    DeepPartial,
    FixtureRound,
    MatchProperties,
    MatchSummary,
    PeriodScore,
    SPORT,
    Standings,
} from "@/types/misc";
import { Sofascore_Event, Sofascore_Score } from "@/types/sofascore";
import {
    RankingList,
    Tennis_Sofascore_Event,
    Tennis_TennisApi_Rankings_Response,
} from "@/types/tennis";
import { TZDate } from "@date-fns/tz";
import { addHours, isSameDay, isWithinInterval } from "date-fns";
import { SofascoreSport } from "./sofascore.service";

const TENNIS_RANKING_HEADINGS = ["Player", "Total", "Prev"]
const TENNIS_SET_NUMBERS = [1, 2, 3, 4, 5] as const

class TennisService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "tennis",
          "tournament-matches-last",
          fetchTennisTournamentLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "tennis",
          "tournament-matches-next",
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
        fetchEventLineups: async () => null,
        fetchStandingsTotal: async () => null,
        fetchCupTrees: withDevCache("tennis", "bracket", fetchTennisBracket),
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "tennis",
          "player-matches-last",
          fetchTennisPlayerLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "tennis",
          "player-matches-next",
          fetchTennisPlayerNextMatches,
        ),
      },
      SPORT.TENNIS,
      TENNIS_CATEGORIES,
      TENNIS_LEAGUES,
      [] as const,
      undefined,
      CardVariant.TENNIS,
    )
  }

  override async matchesByDate(date: Date) {
    const timezone = date instanceof TZDate ? date.timeZone : FALLBACK_TIMEZONE
    const matchesResponse = await this.apiEndpoints.fetchEventsByDate(
      this.categories,
      date,
    )

    if (!matchesResponse) return null

    const [matches, errors] = matchesResponse

    if (!matches && !errors) return null

    const validLeagueIds = this.leagues.map((l) => Number(l.slug))

    const validCategoryIds = this.categories
      .filter((c) => !c.excludeByDefault)
      .map((c) => Number(c.id))

    const leagueIdToName = Object.fromEntries(
      TENNIS_CATEGORIES.map((l) => [Number(l.id), l.name]).concat(
        TENNIS_LEAGUES.map((l) => [Number(l.slug), l.name]),
      ),
    )

    matches.events = matches.events
      .filter((item) => {
        const eventDate = new TZDate(item.startTimestamp * 1000, timezone)
        const eventEndDate = item.endTimestamp
          ? new TZDate(item.endTimestamp * 1000, timezone)
          : null

        // Check if the event start/end date is today, today + EVENT_TODAY_EXTENTION_HOURS OR today is between the start and end date
        return (
          isSameDay(eventDate, date) ||
          isSameDay(addHours(eventDate, EVENT_TODAY_EXTENTION_HOURS), date) ||
          (eventEndDate &&
            (isWithinInterval(date, {
              start: eventDate,
              end: addHours(eventEndDate, EVENT_TODAY_EXTENTION_HOURS),
            }) ||
              isSameDay(eventEndDate, date) ||
              isSameDay(
                addHours(eventEndDate, EVENT_TODAY_EXTENTION_HOURS),
                date,
              )))
        )
      })
      .filter((item) => item.status.type !== "canceled")

    const filteredMatches = matches.events.filter(
      (item) =>
        validCategoryIds.includes(item.tournament.category.id) ||
        validLeagueIds.includes(item.tournament?.uniqueTournament?.id ?? -1),
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
          } as FixtureRound
        })
        .concat(
          aussieMatches.length > 0
            ? ({
                matches: this.sortMatchesByDateAndTournament(aussieMatches),
                roundLabel: "Australians",
                cardVariant: "tennis",
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
    let rankings: Tennis_TennisApi_Rankings_Response | null = null

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
                id: rank.id,
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
    const convertedScores = this.constructTennisScore(
      match.homeScore,
      match.awayScore,
    )

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
      leagueName: `${match.tournament.category.name} ${match.tournament.uniqueTournament?.tennisPoints ?? ""} - ${match.tournament.category.name === "ATP" || match.tournament.category.name === "WTA" || match.tournament.category.name === "Challenger" ? match.tournament.name : match.tournament?.uniqueTournament?.name}`,
      leagueSlug: `/sports/${this.sport}/${match.tournament?.uniqueTournament?.id}/${match?.season?.id}`,
      competitorDetails: [
        {
          id: match.homeTeam.id.toString(),
          name: `${match.homeTeamSeed ? match.homeTeamSeed + " " : ""}${shortenTeamNames(match.homeTeam.name)}`,
          score: convertedScores.homeScore,
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
          score: convertedScores.awayScore,
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

  protected override matchDetailsMapper(
    matchDetails: Sofascore_Event,
  ): MatchProperties {
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
    const scoreBreakdown: PeriodScore[] = []

    const scores = this.constructTennisScore(
      match.homeScore,
      match.awayScore,
      true,
    )

    const breakdownLength = Math.max(scores.homeScore.length, 2)

    for (let i = 0; i < breakdownLength; i++) {
      const set = TENNIS_SET_NUMBERS[i]
      scoreBreakdown.push({
        periodName: `Set ${set}`,
        teams: {
          home: { score: scores.homeScore[i] ?? "0" },
          away: { score: scores.awayScore[i] ?? "0" },
        },
      })
    }

    return scoreBreakdown
  }

  private constructTennisScore(
    homeScore: Sofascore_Score,
    awayScore: Sofascore_Score,
    bracketedTiebreaks: boolean = false,
  ) {
    const home: string[] = []
    const away: string[] = []

    for (const set of TENNIS_SET_NUMBERS) {
      // Function to validate if a tiebreaker exists & contains valid data
      const validateTiebreakerScore = (
        homeScore: number | undefined,
        awayScore: number | undefined,
      ) => {
        const invalidTiebreakerScores = [30, 40]
        return !(
          (homeScore !== undefined &&
            invalidTiebreakerScores.includes(homeScore)) ||
          (awayScore !== undefined &&
            invalidTiebreakerScores.includes(awayScore))
        )
      }

      const homeTieBreak = homeScore[`period${set}TieBreak`]
      const awayTieBreak = awayScore[`period${set}TieBreak`]
      const showTieBreak = validateTiebreakerScore(homeTieBreak, awayTieBreak)

      // Function to return the string formatted set
      const formatSet = (games?: number, tieBreak?: number) => {
        return games === undefined
          ? null
          : `${games}${showTieBreak && tieBreak !== undefined ? (bracketedTiebreaks ? ` (${tieBreak})` : ` ${tieBreak}`) : ""}`
      }

      const homeSet = formatSet(homeScore[`period${set}`], homeTieBreak)
      if (homeSet !== null) home.push(homeSet)

      const awaySet = formatSet(awayScore[`period${set}`], awayTieBreak)
      if (awaySet !== null) away.push(awaySet)
    }

    return { homeScore: home, awayScore: away }
  }
}

export const tennisService = new TennisService()
