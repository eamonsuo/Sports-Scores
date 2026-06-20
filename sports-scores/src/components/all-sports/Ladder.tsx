import { FALLBACK_IMAGE } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { SportsLadder } from "@/types/misc"
import { clsx } from "clsx"
import Image from "next/image"
import Link from "next/link"

const defaultColours = [
  "bg-green-500",
  "bg-green-300",
  "bg-blue-500",
  "bg-blue-300",
  "bg-yellow-500",
  "bg-yellow-300",
]

export default function Ladder({
  tableName,
  headings,
  data,
  placingCategories,
}: SportsLadder) {
  return (
    <div>
      {tableName && (
        <p className="pb-1 pt-3 dark:text-neutral-400">{tableName}</p>
      )}

      <table className="w-full dark:text-neutral-400">
        <thead>
          <tr>
            <th></th>
            <th className="pe-2"></th>
            {headings.map((heading) => (
              <th key={heading} className="px-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item, idx) => {
            // Get the colour for this placing if specified
            const categoryIdx =
              placingCategories?.findIndex((c) =>
                c.position.includes(Number(item.position)),
              ) ?? -1
            const category =
              categoryIdx >= 0 ? placingCategories?.[categoryIdx] : undefined
            const colour =
              category?.colour ??
              (categoryIdx >= 0
                ? defaultColours[categoryIdx % defaultColours.length]
                : undefined)
            return (
              <tr key={item.teamId} className="border-b border-t">
                <td className={cn("w-1 p-0", colour)} />
                <td className="py-2 pe-2 ps-1">{item.position}</td>
                <td className="text-left text-sm">
                  <Link
                    href={
                      item.sport
                        ? `/sports/${item.sport}/team/${item.teamId}`
                        : ""
                    }
                  >
                    <div className="flex items-center">
                      <div className="me-2 flex gap-2">
                        {Array.isArray(item.teamLogo) ? (
                          item.teamLogo.map((img, idx) => (
                            <Image
                              key={idx + "-logo"}
                              src={img || FALLBACK_IMAGE}
                              width={100}
                              height={100}
                              style={{ width: "20px", height: "auto" }}
                              alt={`${item.teamName} player ${idx + 1}`}
                            />
                          ))
                        ) : (
                          <Image
                            src={item.teamLogo || FALLBACK_IMAGE}
                            width={80}
                            height={80}
                            style={{ width: "20px", height: "auto" }}
                            alt={item.teamName}
                          />
                        )}
                      </div>
                      {item.teamName}
                    </div>
                  </Link>
                </td>

                {headings.slice(1).map((heading) => (
                  <td
                    key={heading}
                    className={cn(
                      item[heading]?.toString()?.includes("↑") &&
                        "text-green-500",
                      item[heading]?.toString()?.includes("↓") &&
                        "text-red-500",
                    )}
                  >
                    {item[heading]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* Display placing category labels */}
      {placingCategories && placingCategories.length > 0 && (
        <div className="my-4 flex flex-col flex-wrap gap-4 text-sm">
          {placingCategories.map((category, idx) => (
            <div key={category.label} className="flex items-center gap-2">
              <span
                className={clsx(
                  "inline-block h-3 w-3 rounded-full",
                  category.colour ??
                    defaultColours[idx % defaultColours.length],
                )}
              />
              <span>{category.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
