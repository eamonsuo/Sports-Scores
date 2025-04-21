import GolfSchedule from "@/components/golf/GolfScheduleList";
import { golfLIVSchedule } from "@/services/golf.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await golfLIVSchedule();

  if (pageData === null) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <GolfSchedule data={pageData.schedule} />
    </div>
  );
}
