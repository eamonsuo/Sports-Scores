import GolfSchedule from "@/components/golf/GolfScheduleList";
import { golfLIVSchedule } from "@/services/golf.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;

  const pageData = await golfLIVSchedule(season);

  if (pageData === null) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <GolfSchedule data={pageData.schedule} season={season} />
    </div>
  );
}
