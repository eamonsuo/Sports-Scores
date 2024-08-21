import Image from "next/image";

export default function CricketSeriesResult({
  homeInfo,
  awayInfo,
  seriesName,
}: {
  homeInfo: { img: string; name: string; matchesWon: string | number };
  awayInfo: { img: string; name: string; matchesWon: string | number };
  seriesName: string;
}) {
  return (
    <>
      <p className="text-center dark:text-neutral-400">{seriesName}</p>
      <div className="m-4 grid grid-cols-4 gap-2">
        <div className="content-center justify-self-center">
          <Image
            src={homeInfo.img}
            width={60}
            height={60}
            alt="Home team image"
          />
        </div>
        <p className="content-center text-center text-2xl dark:text-neutral-400">
          {homeInfo.matchesWon}
        </p>

        <p className="content-center text-center text-2xl dark:text-neutral-400">
          {awayInfo.matchesWon}
        </p>

        <div className="content-center justify-self-center">
          <Image
            src={awayInfo.img}
            width={60}
            height={60}
            alt="Away team image"
          />
        </div>

        <p className="text-center text-gray-700 dark:text-neutral-500">
          {homeInfo.name}
        </p>
        <div></div>
        <div></div>
        <p className="text-center text-gray-700 dark:text-neutral-500">
          {awayInfo.name}
        </p>
      </div>
    </>
  );
}
