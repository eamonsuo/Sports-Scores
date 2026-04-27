import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import DateNav from "@/components/misc-ui/DateNav";
import Placeholder from "@/components/misc-ui/Placeholder";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { getClientDate } from "@/lib/serverUtils";
import { SPORT } from "@/types/misc";
import { TZDate } from "@date-fns/tz/date";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  const config = SPORT_ROUTE_CONFIG[sport as SPORT];

  const date = (await searchParams)?.date; //Gets ?date= query string
  const curDate = await getClientDate();
  const parsedDate =
    date === undefined ? curDate : new TZDate(date as string, curDate.timeZone);

  const pageData = await config.service.matchesByDate(parsedDate);

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <>
      <div className="mt-4"></div>
      <FixtureRoundList
        data={pageData.fixtures}
        curRound={pageData.currentRound}
      />
      <DateNav date={parsedDate} />
    </>
  );
}
