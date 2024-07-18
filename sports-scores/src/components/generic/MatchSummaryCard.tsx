import { MatchSummary } from "@/types/misc";
import Image from "next/image";
import Link from "next/link";

export default function MatchSummaryCard({ data }: { data: MatchSummary }) {
  return (
    <Link href={`/sports/${data.sport}/${data.id}`}>
      <div className="mt-4 flex flex-col items-center justify-center rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:active:bg-neutral-500">
        <p className="text-xs text-gray-700 dark:text-neutral-500">{}</p>
        <p className="text-center text-gray-500 dark:text-neutral-500">
          {data.summary}
        </p>

        <div className="m-2 grid w-full grid-cols-5 gap-2">
          <div className="content-center justify-self-center">
            <Image
              src={data.homeDetails.img}
              width={40}
              height={40}
              alt="Home team image"
            />
          </div>
          <p className="content-center dark:text-neutral-400">
            {data.homeDetails.score}
          </p>
          <p className="content-center text-center text-xs dark:text-neutral-500">
            {data.timer}
          </p>
          <p className="content-center text-right dark:text-neutral-400">
            {data.awayDetails.score}
          </p>
          <div className="content-center justify-self-center">
            <Image
              src={data.awayDetails.img}
              width={40}
              height={40}
              alt="Away team image"
            />
          </div>
          <p className="col-span-2 text-left text-xs text-gray-700 dark:text-neutral-500">
            {data.homeDetails.name}
          </p>
          <div></div>
          <p className="col-span-2 text-right text-xs text-gray-700 dark:text-neutral-500">
            {data.awayDetails.name}
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-neutral-500">
          {data.otherDetail}
        </p>
        <p className="text-center text-xs text-gray-500 dark:text-neutral-500">
          {data.venue}
        </p>
      </div>
    </Link>
  );
}
