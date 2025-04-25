import Placeholder from "@/components/misc/Placeholder";
import NFLLadder from "@/components/nfl/NFLLadder";
import { NFLStandings } from "@/services/nfl.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await NFLStandings();

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.tables.map((item) => (
        <NFLLadder key={item.tableName} data={item} />
      ))}
    </div>
  );
  return;
}
