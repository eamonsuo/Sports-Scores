import CricketSeriesLadder, {
  CricketLadder,
} from "@/components/cricket/CricketSeriesLadder";
import CricketSeriesResult from "@/components/cricket/CricketSeriesResult";
import Placeholder from "@/components/misc/Placeholder";
import { fetchCricketSeriesMatches } from "@/endpoints/cricket.api";
import { mapCricketSeriesLadders } from "@/lib/dataMapping";
import { getCricketImageUrl } from "@/lib/projUtils";
import Image from "next/image";

export default async function Page(props: {
  params: Promise<{ ccd: string; scd: string }>;
}) {
  const params = await props.params;

  let seriesHeadToHead: any = null;
  let seriesLadders: CricketLadder[] | null = null;
  let tournamentWinner: any = null;

  let rawSeries = await fetchCricketSeriesMatches(params.ccd, params.scd);

  if (rawSeries?.Stages[0].LeagueTable != undefined) {
    seriesLadders = mapCricketSeriesLadders(rawSeries?.Stages[0].LeagueTable);
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {seriesHeadToHead != null &&
        seriesHeadToHead.results.map((item: any) => (
          <CricketSeriesResult
            key={item.series.id}
            seriesName={item.series.name}
            homeInfo={{
              name: item.home.name,
              img: getCricketImageUrl(item.home.img),
              matchesWon: item.home.won,
            }}
            awayInfo={{
              name: item.away.name,
              img: getCricketImageUrl(item.away.img),
              matchesWon: item.away.won,
            }}
          ></CricketSeriesResult>
        ))}

      {tournamentWinner != null && (
        <div className="flex flex-col items-center">
          <p className="pt-6 dark:text-neutral-400">TOURNAMENT WINNER </p>
          <Image
            src={getCricketImageUrl(tournamentWinner.img)}
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
