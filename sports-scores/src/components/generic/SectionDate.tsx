import { dateToCustomString } from "@/lib/projUtils";

export default function SectionDate({
  sectionDate,
  currentDate,
  endDate,
}: {
  sectionDate: Date;
  currentDate: boolean;
  endDate?: Date;
}) {
  return (
    <div
      id={currentDate ? "current-date" : undefined}
      className="mt-4 text-black dark:text-neutral-400"
    >
      {endDate
        ? `${dateToCustomString(sectionDate)} - ${dateToCustomString(endDate)}`
        : dateToCustomString(sectionDate)}
    </div>
  );
}
