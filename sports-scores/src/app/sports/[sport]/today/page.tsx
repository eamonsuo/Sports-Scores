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
