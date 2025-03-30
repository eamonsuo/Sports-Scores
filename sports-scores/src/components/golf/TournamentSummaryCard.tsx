import Image from "next/image";
import Link from "next/link";
import TournamentLeaderboard, {
  GolfLeaderboardPlayerRow,
} from "./TournamentLeaderboard";

export default function TournamentSummaryCard({
  img,
  name,
  status,
  top5Players,
  url,
}: {
  img: string;
  name: string;
  status: string;
  top5Players: GolfLeaderboardPlayerRow[];
  url: string;
}) {
  return (
    <div className="mt-4 flex-col items-center gap-4 rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700">
      <div className="mb-2 flex">
        <Image src={img} height={70} width={50} alt="Tournament Logo" />
        <div className="flex flex-1 flex-col text-center">
          <p>{name}</p>
          <p>{status}</p>
        </div>
      </div>
      <Link href={url}>
        <TournamentLeaderboard players={top5Players} />

        <p className="text-center">Full Leaderboard &gt;</p>
      </Link>
    </div>
  );
}
