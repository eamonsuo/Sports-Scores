import { clsx } from "clsx";

export default function APIStatus({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "p-1 dark:bg-neutral-900 dark:text-neutral-400",
        className,
      )}
    >{`API Calls: ${status}`}</div>
  );
}
