import CricketScorecardBat from "@/components/cricket/CricketScorecardBat";
import { cricinfoMatchDetails } from "@/lib/scraper";

export default async function Page({ params }: { params: { slug: string[] } }) {
  let url =
    "https://www.espncricinfo.com/series/" +
    params.slug.join("/") +
    "/full-scorecard";
  let scrape = await cricinfoMatchDetails(url);
  return (
    <div className="flex-1 overflow-y-auto px-4 dark:text-neutral-400">
      <CricketScorecardBat data={scrape.content.innings[0].inningBatsmen} />
    </div>
  );
}
