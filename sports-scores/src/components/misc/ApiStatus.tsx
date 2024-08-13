import { APISportsStatusDetails } from "@/types/misc";
import { clsx } from "clsx";

export default function APIStatus({
  data,
  className,
}: {
  data: APISportsStatusDetails;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "p-1 dark:bg-neutral-900 dark:text-neutral-400",
        className,
      )}
    >{`API Calls: ${data?.requests?.current} out of ${data?.requests?.limit_day}`}</div>
  );
}
