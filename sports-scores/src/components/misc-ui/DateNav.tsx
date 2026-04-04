import { Button } from "@/components/misc-ui/Button";
import { addDays, format } from "date-fns";
import Link from "next/link";

export default function DateNav({ date }: { date: Date }) {
  const yesterday = format(addDays(date, -1), "yyyy-MM-dd");
  const tomorrow = format(addDays(date, 1), "yyyy-MM-dd");

  return (
    <div className="m-4 flex justify-between">
      <Link href={`?date=${yesterday}`}>
        <Button variant="secondary">&lt;- Previous Day</Button>
      </Link>
      <Link href={`?date=${tomorrow}`}>
        <Button variant="secondary">Next Day -&gt;</Button>
      </Link>
    </div>
  );
}
