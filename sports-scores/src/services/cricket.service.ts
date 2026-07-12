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
import {
  CricketInningIncident,
  CricketMatchDetails,
  CricketScorecardBatProps,
  CricketScorecardBowlProps,
  CricketScorecardPage,
  Sofascore_Cricket_Incident,
  Sofascore_Cricket_Inning,
} from "@/types/cricket"
import { DeepPartial, MatchSummary, SPORT } from "@/types/misc"
import { Sofascore_Event } from "@/types/sofascore"
import { SofascoreSport } from "./sofascore.service"

class CricketService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: withDevCache(
          "cricket",
          "last-matches",
          fetchCricketLastMatches,
        ),
        fetchNextEvents: withDevCache(
          "cricket",
          "next-matches",
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
          "team-last-matches",
          fetchCricketTeamLastMatches,
        ),
        fetchTeamNextEvents: withDevCache(
          "cricket",
          "team-next-matches",
          fetchCricketTeamNextMatches,
        ),
      },
      SPORT.CRICKET,
      CRICKET_CATEGORIES,
      CRICKET_LEAGUES,
      CRICKET_LADDER_HEADINGS,
    )
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

    const [matchInnings, matchIncidents] = await Promise.all([
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

    return {
      matchDetails,
      matchScorecard: this.matchInningsMapper(matchInnings?.innings ?? []),
      matchIncidents: this.matchIncidentsMapper(
        (matchIncidents?.incidents ?? []).reverse(),
      ),
      matchLineups,
    }
  }

  override eventMapper(
    event: Sofascore_Event,
    options?: DeepPartial<MatchSummary>,
  ): MatchSummary {
    const twoInnings =
      (event.homeScore.innings?.inning1 && event.homeScore.innings?.inning2) ||
      (event.awayScore.innings?.inning1 && event.awayScore.innings?.inning2)
    let home2Ing = twoInnings
      ? `, ${event.homeScore.innings?.inning2?.wickets ?? 0}/${event.homeScore.innings?.inning2?.score ?? 0}${/*event.Tr1CD2 === 1 ? "d" : */ ""}`
      : ""
    let away2Ing = twoInnings
      ? `, ${event.awayScore.innings?.inning2?.wickets ?? 0}/${event.awayScore.innings?.inning2?.score ?? 0}${/*event.Tr2CD2 === 1 ? "d" : */ ""}`
      : ""

    return super.eventMapper(event, {
      ...options,
      roundLabel:
        event.roundInfo?.name ??
        (event.tournament.name.split(",").length > 1
          ? event.tournament.name.split(",").at(-1)
          : "Matches"),
      competitorDetails: [
        {
          ...options?.competitorDetails?.[0],
          score: `${event.homeScore.innings?.inning1?.wickets ?? 0}/${event.homeScore.innings?.inning1?.score ?? 0}${/*event.Tr1CD1 === 1 ? "d" : */ ""}${home2Ing}`,
        },
        {
          ...options?.competitorDetails?.[1],
          score: `${event.awayScore.innings?.inning1?.wickets ?? 0}/${event.awayScore.innings?.inning1?.score ?? 0}${/*event.Tr2CD1 === 1 ? "d" : */ ""}${away2Ing}`,
        },
      ],
    })
  }

  matchInningsMapper(innings: Sofascore_Cricket_Inning[]) {
    const inningsData = innings.map((item) => {
      return {
        inningLabel: `${item.battingTeam.shortName} ${item.number === 1 || item.number === 2 ? "1st" : "2nd"}`,
        inningBatters: {
          batters: item.battingLine.map((batter) => {
            return {
              name: batter.playerName,
              runs: batter.score,
              balls: batter.balls,
              strikeRate:
                batter.balls !== 0 ? (batter.score / batter.balls) * 100 : 0,
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
        } as CricketScorecardBatProps,
        inningBowlers: item.bowlingLine.map((bowl) => {
          return {
            name: bowl.playerName,
            overs: bowl.over,
            runs: bowl.run,
            wickets: bowl.wicket,
            economy: bowl.run / bowl.over,
          }
        }) as CricketScorecardBowlProps,
      }
    })

    return {
      matchState: "LIVE",
      data: inningsData,
    } as CricketScorecardPage
  }

  // override
  matchIncidentsMapper(
    matchIncidents: Sofascore_Cricket_Incident[],
  ): CricketInningIncident[] {
    const inningNumbers = new Set(
      matchIncidents.map((incident) => incident.inningNumber),
    )

    const mappedIncidents = matchIncidents.reduce(
      (acc, incident) => {
        if (!acc[incident.inningNumber]) {
          acc[incident.inningNumber] = {
            inningLabel: `Inning ${incident.inningNumber}`,
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
          teamScore: incident.score,
          balls: [...currentOver.balls, incident.incidentClassLabel],
        }

        acc[incident.inningNumber].inningIncidents[currentOverIndex] =
          currentOver
        return acc
      },
      {} as Record<number, CricketInningIncident>,
    )

    return Object.values(mappedIncidents)
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
