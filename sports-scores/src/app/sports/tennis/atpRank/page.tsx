import Ladder from "@/components/all-sports/Ladder";
import Placeholder from "@/components/misc-ui/Placeholder";
import { tennisService } from "@/services/tennis.service";
import { RankingList } from "@/types/tennis";

export default async function Page() {
  const pageData = await tennisService.tennisRankings(RankingList.ATP);

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.standings.map((table, index) => (
        <Ladder
          key={index}
          data={table.data}
          headings={table.headings}
          placingCategories={table.placingCategories}
        />
      ))}
    </div>
  );
}
