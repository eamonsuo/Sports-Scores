import FixtureRoundList from "@/components/all-sports/FixtureRoundList"
import OrderedFixtureRoundList from "@/components/all-sports/OrderedFixtureRoundList"
import DateNav from "@/components/misc-ui/DateNav"
import Placeholder from "@/components/misc-ui/Placeholder"
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig"
import { getClientDate } from "@/lib/serverUtils"
import { leagueOrderStorageKey } from "@/lib/storageKeys"
import { SPORT } from "@/types/misc"
import { TZDate } from "@date-fns/tz/date"

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ sport: string }>
}) {
  const { sport } = await params
  const config = SPORT_ROUTE_CONFIG[sport as SPORT]

  const date = (await searchParams)?.date //Gets ?date= query string
  const curDate = await getClientDate()
  const parsedDate =
    date === undefined ? curDate : new TZDate(date as string, curDate.timeZone)

  const pageData = await config.service.matchesByDate(parsedDate)

  if (pageData === null) {
    const [year, month, day] = (date as string)?.split("-").map(Number) ?? []
    const parsedDateUpcoming =
      date === undefined
        ? curDate
        : new TZDate(year, month - 1, day, curDate.timeZone)

    const upcomingMatches =
      await config.service.matchesUpcoming(parsedDateUpcoming)

    if (upcomingMatches) {
      return (
        <>
          <p className="mt-4 shrink-0 px-4 text-center text-sm text-black dark:text-neutral-200">
            NO EVENT DATA
          </p>
          <p className="my-4 shrink-0 px-4 text-center text-sm text-black dark:text-neutral-400">
            The next Event Date can be seen below:
          </p>
          <FixtureRoundList
            data={upcomingMatches.fixtures}
            curRound={upcomingMatches.currentRound}
          />
          <DateNav
            date={parsedDateUpcoming}
            nextDate={
              new TZDate(upcomingMatches.nextEventDate, curDate.timeZone)
            }
          />
        </>
      )
    }

    return (
      <>
        <Placeholder>NO DATA</Placeholder>
        <DateNav date={parsedDate} />
      </>
    )
  }

  const defaultLeagueOrder = config.leagues.map((league) => league.slug)
  const defaultExcludedFromToday = config.leagues
    .filter((league) => league.excludeFromToday)
    .map((league) => league.slug)

  return (
    <>
      <div className="mt-4"></div>
      <OrderedFixtureRoundList
        data={pageData.fixtures}
        storageKey={leagueOrderStorageKey(sport)}
        defaultOrder={defaultLeagueOrder}
        defaultExcludedFromToday={defaultExcludedFromToday}
        groupBy="leagueSlug"
        pinnedRoundLabel="My Teams"
        filterHidden
      />
      <DateNav date={parsedDate} />
    </>
  )
}
