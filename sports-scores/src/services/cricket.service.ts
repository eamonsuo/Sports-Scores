import {
  fetchCricketCupTrees,
  fetchCricketLastMatches,
  fetchCricketMatchDetails,
  fetchCricketMatchesByCategoryDate,
  fetchCricketMatchIncidents,
  fetchCricketMatchInnings,
  fetchCricketMatchLineups,
  fetchCricketNextMatches,
  fetchCricketStandings,
  fetchCricketTeamLastMatches,
  fetchCricketTeamNextMatches,
} from "@/endpoints/cricket.api"
import {
  CRICKET_CATEGORIES,
  CRICKET_LADDER_HEADINGS,
  CRICKET_LEAGUES,
} from "@/lib/constants"
import { withDevCache } from "@/lib/devCache"
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping"
import { setMatchSummary } from "@/lib/projUtils"
import {
  CricketInningIncident,
  CricketMatchDetails,
  CricketScorecardBatProps,
  CricketScorecardBowlProps,
  CricketScorecardPage,
  Sofascore_Cricket_Incident,
  Sofascore_Cricket_Inning,
} from "@/types/cricket"
import {
  DeepPartial,
  DisplayTypes,
  FixtureRound,
  Matches,
  MatchLineup,
  MatchSummary,
  SPORT,
} from "@/types/misc"
import {
  Sofascore_Event,
  Sofascore_Lineup,
  Sofascore_Score_Inning,
} from "@/types/sofascore"
import { TZDate } from "@date-fns/tz/date"
import { isSameDay, isWithinInterval } from "date-fns"
import { SofascoreSport } from "./sofascore.service"

class CricketService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "cricket",
          "matches-last",
          fetchCricketLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "cricket",
          "matches-next",
          fetchCricketNextMatches,
        ),
        fetchEventsByDate: withDevCache(
          "cricket",
          "matches-by-date",
          fetchCricketMatchesByCategoryDate,
        ),
        fetchEventDetails: withDevCache(
          "cricket",
          "match-details",
          fetchCricketMatchDetails,
        ),
        fetchEventLineups: withDevCache(
          "cricket",
          "match-lineups",
          fetchCricketMatchLineups,
        ),
        fetchEventIncidents: async () => null,
        fetchStandingsTotal: withDevCache(
          "cricket",
          "standings",
          fetchCricketStandings,
        ),
        fetchCupTrees: withDevCache(
          "cricket",
          "cuptrees",
          fetchCricketCupTrees,
        ),
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: withDevCache(
          "cricket",
          "team-matches-last",
          fetchCricketTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "cricket",
          "team-matches-next",
          fetchCricketTeamNextMatches,
        ),
      },
      SPORT.CRICKET,
      CRICKET_CATEGORIES,
      CRICKET_LEAGUES,
      CRICKET_LADDER_HEADINGS,
    )
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const matches = await this.apiEndpoints.fetchEventsByDate(
      this.categories,
      date,
    )

    if (!matches) return null

    const validLeagueIds = this.leagues
      .filter((l) => !l.excludeFromToday)
      .map((l) => Number(l.slug))
      .concat(this.categories.map((c) => Number(c)))

    const timezone = date instanceof TZDate ? date.timeZone : "UTC"

    matches.events = matches.events
      .filter(
        (item) =>
          (validLeagueIds.includes(item.tournament.category.id) ||
            validLeagueIds.includes(
              item.tournament?.uniqueTournament?.id ?? -1,
            )) &&
          item.status.type !== "canceled",
      )
      .filter((item) => {
        const eventDate = new TZDate(item.startTimestamp * 1000, timezone)
        const eventEndDate = item.endTimestamp
          ? new TZDate(item.endTimestamp * 1000, timezone)
          : null

        // Check if the event start/end date is today OR today is between the start and end date
        return (
          isSameDay(eventDate, date) ||
          (eventEndDate &&
            (isWithinInterval(date, { start: eventDate, end: eventEndDate }) ||
              isSameDay(eventEndDate, date)))
        )
      })

    if (!matches.events || matches.events.length === 0) return null

    const allMatches = matches.events
      .map((event) =>
        this.eventMapper(event, {
          leagueName:
            `${
              this.leagues.find(
                (l) =>
                  l.slug === event.tournament?.uniqueTournament?.id.toString(),
              )?.name ?? event.tournament?.name
            }` +
            (event.roundInfo?.name || event.roundInfo?.round
              ? ` - ${event.roundInfo?.name ?? `Round ${event.roundInfo?.round ?? "x"}`}`
              : ""),
          leagueSlug: `/sports/${this.sport}/${event.tournament?.uniqueTournament?.id}/${event.season.id}`,
          leagueImg: this.leagues.find(
            (l) => l.slug === event.tournament?.uniqueTournament?.id.toString(),
          )?.icon,
        }),
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )

    const fixtures = await mapFixtureRounds(allMatches, this.leagues)
    const myTeams: FixtureRound = {
      matches: allMatches.filter((match) =>
        match.competitorDetails.some((team) =>
          this.leagues.some((l) => l.slug === `team/${team.id}`),
        ),
      ),
      roundLabel: "My Teams",
      // roundSlug: `/sports/${this.sport}/my-teams`,
    }

    return {
      fixtures: [myTeams, ...fixtures],
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    }
  }

  override async matchDetails(
    matchId: string,
    leagueId?: string,
    seasonId?: string,
  ): Promise<CricketMatchDetails> {
    const { matchDetails, matchLineups } = await super.matchDetails(
      matchId,
      leagueId,
      seasonId,
      {
        details: true,
        incidents: false,
        lineups: true,
      },
    )

    const [matchInnings, matchIncidentsRaw] = await Promise.all([
      withDevCache(
        "cricket",
        "match-innings",
        fetchCricketMatchInnings,
      )(matchId),
      withDevCache(
        "cricket",
        "match-incidents",
        fetchCricketMatchIncidents,
      )(matchId),
    ])

    const matchScorecard = this.matchInningsMapper(matchInnings?.innings ?? [])

    const matchIncidents = this.matchIncidentsMapper(
      (matchIncidentsRaw?.incidents ?? []).reverse(),
      matchScorecard.innings.map((item) => item.inningLabel),
    )

    return {
      matchDetails,
      matchScorecard,
      matchIncidents,
      matchLineups,
    }
  }

  override eventMapper(
    event: Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    return super.eventMapper(event, {
      ...options,
      summaryText:
        event.note ??
        setMatchSummary(
          event.status.type,
          event.homeTeam.name,
          event.homeScore.current,
          event.awayTeam.name,
          event.awayScore.current,
        ) + (event.status.type !== "notstarted" ? " runs" : ""),
      roundLabel:
        event.roundInfo?.name ??
        (event.tournament.name.split(",").length > 1
          ? event.tournament.name.split(",").at(-1)
          : "Matches"),
      competitorDetails: [
        {
          ...options?.competitorDetails?.[0],
          score: formatScore(
            event.homeScore.innings?.inning1,
            event.homeScore.innings?.inning2,
          ),
        },
        {
          ...options?.competitorDetails?.[1],
          score: formatScore(
            event.awayScore.innings?.inning1,
            event.awayScore.innings?.inning2,
          ),
        },
      ],
    })
  }

  override matchDetailsMapper(
    event: Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ) {
    const matchDetails = super.matchDetailsMapper(event)
    matchDetails.homeTeam.score = formatScore(
      event.homeScore.innings?.inning1,
      event.homeScore.innings?.inning2,
    )
    matchDetails.awayTeam.score = formatScore(
      event.awayScore.innings?.inning1,
      event.awayScore.innings?.inning2,
    )
    return matchDetails
  }

  matchInningsMapper(
    innings: Sofascore_Cricket_Inning[],
  ): CricketScorecardPage {
    return {
      matchState: "LIVE",
      innings: innings
        .sort((a, b) => a.number - b.number)
        .map((item) => {
          return {
            inningLabel: `${item.battingTeam.shortName} ${item.number === 1 || item.number === 2 ? "1st" : "2nd"}`,
            inningBatters: {
              batters: item.battingLine.map((batter) => {
                const didNotbat = batter.wicketTypeName === "Did not bat"

                return {
                  name:
                    batter.player.name +
                    (batter.player.position === "WK" ? " (wk)" : "") +
                    (batter.player.position === "C" ? " (c)" : ""),
                  runs: didNotbat ? "" : batter.score.toString(),
                  balls: didNotbat ? "" : batter.balls.toString(),
                  strikeRate: didNotbat
                    ? ""
                    : batter.balls !== 0
                      ? ((batter.score / batter.balls) * 100).toFixed(2)
                      : "0.00",
                  dismissalText: mapDismissalText(
                    batter.wicketBowler?.shortName ?? "",
                    batter.wicketTypeName,
                    batter.wicketCatch?.shortName,
                  ),
                }
              }),
              total: item.score,
              extras: {
                byes: item.bye,
                legbyes: item.legBye,
                noballs: item.noBall,
                wides: item.wide,
                total: item.extra,
              },
              overs: item.overs,
              wickets: item.wickets,
              runRate:
                item.overs !== 0 ? (item.score / item.overs).toFixed(2) : "",
            } as CricketScorecardBatProps,
            inningBowlers: item.bowlingLine.map((bowl) => {
              return {
                name: bowl.player.name,
                overs: bowl.over,
                runs: bowl.run,
                wickets: bowl.wicket,
                economy: bowl.over !== 0 ? bowl.run / bowl.over : 0,
              }
            }) as CricketScorecardBowlProps,
            fow: {
              // tableName: "Fall of Wickets",
              headings: ["FOW", "Over", "Batter"],
              columnClassName: ["text-center", "text-center", "text-left"],
              data: item.battingLine
                .filter(
                  (batter) =>
                    batter.fowScore !== undefined &&
                    batter.fowOver !== undefined,
                )
                .sort((a, b) => a.fowOver! - b.fowOver!)
                .map((batter, idx) => {
                  return {
                    id: batter.player.id,
                    Batter: `${batter.player.name}`,
                    FOW: `${idx}/${batter.fowScore ?? 0}`,
                    Over: `${batter.fowOver ?? 0}`,
                  }
                }),
            },
            partnerships: {
              // tableName: "Partnerships",
              headings: ["Batter 1", "Score", "Batter 2"],
              columnClassName: ["text-left", "text-center ", "text-right"],
              data: item.partnerships.map((partnership) => {
                return {
                  id: partnership.player1.id + partnership.player2.id,
                  "Batter 1": partnership.player1.name,
                  Score: `${partnership.score} (${partnership.balls})`,
                  "Batter 2": partnership.player2.name,
                }
              }),
            },
          }
        }),
    }
  }

  // override
  matchIncidentsMapper(
    matchIncidents: Sofascore_Cricket_Incident[],
    inningLabels?: string[],
  ): CricketInningIncident[] {
    const mappedIncidents = matchIncidents.reduce(
      (acc, incident) => {
        if (!acc[incident.inningNumber]) {
          acc[incident.inningNumber] = {
            inningLabel:
              inningLabels?.[incident.inningNumber - 1] ??
              `Inning ${incident.inningNumber}`,
            inningIncidents: [],
          }
        }

        let currentOverIndex = acc[
          incident.inningNumber
        ].inningIncidents.findIndex((item) => item.over === incident.over)

        if (currentOverIndex === -1) {
          acc[incident.inningNumber].inningIncidents.push({
            over: incident.over,
            bowlers: [],
            batters: [],
            runs: 0,
            teamScore: "0/0",
            balls: [],
            wickets: 0,
          })
          currentOverIndex =
            acc[incident.inningNumber].inningIncidents.length - 1
        }

        let currentOver =
          acc[incident.inningNumber].inningIncidents[currentOverIndex]

        currentOver = {
          ...currentOver,
          bowlers: Array.from(
            new Set([
              ...(currentOver?.bowlers ?? []),
              incident.bowler.shortName,
            ]),
          ),
          batters: Array.from(
            new Set([
              ...(currentOver?.batters ?? []),
              incident.batsman.shortName,
            ]),
          ),
          runs: currentOver.runs + incident.totalRuns,
          teamScore: incident.score.split("/").reverse().join("/"),
          balls: [
            ...currentOver.balls,
            {
              ball: incident.ball,
              value: incident.incidentClassLabel,
              commentary: incident.commentary,
            },
          ],
          wickets: currentOver.wickets + (incident.wicket ? 1 : 0),
        }

        acc[incident.inningNumber].inningIncidents[currentOverIndex] =
          currentOver
        return acc
      },
      {} as Record<number, CricketInningIncident>,
    )

    return Object.values(mappedIncidents)
  }

  override matchLineupsMapper(
    lineups: Sofascore_Lineup,
    teamCountry?: string,
    teamname?: string,
    overseasPlayerCheck: boolean = false,
  ): MatchLineup {
    return super.matchLineupsMapper(lineups, teamCountry, teamname, true)
  }
}

export const cricketService = new CricketService()

function mapDismissalText(
  bowlerName: string,
  wicketType: string,
  fielderName?: string,
): string {
  switch (wicketType) {
    case "Not out":
      return `not out`
    case "Bowled":
      return `b: ${bowlerName}`
    case "Caught":
      return `c: ${fielderName} b: ${bowlerName}`
    case "Caught & Bowled":
      return `c&b: ${bowlerName}`
    case "LBW":
      return `lbw: ${bowlerName}`
    case "Run out":
      return `run out (${fielderName})`
    case "Stumped":
      return `stumped b: ${bowlerName}`
    case "Hurt":
      return `retired hurt`
    case "Hit wicket":
      return `hit wicket b: ${bowlerName}`
    case "Obstructing the field":
      return `obstructing the field b: ${bowlerName}`
    default:
      return ""
  }
}

function formatScore(
  inning1?: Sofascore_Score_Inning,
  inning2?: Sofascore_Score_Inning,
) {
  const secondInnings = inning2
    ? `, ${inning2?.wickets ?? 0}/${inning2?.score ?? 0}${/*event.Tr1CD2 === 1 ? "d" : */ ""}`
    : ""

  const score = [
    `${inning1?.wickets ?? 0}/${inning1?.score ?? 0}${/*event.Tr1CD1 === 1 ? "d" : */ ""}${secondInnings}`,
  ]
  if (inning1?.overs !== undefined && inning1?.overs > 0 && !inning2) {
    score.push(`(${inning1?.overs ?? 0})`)
  }

  return score
}
