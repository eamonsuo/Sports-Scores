import { fetchF1DriverStandings } from "@/api/f1.api";
import F1DriverStandings from "@/components/f1/F1DriverStandings";

export default async function Page() {
  const standings = await fetchF1DriverStandings(2024);
  return <F1DriverStandings data={standings} />;
}
