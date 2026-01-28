import { dateToCustomString } from "@/lib/projUtils";

export default function SectionDateRange({
  dateFrom,
  dateTo,
  currentDate,
}: {
  dateFrom: Date;
  dateTo: Date;
  currentDate: boolean;
}) {
  return (
    <div
      id={currentDate ? "current-date" : undefined}
      className="mt-4 text-black dark:text-neutral-400"
    >
      {dateToCustomString(dateFrom)} - {dateToCustomString(dateTo)}
    </div>
  );
}
