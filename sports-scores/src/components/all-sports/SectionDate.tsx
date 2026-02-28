"use client";

import { formatDateLong } from "@/lib/projUtils";
import { cn } from "@/lib/utils";

export default function SectionDate({
  sectionDate,
  sectionDateEnd,
  currentDate,
  className,
}: {
  sectionDate: Date;
  sectionDateEnd?: Date;
  currentDate: boolean; // Sets the current date id for auto-scrolling
  className?: string;
}) {
  return (
    <div
      id={currentDate ? "current-date" : undefined}
      className={cn("mt-4 text-black dark:text-neutral-400", className)}
    >
      {formatDateLong(sectionDate)}
      {sectionDateEnd ? ` - ${formatDateLong(sectionDateEnd)}` : ""}
    </div>
  );
}
