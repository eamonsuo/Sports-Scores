import Link from "next/link";

export default function CricketSeriesHeader({
  href,
  seriesName,
}: {
  href: string;
  seriesName: string;
}) {
  return (
    <Link href={href}>
      <div className="mt-4 flex justify-between rounded-t-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700">
        <p>{seriesName}</p>
        <p>{">"}</p>
      </div>
    </Link>
  );
}
