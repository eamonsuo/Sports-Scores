import { cn } from "@/lib/shadcnUtils"
import { SportsTable } from "@/types/misc"

export default async function DataTable({
  tableName,
  headings,
  data,
  columnClassName,
}: SportsTable) {
  return (
    <>
      {tableName && (
        <p className="pb-1 pt-3 dark:text-neutral-400">{tableName}</p>
      )}

      <table className="w-full flex-1 dark:text-neutral-400">
        <thead>
          <tr>
            {headings.map((heading, idx) => (
              <th key={heading} className="px-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item) => (
            <tr key={item.id} className={cn("border")}>
              {headings.map((heading, idx) => (
                <td
                  key={heading}
                  className={cn("p-2", columnClassName && columnClassName[idx])}
                >
                  {item[heading]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
