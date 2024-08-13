import { fetchAFLStandings } from "@/api/afl.api";
import AFLLadder from "@/components/afl/AFLLadder";
import { redirect } from "next/navigation";

export default async function Page() {
  const standings = await fetchAFLStandings(2024);

  if (standings === null) {
    redirect("/misc/apiError");
  }

  return <AFLLadder data={standings} />;
}
