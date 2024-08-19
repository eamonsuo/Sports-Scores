import { fetchF1TeamStandings } from "@/api/f1.api";
import F1TeamStandings from "@/components/f1/F1TeamStandings";
import Placeholder from "@/components/misc/Placeholder";

export default async function Page() {
  const standings = await fetchF1TeamStandings(2024);

  if (typeof standings === "string") {
    return <Placeholder>{standings}</Placeholder>;
  }

  return <F1TeamStandings data={standings} />;
}
