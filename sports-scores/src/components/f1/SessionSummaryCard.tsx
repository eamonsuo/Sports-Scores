import Link from "next/link";

export default function SessionSummaryCard({
  href,
  sessionType,
  status,
}: {
  href: string;
  sessionType: string;
  status: string;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700">
        <p className="flex-1">{sessionType}</p>
        <p>{status}</p>
        <p>&gt;</p>
      </div>
    </Link>
  );
}
