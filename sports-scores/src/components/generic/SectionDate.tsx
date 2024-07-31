export default function SectionDate({
  sectionDate,
  currentDate,
}: {
  sectionDate: Date;
  currentDate: boolean;
}) {
  return (
    <div
      id={currentDate ? "current-date" : undefined}
      className="mt-4 text-black dark:text-neutral-400"
    >
      {sectionDate.toDateString()}
    </div>
  );
}
