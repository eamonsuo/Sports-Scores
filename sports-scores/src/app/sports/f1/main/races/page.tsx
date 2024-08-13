import { fetchF1Races } from "@/api/f1.api";
import RaceList from "@/components/f1/RaceList";
import { mapF1SessionFields } from "@/lib/dataMapping";
import { redirect } from "next/navigation";

export default async function Page() {
  const races = await fetchF1Races(2024);

  if (races === null) {
    redirect("/misc/apiError");
  }

  const mappedraces = mapF1SessionFields(races);

  return <RaceList data={mappedraces} />;
}
