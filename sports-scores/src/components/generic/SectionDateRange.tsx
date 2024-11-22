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
      {dateFrom.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Australia/Brisbane",
      })}{" "}
      -{" "}
      {dateTo.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Australia/Brisbane",
      })}
    </div>
  );
}
