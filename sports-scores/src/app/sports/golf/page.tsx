import { Button } from "@/components/misc/Button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex h-full flex-col items-center">
      <Button variant="destructive"> Custom Look Coming Soon</Button>
      <Link href={`https://www.livgolf.com/leaderboard`}>
        <Button>View LIV Tour (Redirects)</Button>
      </Link>
      <Link
        href={`https://www.google.com/search?igu=1&gws_rd=ssl&q=dp+world+tour`}
      >
        <Button>View DP World Tour (Redirects)</Button>
      </Link>
      <iframe
        src="https://www.google.com/search?igu=1&gws_rd=ssl&q=pga"
        className="w-full flex-1"
      />
    </div>
  );
}
