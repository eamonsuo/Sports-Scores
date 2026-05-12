import {
  CardVariant,
  DisplayTypes,
  FixtureRound,
  LeagueSeasonConfig,
  MatchStatus,
  MatchSummary,
} from "@/types/misc"
import { TZDate } from "@date-fns/tz/date"
import { format } from "date-fns/format"
import { shortenTeamNames } from "./projUtils"
import { getClientTimezone } from "./serverUtils"

const DEFAULT_LEAGUE_SEASON_CONFIG: LeagueSeasonConfig = {
  name: "",
  slug: "",
  seasons: [],
}
const DEFAULT_DISPLAY_TYPE = DisplayTypes.ROUND

export async function mapFixtureRounds(
  matches: MatchSummary[],
  leagueConfig:
    | LeagueSeasonConfig
    | LeagueSeasonConfig[] = DEFAULT_LEAGUE_SEASON_CONFIG,
  cardVariant?: CardVariant,
) {
  const isMultiLeague = Array.isArray(leagueConfig)
  const displayType: DisplayTypes = isMultiLeague
    ? DisplayTypes.LEAGUE
    : (leagueConfig.display ?? DisplayTypes.ROUND)
  const byes = isMultiLeague ? undefined : leagueConfig.byes
  const showByes = byes !== undefined
  const timezone = await getClientTimezone()

  return Object.values(
    matches.reduce(
      (acc, match) => {
        let roundLabel = ""
        switch (displayType) {
          case DisplayTypes.ROUND:
            roundLabel = match.roundLabel ?? "Round 0"
            break
          case DisplayTypes.DATE:
            roundLabel =
              // match.roundLabel ??
              format(
                new TZDate(match.startDate, timezone ?? "UTC"),
                "eee d MMM",
              )
            break
          case DisplayTypes.LEAGUE:
            roundLabel = isMultiLeague
              ? (leagueConfig.find((l) => l.slug === match.leagueId)?.name ??
                "")
              : (match.roundLabel ?? "")
            break
        }

        if (!acc[roundLabel]) {
          acc[roundLabel] = {
            roundLabel,
            matches: [],
            byes: byes,
            cardVariant,
          }
        }

        acc[roundLabel].matches.push(match)
        acc[roundLabel].roundSlug =
          displayType === DisplayTypes.LEAGUE
            ? `${match.sport}/${match.leagueId}/${match.seasonId}`
            : undefined
        if (showByes) {
          acc[roundLabel].byes = acc[roundLabel]?.byes?.filter(
            (team) =>
              shortenTeamNames(team.name ?? "") !==
                match.competitorDetails[0]?.name &&
              shortenTeamNames(team.name ?? "") !==
                match.competitorDetails[1]?.name,
          )
        }

        return acc
      },
      {} as Record<string, FixtureRound>,
    ),
  )
}

export function getCurrentRound(
  rounds: FixtureRound[],
  leagueConfig: DisplayTypes = DEFAULT_DISPLAY_TYPE,
) {
  switch (leagueConfig) {
    case DisplayTypes.ROUND:
    case DisplayTypes.DATE:
      // Find first round with upcoming matches
      return (
        rounds.find((r) =>
          r.matches.some(
            (m) =>
              m.status === MatchStatus.UPCOMING ||
              m.status === MatchStatus.LIVE,
          ),
        )?.roundLabel ??
        rounds[rounds.length - 1]?.roundLabel ??
        "Round 0"
      )

    case DisplayTypes.LEAGUE:
      return rounds[0].roundLabel ?? "League"
  }
}
