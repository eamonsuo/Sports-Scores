import { fetchF1TeamStandings } from "@/api/f1.api";
import F1TeamStandings from "@/components/f1/F1TeamStandings";
import { redirect } from "next/navigation";

export default async function Page() {
  const standings = await fetchF1TeamStandings(2024);

  if (standings === null) {
    redirect("/misc/apiError");
  }

  return <F1TeamStandings data={standings} />;
}
