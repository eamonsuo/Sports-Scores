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
    <table className="m-4 dark:text-neutral-500">
      <tbody>
        <tr>
          <td>Date</td>
          <td suppressHydrationWarning className="py-1 text-sm">
            {formatDateLong(startDate)}
            {endDate ? ` - ${formatDateLong(endDate)}` : ""}
          </td>
        </tr>
        {properties.map((property) => (
          <tr key={property.label}>
            <td>{property.label}</td>
            <td className="py-1 text-sm">{property.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
