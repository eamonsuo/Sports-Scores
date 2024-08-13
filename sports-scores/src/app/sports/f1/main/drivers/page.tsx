import { fetchF1DriverStandings } from "@/api/f1.api";
import F1DriverStandings from "@/components/f1/F1DriverStandings";
import { redirect } from "next/navigation";

export default async function Page() {
  const standings = await fetchF1DriverStandings(2024);

  if (standings === null) {
    redirect("/misc/apiError");
  }

  return <F1DriverStandings data={standings} />;
}
