import ClientSportsPage from "@/components/all-sports/ClientSportsPage"
import FixtureList from "@/components/all-sports/FixtureList"
import FixtureRoundList from "@/components/all-sports/FixtureRoundList"
import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle"
import DateNav from "@/components/misc-ui/DateNav"
import { getClientDate } from "@/lib/serverUtils"
import { americanFootballService } from "@/services/american-football.service"
import { aussieRulesService } from "@/services/aussie-rules.service"
import { baseballService } from "@/services/baseball.service"
import { basketballService } from "@/services/basketball.service"
import { cricketMatchesByDate } from "@/services/cricket.service"
import { footballService } from "@/services/football.service"
import { golfService } from "@/services/golf.service"
import { iceHockeyService } from "@/services/ice-hockey.service"
import { motorsportService } from "@/services/motorsport.service"
import { netballMatchesByDate } from "@/services/netball.service"
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
    cricketoday,
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
    netballToday,
    surfingToday,
    dartsToday,
    cyclingToday,
  ] = await Promise.all([
    cricketMatchesByDate(parsedDate),
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
    netballMatchesByDate(parsedDate),
    surfingService.matchesByDate(parsedDate),
    null,
    null,
  ])

  const allSports: FixtureRound[] = ([] as FixtureRound[])
    .concat([
      {
        matches: cricketoday ?? [],
        roundLabel: "Cricket",
        roundSlug: `${SPORT.CRICKET}/main/matches`,
      },
    ])
    .concat(rugbyLeagueToday?.fixtures ?? [])
    .concat(aussieRulesToday?.fixtures ?? [])
    .concat(americanFootballToday?.fixtures ?? [])
    .concat(golfToday?.fixtures ?? [])
    .concat(motorsportToday?.fixtures ?? [])
    .concat(surfingToday?.fixtures ?? [])
    .concat(footballToday?.fixtures ?? [])
    .concat(basketballToday?.fixtures ?? [])
    .concat(baseballToday?.fixtures ?? [])
    .concat(iceHockeyToday?.fixtures ?? [])
    .concat(tennisToday?.fixtures ?? [])
    .concat(rugbyUnionToday?.fixtures ?? [])
    .concat(netballToday?.fixtures ?? [])
  // .concat(dartsToday?.fixtures ?? [])
  // .concat(cyclingToday?.fixtures ?? [])

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.RUGBY_LEAGUE} leagues={[]} />
      <div className="overflow-y-auto">
        <ClientSportsPage
          options={pageSettings(allSports)}
          defaultState="league"
        />
      </div>

      <DateNav date={parsedDate} />
    </div>
  )
}

function pageSettings(data: FixtureRound[]): {
  btnLabel: string
  component: ReactNode
  state: string
}[] {
  const fixtureList = data
    .flatMap((item) => item.matches)
    .filter(
      (match) => match.sport !== SPORT.TENNIS && match.sport !== SPORT.BASEBALL,
    )
    .sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })

  return [
    {
      btnLabel: `Leagues`,
      component: (
        <FixtureRoundList data={data} curRound={data[0]?.roundLabel ?? ""} />
      ),
      state: "league",
    },
    {
      btnLabel: `TV Guide`,
      component: <FixtureList data={fixtureList} />,
      state: "list",
    },
  ]
}
