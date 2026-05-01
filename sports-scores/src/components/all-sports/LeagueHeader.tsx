import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function LeagueHeader({
  href,
  seriesName,
  img,
  className,
}: {
  href: string;
  seriesName: string;
  img?: string;
  className?: string;
}) {
  return (
    <Link href={href}>
      <div
        className={cn(
          `mt-4 flex justify-between rounded-t-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700`,
          className,
        )}
      >
        {img && (
          <Image
            src={img}
            height={100}
            width={100}
            style={{ width: "auto", height: "25px" }}
            alt="Circuit Logo"
          />
        )}
        <p>{seriesName}</p>
        <p>{">"}</p>
      </div>
    </Link>
  );
}
