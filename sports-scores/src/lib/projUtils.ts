import { fetchAllsportsApi } from "@/endpoints/allsports.api"
import { updateGlobalApiQuota } from "@/lib/apiCounter"
import {
  ClientLeagueSeasonConfig,
  CountryFlagCode,
  LadderConfig,
  LadderGroupConfig,
  LeagueSeasonConfig,
  SPORT,
  TVChannel,
  TVChannelConfig,
} from "@/types/misc"
import { PlayoffPictureConfig } from "@/types/playoff-picture"
import { Sofascore_Events_Response, Sofascore_Score } from "@/types/sofascore"
import { addHours } from "date-fns/addHours"
import { format } from "date-fns/format"
import { FALLBACK_IMAGE } from "./constants"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchRapidApi(
  baseURL: string = process.env.ALLSPORTS_BASEURL ?? "",
  endpoint: string,
  sport: SPORT,
) {
  if (baseURL === "") return null

  const url = baseURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (res.status === 204) return null

  if (!res.ok) {
    // Primary sport API failed (rate limit, quota, outage, etc). This was
    // previously swallowed silently, making backend failures indistinguishable
    // from "no events today" once the AllSports fallback also returned null.
    console.error(
      `[fetchRapidApi] ${sport} request failed (${res.status} ${res.statusText}) for ${url}. Falling back to AllSports API.`,
    )

    const fallback = await fetchAllsportsApi(endpoint)

    if (!fallback) {
      console.error(
        `[fetchRapidApi] ${sport} AllSports API fallback also failed for endpoint ${endpoint}.`,
      )
    }

    return fallback
  }

  updateQuota(res, sport)

  const text = await res.text()

  try {
    return JSON.parse(text)
  } catch (err) {
    console.error("JSON parse failed", err)

    const match = String(err).match(/position (\d+)/)
    const pos = Number(match?.[1])

    if (!Number.isNaN(pos)) {
      console.log("Error position:", pos)
      console.log(
        text.substring(
          Math.max(0, pos - 500),
          Math.min(text.length, pos + 500),
        ),
      )
    }

    return null
  }

  return res.json()
}

export function updateQuota(response: Response, sport: SPORT) {
  const limit = response.headers.get("x-ratelimit-requests-limit")
  const remaining = response.headers.get("x-ratelimit-requests-remaining")
  if (remaining && limit) {
    updateGlobalApiQuota(parseInt(remaining, 10), parseInt(limit, 10), sport)
  }
}

/**
 * Fetches events for a list of categories on a given date and flattens the results.
 * Requests are batched to respect API rate limits (batch size defaults to no batching).
 */
export async function fetchEventsByCategoryDate<
  T extends Sofascore_Events_Response,
>(
  fetchApi: (endpoint: string) => Promise<T | null>,
  categoryPathPrefix: string,
  category: string[],
  date: Date,
  maxRequestsPerSecond: number = 4,
): Promise<T> {
  const responses: (T | null)[] = []

  for (let i = 0; i < category.length; i += maxRequestsPerSecond) {
    const batch = category.slice(i, i + maxRequestsPerSecond)
    const batchResponses = await Promise.all(
      batch.map((cat) =>
        fetchApi(
          `${categoryPathPrefix}/category/${cat}/events/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        ),
      ),
    )

    responses.push(...batchResponses)

    if (i + maxRequestsPerSecond < category.length) {
      await delay(1000)
    }
  }

  return {
    events: responses.flatMap((r) => r?.events ?? []),
  } as T
}

export function calculateMatchResult(
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
  finished: boolean,
) {
  let winningTeam: string = ""
  let winningMargin: number
  let description: string = ""

  finished ? (description = "won by") : (description = "lead by")

  if (homeScore > awayScore) {
    winningMargin = homeScore - awayScore
    winningTeam = homeName
  } else if (homeScore < awayScore) {
    winningMargin = awayScore - homeScore
    winningTeam = awayName
  } else {
    winningMargin = 0
  }

  return winningMargin == 0
    ? finished
      ? "Match Drawn"
      : `${homeName} ${description} ${0}`
    : `${winningTeam} ${description} ${winningMargin}`
}

export function setMatchSummary(
  status: string,
  homeName: string,
  homeScore: number,
  awayName: string,
  awayScore: number,
) {
  switch (status) {
    case "notstarted":
      return ``
    case "postponed":
      return "Match Postponed"
    case "finished":
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        true,
      )
    case "penalties":
      return (homeScore > awayScore ? homeName : awayName) + " won on penalties"
    default:
      return calculateMatchResult(
        homeName,
        homeScore,
        awayName,
        awayScore,
        false,
      )
  }
}

export function setTimer(
  statusType: string,
  statusDescription: string,
  startDate: Date,
  timePlayed: number,
  periodLength: number,
) {
  switch (statusType) {
    case "notstarted":
      return startDate
    case "inprogress":
      const remainingTime = periodLength - (timePlayed % periodLength)
      if (!remainingTime || timePlayed % periodLength === 0)
        return statusDescription

      const remainingminutes = Math.floor(remainingTime / 60)
      const remainingSeconds = remainingTime % 60
      return `${statusDescription} ${remainingminutes}:${remainingSeconds.toString().padStart(2, "0")}`
    case "postponed":
    case "finished":
    default:
      return statusDescription
  }
}

export function setSeriesInfo(
  homeName: string,
  homeGamesWon: number | undefined,
  awayName: string,
  awayGamesWon: number | undefined,
) {
  if (homeGamesWon !== undefined && awayGamesWon !== undefined) {
    if (homeGamesWon > awayGamesWon) {
      return `${homeName} leads series ${homeGamesWon}-${awayGamesWon}`
    } else if (awayGamesWon > homeGamesWon) {
      return `${awayName} leads series ${awayGamesWon}-${homeGamesWon}`
    } else {
      return `Series tied at ${homeGamesWon}-${awayGamesWon}`
    }
  }
  return undefined
}

export function getCountryImageUrl(countryCode?: CountryFlagCode) {
  if (countryCode === null || countryCode === undefined) {
    return FALLBACK_IMAGE
  }

  return `https://flagcdn.com/${countryCode}.svg`
}

export function shortenTeamNames(team: string) {
  switch (team) {
    //AFL
    case "Greater Western Sydney Giants":
      return "GWS Giants"
    case "North Melbourne Kangaroos":
      return "North Melbourne"
    case "North Melbourne Kangaroos II":
      return "North Melbourne II"
    //NFL
    case "Washington Commanders":
      return "Washington Comm."
    case "Tampa Bay Buccaneers":
      return "Tampa Bay Buccs"
    case "Los Angeles Chargers":
      return "LA Chargers"
    //NRL
    case "North Queensland Cowboys":
      return "North QLD Cowboys"
    case "St. George Illawarra Dragons":
      return "St George Illawarra"
    case "South Sydney Rabbitohs":
      return "South Sydney Rabbits"
    case "New Zealand Warriors":
      return "NZ Warriors"
    case "New South Wales Sky Blues":
      return "New South Wales Blues"
    default:
      return team
  }
}

/**
 * Format time as a string in user's timezone.
 * Use this in client components to format times.
 * Client-side: formats in user's browser timezone
 * Server-side: formats in server's timezone (UTC)
 */
export function formatTime(date: Date | number | null | undefined): string {
  if (!date) return ""

  const dateObj = typeof date === "number" ? new Date(date) : date

  // Format in execution environment's timezone
  return format(dateObj, "h:mm a")
}

/**
 * Format date in long format (EEE MMM d yyyy) in user's timezone.
 * Use this in client components to format dates.
 * Client-side: formats in user's browser timezone
 * Server-side: formats in server's timezone (UTC)
 */
export function formatDateLong(date: Date | number | null | undefined): string {
  if (!date) return ""

  const dateObj = typeof date === "number" ? new Date(date) : date

  // Format in execution environment's timezone
  return format(dateObj, "EEE d MMM yyyy")
}

export const formatDate = (date: Date) => format(date, "d MMM")
export const formatDateYear = (date: Date) => format(date, "d MMM yyyy")

export function formatPeriodScores(
  homeScore: Sofascore_Score,
  awayScore: Sofascore_Score,
  showWinnerFirst: boolean = false,
  winner?: number,
) {
  const periodKeys = Object.keys(homeScore).filter(
    (key) => key.includes("period") && !key.includes("TieBreak"),
  )

  // Determine if we should reverse scores (show away/home instead of home/away)
  const shouldReverse = showWinnerFirst && winner === 2

  const periodScores = periodKeys.map((periodKey) => {
    const tieBreakKey = `${periodKey}TieBreak` as keyof Sofascore_Score
    const homeVal = homeScore[periodKey as keyof Sofascore_Score]
    const awayVal = awayScore[periodKey as keyof Sofascore_Score]

    let scoreStr = shouldReverse
      ? `${awayVal}-${homeVal}`
      : `${homeVal}-${awayVal}`

    // Check if there's a tie break for this period
    if (
      homeScore[tieBreakKey] !== undefined &&
      awayScore[tieBreakKey] !== undefined
    ) {
      const homeTB = homeScore[tieBreakKey]
      const awayTB = awayScore[tieBreakKey]
      scoreStr += shouldReverse
        ? ` (${awayTB}-${homeTB})`
        : ` (${homeTB}-${awayTB})`
    }

    return scoreStr
  })

  return periodScores.join(", ")
}

export function setTennisMatchSummary(
  status: string,
  winner: number,
  homeName: string,
  awayName: string,
  homeScore: number,
  awayScore: number,
) {
  switch (status) {
    case "notstarted":
      return ``
    case "postponed":
      return "Match Postponed"
    case "finished":
      return winner !== undefined
        ? `${winner === 1 ? homeName : awayName} wins`
        : ""
    case "inprogress":
      if (homeScore > awayScore) {
        return `${homeName} leading ${homeScore}-${awayScore}`
      } else if (awayScore > homeScore) {
        return `${awayName} leading ${awayScore}-${homeScore}`
      }
      return `Match tied at ${homeScore}-${awayScore}`
    default:
      return ""
  }
}

export function getSportConfigurations(
  leagueConfigs: LeagueSeasonConfig[],
  leagueId?: string,
  seasonId?: string,
) {
  const leagueConfig = leagueConfigs.find((l) => l.slug === leagueId)

  const seasonConfig = leagueConfig?.seasons.find(
    (s) => s.slug.split("/")[0] === seasonId,
  )

  const ladderConfig = seasonConfig?.ladderConfig
  const tvConfig = seasonConfig?.tvguide

  return { leagueConfig, seasonConfig, ladderConfig, tvConfig }
}

export function stripLeagueSeasonConfig(
  config: LeagueSeasonConfig[],
): ClientLeagueSeasonConfig[] {
  return config.map(({ seasons, ...rest }) => ({
    ...rest,
    seasons: seasons.map(
      ({ ladderConfig, tvguide, ...seasonRest }) => seasonRest,
    ),
  }))
}

export function ladderConfigMap(
  ladderGroupConfig?: LadderGroupConfig[] | LadderGroupConfig,
  playoffPictureConfig?: PlayoffPictureConfig,
): LadderConfig {
  let ladderGroup: LadderGroupConfig[]

  if (Array.isArray(ladderGroupConfig)) {
    ladderGroup = ladderGroupConfig
  } else if (ladderGroupConfig) {
    ladderGroup = [ladderGroupConfig]
  } else {
    ladderGroup = []
  }

  return { ladderGroup, playoffPictureConfig }
}

export function tvGuideConfigCreate(
  channel: TVChannel,
  addHoursToStart: number,
  addHoursToEnd: number,
): TVChannelConfig {
  return {
    channel,
    startTime: (date: Date) => addHours(date, addHoursToStart),
    endTime: (date: Date) => addHours(date, addHoursToEnd),
  }
}

export function mapPlayerPosition(position: string | null | undefined) {
  switch (position) {
    //Cricket
    case "B":
      return "Bowler"
    case "BM":
    case "WK":
      return "Batter"
    case "AR":
      return "All-Rounder"
    default:
      return position ?? ""
  }
}
