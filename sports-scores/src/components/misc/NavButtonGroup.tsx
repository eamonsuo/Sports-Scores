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
    <div className="m-4 flex rounded-lg border border-gray-200 bg-gray-200 p-1">
      {buttons.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "flex-1 rounded-md px-4 py-2 text-center focus:relative",
            pathname.includes(item.page)
              ? "text-black-500 bg-white shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
