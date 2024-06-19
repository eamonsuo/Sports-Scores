import Image from "next/image";
import Link from "next/link";

export default function ScoreSummaryCard({
  matchDetails,
  homeDetails,
  awayDetails,
}: ScoreSummaryCardProps) {
  return (
    <Link href={`./${matchDetails.sport}/${matchDetails.gameid}`}>
      <div className="mt-4 flex min-h-[100px] flex-col items-center justify-center border border-gray-300 p-4 active:bg-gray-300">
        <p className="text-xs text-gray-700">{matchDetails.status}</p>
        <p className="mb-2 text-center text-gray-500">{matchDetails.summary}</p>

        {/* TODO: make grid consistent for all logos/names */}
        <div className="m-2 grid w-full grid-cols-5 gap-2">
          <div className="content-center justify-self-center">
            <Image
              src={homeDetails.img}
              width={40}
              height={40}
              alt="Home team image"
            />
          </div>
          <p className="content-center text-black">{homeDetails.score}</p>
          <div></div>
          <p className="content-center text-right text-black">
            {awayDetails.score}
          </p>
          <div className="content-center justify-self-center">
            <Image
              src={awayDetails.img}
              width={40}
              height={40}
              alt="Away team image"
            />
          </div>
          <p className="col-span-2 text-left text-sm text-gray-700">
            {homeDetails.name}
          </p>
          <div></div>
          <p className="col-span-2 text-right text-sm text-gray-700">
            {awayDetails.name}
          </p>
        </div>

        <p className="text-center text-xs text-gray-500">
          {matchDetails.otherDetail}
        </p>
        <p className="text-center text-xs text-gray-500">
          {matchDetails.venue}
        </p>
      </div>
    </Link>
  );
}
