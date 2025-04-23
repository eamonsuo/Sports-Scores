import F1DriverStandings from "@/components/f1/F1DriverStandings";
import Placeholder from "@/components/misc/Placeholder";
import { fetchF1DriverStandings } from "@/endpoints/f1.api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const standings = await fetchF1DriverStandings(2024);

  if (typeof standings === "string") {
    return <Placeholder>{standings}</Placeholder>;
  }

  return <F1DriverStandings data={standings} />;
}
