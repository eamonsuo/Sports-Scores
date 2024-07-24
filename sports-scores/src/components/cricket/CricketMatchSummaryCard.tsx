import Image from "next/image";
import Link from "next/link";

export default function CricketMatchSummaryCard({
  id,
  href,
  matchSummary,
  homeInfo,
  awayInfo,
  timer,
  venue,
  topInfo,
  bottomInfo,
}: {
  id: number;
  href: string;
  matchSummary: string;
  homeInfo: { name: string; score: string; img: string };
  awayInfo: { name: string; score: string; img: string };
  timer: string;
  venue: string;
  topInfo?: string;
  bottomInfo?: string;
}) {
  return (
    <Link href={href}>
      <div className="mt-4 flex flex-col items-center justify-center rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:active:bg-neutral-700">
        <p className="text-xs text-gray-700 dark:text-neutral-500">{topInfo}</p>
        <p className="text-center text-gray-500 dark:text-neutral-500">
          {matchSummary}
        </p>

        <div className="m-2 grid w-full grid-cols-5 gap-2">
          <div className="content-center justify-self-start">
            <Image
              src={homeInfo.img}
              width={40}
              height={40}
              alt="Home team image"
            />
          </div>
          <p className="content-center dark:text-neutral-400">
            {homeInfo.score}
          </p>
          <p className="content-center text-center text-xs dark:text-neutral-500">
            {timer}
          </p>
          <div className="content-center text-right dark:text-neutral-400">
            {awayInfo.score}
          </div>
          <div className="content-center justify-self-end">
            <Image
              src={awayInfo.img}
              width={40}
              height={40}
              alt="Away team image"
            />
          </div>
          <p className="col-span-2 text-left text-xs text-gray-700 dark:text-neutral-500">
            {homeInfo.name}
          </p>
          <div></div>
          <p className="col-span-2 text-right text-xs text-gray-700 dark:text-neutral-500">
            {awayInfo.name}
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-neutral-500">
          {bottomInfo}
        </p>
        <p className="text-center text-xs text-gray-500 dark:text-neutral-500">
          {venue}
        </p>
      </div>
    </Link>
  );
}
