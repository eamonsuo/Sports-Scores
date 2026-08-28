import ClientSportsPage from "@/components/all-sports/ClientSportsPage"
import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle"
import OrderedFixtureRoundList from "@/components/all-sports/OrderedFixtureRoundList"
import TVGuide from "@/components/all-sports/TVGuide"
import DateNav from "@/components/misc-ui/DateNav"
import { FOOTER_LINKS } from "@/lib/constants"
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { getClientDate } from "@/lib/serverUtils"
import { FOOTER_ORDER_STORAGE_KEY } from "@/lib/storageKeys"
import { americanFootballService } from "@/services/american-football.service"
import { aussieRulesService } from "@/services/aussie-rules.service"
import { baseballService } from "@/services/baseball.service"
import { basketballService } from "@/services/basketball.service"
import { cricketService } from "@/services/cricket.service"
import { cyclingService } from "@/services/cycling.service"
import { dartsService } from "@/services/darts.service"
import { footballService } from "@/services/football.service"
import { golfService } from "@/services/golf.service"
import { iceHockeyService } from "@/services/ice-hockey.service"
import { motorsportService } from "@/services/motorsport.service"
import { rugbyLeagueService } from "@/services/rugby-league.service"
import { rugbyUnionService } from "@/services/rugby-union.service"
import { surfingService } from "@/services/surfing.service"
import { tennisService } from "@/services/tennis.service"
import { FixtureRound, SPORT } from "@/types/misc"
import { TZDate } from "@date-fns/tz/date"
import { ReactNode } from "react"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const date = (await searchParams)?.date //Gets ?date= query string
  const curDate = await getClientDate()
  const parsedDate =
    date === undefined ? curDate : new TZDate(date as string, curDate.timeZone)
  const [
    cricketToday,
    tennisToday,
    footballToday,
    basketballToday,
    baseballToday,
    americanFootballToday,
    rugbyLeagueToday,
    aussieRulesToday,
    iceHockeyToday,
    golfToday,
    motorsportToday,
    rugbyUnionToday,
    // netballToday,
    surfingToday,
    dartsToday,
    cyclingToday,
  ] = await Promise.all([
    cricketService.matchesByDate(parsedDate),
    tennisService.matchesByDate(parsedDate),
    footballService.matchesByDate(parsedDate),
    basketballService.matchesByDate(parsedDate),
    baseballService.matchesByDate(parsedDate),
    americanFootballService.matchesByDate(parsedDate),
    rugbyLeagueService.matchesByDate(parsedDate),
    aussieRulesService.matchesByDate(parsedDate),
    iceHockeyService.matchesByDate(parsedDate),
    golfService.matchesByDate(parsedDate),
    motorsportService.matchesByDate(parsedDate),
    rugbyUnionService.matchesByDate(parsedDate),
    // netballMatchesByDate(parsedDate),
    surfingService.matchesByDate(parsedDate),
    dartsService.matchesByDate(parsedDate),
    cyclingService.matchesByDate(parsedDate),
  ])

  let allSports: FixtureRound[] = ([] as FixtureRound[])
    .concat(tagSport(cricketToday?.fixtures, SPORT.CRICKET))
    .concat(tagSport(rugbyLeagueToday?.fixtures, SPORT.RUGBY_LEAGUE))
    .concat(tagSport(aussieRulesToday?.fixtures, SPORT.AUSSIE_RULES))
    .concat(tagSport(americanFootballToday?.fixtures, SPORT.AMERICAN_FOOTBALL))
    .concat(tagSport(golfToday?.fixtures, SPORT.GOLF))
    .concat(tagSport(motorsportToday?.fixtures, SPORT.MOTORSPORT))
    .concat(tagSport(surfingToday?.fixtures, SPORT.SURFING))
    .concat(tagSport(footballToday?.fixtures, SPORT.FOOTBALL))
    .concat(tagSport(basketballToday?.fixtures, SPORT.BASKETBALL))
    .concat(tagSport(baseballToday?.fixtures, SPORT.BASEBALL))
    .concat(tagSport(iceHockeyToday?.fixtures, SPORT.ICE_HOCKEY))
    .concat(tagSport(tennisToday?.fixtures, SPORT.TENNIS))
    .concat(tagSport(rugbyUnionToday?.fixtures, SPORT.RUGBY_UNION))
    // .concat(tagSport(netballToday?.fixtures, SPORT.NETBALL))
    .concat(tagSport(dartsToday?.fixtures, SPORT.DARTS))
    .concat(tagSport(cyclingToday?.fixtures, SPORT.CYCLING))

  const myTeams = allSports.filter(
    (fixtures) => fixtures.roundLabel === "My Teams",
  )

  allSports = allSports.filter((fixtures) => fixtures.roundLabel !== "My Teams")

  if (myTeams.length > 0)
    allSports.unshift({
      matches: myTeams.flatMap((fixtures) => fixtures.matches),
      roundLabel: "My Teams",
    })

  const perSportLeagueExclusion = TODAY_PAGE_SPORTS.map((sport) => {
    const leagues = SPORT_ROUTE_CONFIG[sport].leagues
    return {
      sport,
      leagueIds: leagues.map((league) => league.slug),
      defaultExcludedFromToday: leagues
        .filter((league) => league.excludeFromToday)
        .map((league) => league.slug),
    }
  })

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.DEFAULT_SPORT} leagues={[]} />
      <div className="h-full overflow-y-auto">
        <ClientSportsPage
          options={pageSettings(allSports, perSportLeagueExclusion)}
          defaultState="league"
        />
      </div>

      <DateNav date={parsedDate} />
    </div>
  )
}

function pageSettings(
  data: FixtureRound[],
  perSportLeagueExclusion: {
    sport: SPORT
    leagueIds: string[]
    defaultExcludedFromToday: string[]
  }[],
): {
  btnLabel: string
  component: ReactNode
  state: string
}[] {
  const tvGuideList = data
    .filter((fixtures) => fixtures.roundLabel !== "My Teams")
    .flatMap((item) => item.matches)
    .filter((match) => match.tv && match.tv.length > 0)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )

  return [
    {
      btnLabel: `Leagues`,
      component: (
        <OrderedFixtureRoundList
          data={data}
          storageKey={FOOTER_ORDER_STORAGE_KEY}
          defaultOrder={defaultFooterOrder}
          groupBy="sport"
          pinnedRoundLabel="My Teams"
          filterHidden
          perSportLeagueExclusion={perSportLeagueExclusion}
        />
      ),
      state: "league",
    },
    {
      btnLabel: `TV Guide`,
      component: <TVGuide data={tvGuideList} />,
      state: "list",
    },
  ]
}

// Tags each round with its sport so OrderedFixtureRoundList can sort groups to match the user's footer order.
function tagSport(
  fixtures: FixtureRound[] | undefined,
  sport: SPORT,
): FixtureRound[] {
  return (fixtures ?? []).map((fixture) => ({ ...fixture, sport }))
}

const defaultFooterOrder = FOOTER_LINKS.map((item) => item.sport)

// Sports included on the combined Today page (kept in sync with the Promise.all above).
const TODAY_PAGE_SPORTS = [
  SPORT.CRICKET,
  SPORT.RUGBY_LEAGUE,
  SPORT.AUSSIE_RULES,
  SPORT.AMERICAN_FOOTBALL,
  SPORT.GOLF,
  SPORT.MOTORSPORT,
  SPORT.SURFING,
  SPORT.FOOTBALL,
  SPORT.BASKETBALL,
  SPORT.BASEBALL,
  SPORT.ICE_HOCKEY,
  SPORT.TENNIS,
  SPORT.RUGBY_UNION,
  SPORT.DARTS,
  SPORT.CYCLING,
] as const
