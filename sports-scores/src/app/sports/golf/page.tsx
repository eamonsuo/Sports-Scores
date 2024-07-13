import { Button } from "@/components/misc/Button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  return (
    <>
      <div className="flex h-full flex-col">
        <Link href={`https://www.livgolf.com/leaderboard`} className="">
          <Button>LIV Tour</Button>
        </Link>
        <iframe
          src="https://www.google.com/search?igu=1&gws_rd=ssl&q=pga"
          className="flex-1"
        />
      </div>
    </>
  );
}
