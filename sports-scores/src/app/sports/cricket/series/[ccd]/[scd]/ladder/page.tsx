import CricketSeriesLadder, {
  CricketLadder,
} from "@/components/cricket/CricketSeriesLadder";
import CricketSeriesResult from "@/components/cricket/CricketSeriesResult";
import Placeholder from "@/components/misc/Placeholder";
import { cricketSeriesResults } from "@/services/cricket.service";
import Image from "next/image";

export default async function Page(props: {
  params: Promise<{ ccd: string; scd: string }>;
}) {
  const params = await props.params;

  let seriesHeadToHead: any = null;
  let seriesLadders: CricketLadder[] | null = null;
  let tournamentWinner: any = null;

  seriesLadders = await cricketSeriesResults(params.ccd, params.scd);

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {seriesHeadToHead != null &&
        seriesHeadToHead.results.map((item: any) => (
          <CricketSeriesResult
            key={item.series.id}
            seriesName={item.series.name}
            homeInfo={{
              name: item.home.name,
              img: item.home.img,
              matchesWon: item.home.won,
            }}
            awayInfo={{
              name: item.away.name,
              img: item.away.img,
              matchesWon: item.away.won,
            }}
          />
        ))}

      {tournamentWinner != null && (
        <div className="flex flex-col items-center">
          <p className="pt-6 dark:text-neutral-400">TOURNAMENT WINNER </p>
          <Image
            src={tournamentWinner.img}
            height={150}
            width={150}
            alt={"Winning Team"}
            className="m-4"
          />

          <p className="text-xl dark:text-neutral-400">
            {tournamentWinner.name}
          </p>
        </div>
      )}

      {seriesLadders !== null &&
        seriesLadders.map((item) => (
          <CricketSeriesLadder key={item.name} data={item} />
        ))}

      {seriesLadders === null && <Placeholder>No Results</Placeholder>}
    </div>
  );
}
