import { fetchAllF1Sessions } from "@/api/f1.api";
import RaceList from "@/components/f1/RaceList";
import Placeholder from "@/components/misc/Placeholder";
import { mapF1SessionFields } from "@/lib/dataMapping";
import { SessionSummary } from "@/types/f1";

export default async function Page() {
  const races = await fetchAllF1Sessions(2024);

  if (typeof races === "string") {
    return <Placeholder>{races}</Placeholder>;
  }

  const mappedraces = mapF1SessionFields(races).sort(compareF1Sessions);

  // const grandPrix = mappedraces.map()

  return <RaceList data={mappedraces} />;
}

function compareF1Sessions(a: SessionSummary, b: SessionSummary) {
  let aDate = new Date(a.startDate);
  let bDate = new Date(b.startDate);

  if (aDate < bDate) {
    return -1;
  } else if (aDate > bDate) {
    return 1;
  }
  return 0;
}
