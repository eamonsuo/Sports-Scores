import { clsx } from "clsx";

export default function APIStatus({
  status,
  reset = "N/A",
  className,
}: {
  status: number | string;
  reset?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "p-1 dark:bg-neutral-900 dark:text-neutral-400",
        className,
      )}
    >{`API Calls: ${status}% used (${reset})`}</div>
  );
}
