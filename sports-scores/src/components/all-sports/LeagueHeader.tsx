import { cn } from "cn"

import Image from "next/image"
import Link from "next/link"

export default function LeagueHeader({
  href,
  seriesName,
  img,
  className,
}: {
  href: string
  seriesName: string
  img?: string
  className?: string
}) {
  return (
    <Link href={href}>
      <div
        className={cn(
          `mt-4 flex justify-between gap-2 rounded-t-md border border-gray-300 p-2 shadow-xs active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700`,
          className,
        )}
      >
        <div className={cn("my-auto", img?.includes("footer") && "invert")}>
          {img && img !== "/vercel.svg" && (
            <Image
              src={img}
              height={100}
              width={100}
              style={{ width: "auto", height: "25px" }}
              alt="League Logo"
            />
          )}
        </div>

        <p className="text-center">{seriesName}</p>
        <p>{">"}</p>
      </div>
    </Link>
  )
}
