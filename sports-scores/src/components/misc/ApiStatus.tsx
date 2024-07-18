import { APISportsStatusDetails } from "@/types/misc";

export default function APIStatus({ data }: { data: APISportsStatusDetails }) {
  return (
    <div className="p-1 dark:bg-neutral-900 dark:text-neutral-400">{`API Calls: ${data.requests.current} out of ${data.requests.limit_day}`}</div>
  );
}
