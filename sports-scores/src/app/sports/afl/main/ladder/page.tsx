import { fetchAFLStandings } from "@/api/afl.api";
import AFLLadder from "@/components/afl/AFLLadder";
import Placeholder from "@/components/misc/Placeholder";

export default async function Page() {
  const standings = await fetchAFLStandings(2024);

  if (typeof standings === "string") {
    return <Placeholder>{standings}</Placeholder>;
  }

  return <AFLLadder data={standings} />;
}
