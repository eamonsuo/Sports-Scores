import { MatchSummary } from "@/types/misc";
import Image from "next/image";
import Link from "next/link";

export default function MatchSummaryCard({ data }: { data: MatchSummary }) {
  return (
    <Link href={`/sports/${data.sport}/${data.id}`}>
      <div className="mt-4 flex flex-col items-center justify-center rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300">
        <p className="text-xs text-gray-700">{}</p>
        <p className="text-center text-gray-500">{data.summary}</p>

        <div className="m-2 grid w-full grid-cols-5 gap-2">
          <div className="content-center justify-self-center">
            <Image
              src={data.homeDetails.img}
              width={40}
              height={40}
              alt="Home team image"
            />
          </div>
          <p className="content-center text-black">{data.homeDetails.score}</p>
          <p className="content-center text-center text-xs">{data.timer}</p>
          <p className="content-center text-right text-black">
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
          <p className="col-span-2 text-left text-xs text-gray-700">
            {data.homeDetails.name}
          </p>
          <div></div>
          <p className="col-span-2 text-right text-xs text-gray-700">
            {data.awayDetails.name}
          </p>
        </div>

        <p className="text-center text-xs text-gray-500">{data.otherDetail}</p>
        <p className="text-center text-xs text-gray-500">{data.venue}</p>
      </div>
    </Link>
  );
}
