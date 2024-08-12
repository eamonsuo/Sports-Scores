"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavButtonGroup({
  buttons,
}: {
  buttons: { href: string; label: string; page: string }[];
}) {
  const pathname: string = usePathname();

  return (
    <div className="m-4 flex rounded-lg bg-gray-200 p-1 dark:bg-neutral-800">
      {buttons.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "flex-1 rounded-md px-2 py-2 text-center focus:relative",
            pathname.includes(item.page)
              ? "bg-white text-black shadow-sm dark:bg-neutral-600 dark:text-neutral-200"
              : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
