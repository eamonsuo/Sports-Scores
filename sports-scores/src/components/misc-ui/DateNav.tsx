import { Button } from "@/components/shadcn/button"
import { formatDate } from "@/lib/projUtils"
import { addDays, format } from "date-fns"
import Link from "next/link"

export default function DateNav({
  date,
  nextDate,
}: {
  date: Date
  nextDate?: Date
}) {
  const yesterday = format(addDays(date, -1), "yyyy-MM-dd")
  const tomorrow = nextDate
    ? format(nextDate, "yyyy-MM-dd")
    : format(addDays(date, 1), "yyyy-MM-dd")

  return (
    <div className="m-4 flex justify-between">
      <Link href={`?date=${yesterday}`}>
        <Button variant="secondary">&lt;- Previous Day</Button>
      </Link>
      <Link href={`?date=${tomorrow}`}>
        <Button variant="secondary">
          {nextDate ? formatDate(nextDate) : "Next Day"} -&gt;
        </Button>
      </Link>
    </div>
  )
}
