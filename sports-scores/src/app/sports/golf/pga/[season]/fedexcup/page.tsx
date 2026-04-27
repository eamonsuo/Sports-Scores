import Ladder from "@/components/all-sports/Ladder";
import { golfFedExRankings } from "@/services/golf.service";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;

  var pageData = await golfFedExRankings(season);

  if (pageData === null) {
    return <>NO DATA</>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <Ladder
        data={pageData.data}
        headings={pageData.headings}
        placingCategories={pageData.placingCategories}
      />
    </div>
  );
}
