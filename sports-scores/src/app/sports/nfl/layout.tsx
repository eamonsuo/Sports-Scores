import { fetchNFLStatus } from "@/api/nfl.api";
import APIStatus from "@/components/ui/ApiStatus";
import Link from "next/link";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await fetchNFLStatus();
  return (
    <div className="flex h-full flex-col">
      <div className="m-4 flex">
        <Link
          href="/sports/nfl/matches"
          className="flex-1 border-2 bg-gray-400 p-2 text-center focus:bg-gray-600 active:bg-gray-700"
        >
          Matches
        </Link>
        <Link
          href="/sports/nfl/ladder"
          className="flex-1 border-2 bg-gray-400 p-2 text-center focus:bg-gray-600 active:bg-gray-700"
        >
          Standings
        </Link>
      </div>
      {children}
      <APIStatus data={status} />
    </div>
  );
}
