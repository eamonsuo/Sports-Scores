import GolfTourHeader from "@/components/golf/GolfTourHeader";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <GolfTourHeader href="/sports/golf/pga/schedule" tourName="PGA Tour" />
    </div>
  );
}
