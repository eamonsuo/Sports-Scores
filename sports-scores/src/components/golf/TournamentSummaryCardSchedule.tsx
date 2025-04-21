import Image from "next/image";
import Link from "next/link";

export default function TournamentSummaryCardSchedule({
  img,
  name,
  status,
  location,
  leader,
  url,
}: {
  img: string;
  name: string;
  status: string;
  location: string;
  leader?: string;
  url: string;
}) {
  return (
    <div className="mt-4 flex-col items-center gap-4 rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700">
      <Link href={url}>
        <div className="mb-2 flex">
          <Image src={img} height={70} width={50} alt="Tournament Logo" />
          <div className="flex flex-1 flex-col text-center">
            <p>{name}</p>
            <p>{status}</p>
            <p>{location}</p>
          </div>
        </div>
        {leader && (
          <p className="text-center">
            {status == "LIVE" ? "Current Leader: " : "Previous Winner: "}
            {leader}
          </p>
        )}
      </Link>
    </div>
  );
}
