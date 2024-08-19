import { fetchF1Races } from "@/api/f1.api";
import RaceList from "@/components/f1/RaceList";
import Placeholder from "@/components/misc/Placeholder";
import { mapF1SessionFields } from "@/lib/dataMapping";

export default async function Page() {
  const races = await fetchF1Races(2024);

  if (typeof races === "string") {
    return <Placeholder>{races}</Placeholder>;
  }

  const mappedraces = mapF1SessionFields(races);

  return <RaceList data={mappedraces} />;
}
