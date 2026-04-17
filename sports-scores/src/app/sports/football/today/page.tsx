import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import DateNav from "@/components/misc-ui/DateNav";
import Placeholder from "@/components/misc-ui/Placeholder";
import { getClientDate } from "@/lib/serverUtils";
import { footballService } from "@/services/football.service";
import { TZDate } from "@date-fns/tz/date";

// export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const date = (await searchParams)?.date; //Gets ?date= query string
  const curDate = await getClientDate();
  const parsedDate =
    date === undefined ? curDate : new TZDate(date as string, curDate.timeZone);

  const pageData = await footballService.footballMatchesByDate(parsedDate);

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
