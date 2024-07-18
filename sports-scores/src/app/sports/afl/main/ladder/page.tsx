import { fetchAFLStandings } from "@/api/afl.api";
import AFLLadder from "@/components/afl/AFLLadder";

export default async function Page() {
  const standings = await fetchAFLStandings(2024);
  return <AFLLadder data={standings} />;
}
