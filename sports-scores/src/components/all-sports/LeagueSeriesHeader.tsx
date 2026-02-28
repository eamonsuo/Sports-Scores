import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LeagueSeriesHeader({
  href,
  seriesName,
  className,
}: {
  href: string;
  seriesName: string;
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
        <p>{seriesName}</p>
        <p>{">"}</p>
      </div>
    </Link>
  );
}
