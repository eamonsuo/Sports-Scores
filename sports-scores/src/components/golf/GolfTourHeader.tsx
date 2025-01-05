import Link from "next/link";

export default function GolfTourHeader({
  href,
  tourName,
}: {
  href: string;
  tourName: string;
}) {
  return (
    <Link href={href}>
      <div className="mt-4 flex justify-between rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700">
        <p>{tourName}</p>
        <p>{">"}</p>
      </div>
    </Link>
  );
}
