"use client"

import { formatDateLong } from "@/lib/projUtils"
import { MatchProperty } from "@/types/misc"

export default function MatchPropertyList({
  startDate,
  endDate,
  properties,
}: {
  startDate: Date
  endDate?: Date
  properties: MatchProperty[]
}) {
  return (
    <table className="m-4 gap-1 dark:text-neutral-500">
      <tbody>
        <tr>
          <td>Date</td>
          <td suppressHydrationWarning className="p-1 ps-3 text-sm">
            {formatDateLong(startDate)}
            {endDate ? ` - ${formatDateLong(endDate)}` : ""}
          </td>
        </tr>
        {properties.map((property) => (
          <tr key={property.label}>
            <td>{property.label}</td>
            <td className="p-1 ps-3 text-sm">{property.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
