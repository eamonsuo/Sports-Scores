export default function SectionDate({
  sectionDate,
  display,
  currentDate,
}: {
  sectionDate: Date;
  display: boolean;
  currentDate: boolean;
}) {
  return (
    display && (
      <div
        id={currentDate ? "current-date" : undefined}
        className="mt-4 text-black dark:text-neutral-400"
      >
        {sectionDate.toDateString()}
      </div>
    )
  );
}
