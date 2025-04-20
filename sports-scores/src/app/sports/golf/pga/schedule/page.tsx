import GolfSchedule from "@/components/golf/GolfSchedule";
import { golfPGASchedule } from "@/services/golf.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await golfPGASchedule();

  if (data === null) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <GolfSchedule data={data} />
    </div>
  );
}
