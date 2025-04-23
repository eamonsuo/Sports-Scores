import Placeholder from "@/components/misc/Placeholder";
import NRLLadder from "@/components/nrl/NRLLadder";
import { NRLStandings } from "@/services/nrl.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await NRLStandings();

  // console.log( pageData.standings);
  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <NRLLadder data={pageData.standings} />;
}
