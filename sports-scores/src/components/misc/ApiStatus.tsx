import { APISportsStatusDetails } from "@/types/misc";

export default function APIStatus({ data }: { data: APISportsStatusDetails }) {
  return (
    <div className="m-1">{`API Calls: ${data.requests.current} out of ${data.requests.limit_day}`}</div>
  );
}
