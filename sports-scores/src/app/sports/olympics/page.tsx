import { Button } from "@/components/zzzshadcn/button";
import Link from "next/link";

export default async function Page() {
  return (<>
  <Link
            href={"https://www.olympics.com/en/milano-cortina-2026/schedule"}
            className="mb-6 flex justify-center rounded"
          >
            <Button variant={"secondary"}>Full Schedule</Button>
          </Link>
    <iframe
      src="https://en.wikipedia.org/wiki/Australia_at_the_2026_Winter_Olympics"
      className="h-full w-full"
    /></>
  );
}
