import F1TeamStandings from "@/components/f1/F1TeamStandings";
import Placeholder from "@/components/misc/Placeholder";
import { fetchF1TeamStandings } from "@/endpoints/f1.api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const standings = await fetchF1TeamStandings(2024);

  if (typeof standings === "string") {
    return <Placeholder>{standings}</Placeholder>;
  }

  return <F1TeamStandings data={standings} />;
}
