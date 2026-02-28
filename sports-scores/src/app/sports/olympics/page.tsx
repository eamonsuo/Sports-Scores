import { Button } from "@/components/misc-ui/Button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex h-full flex-col">
      <iframe
        src="https://en.wikipedia.org/wiki/Australia_at_the_2026_Winter_Paralympics"
        className="w-full flex-1"
      />
      <Link
        href={
          "https://www.olympics.com/en/milano-cortina-2026/paralympic-games/schedule/overview"
        }
        className="m-4 flex justify-center rounded"
      >
        <Button variant={"secondary"}>Full Schedule</Button>
      </Link>
    </div>
  );
}
