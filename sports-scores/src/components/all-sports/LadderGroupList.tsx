"use client"

import { LadderGroup } from "@/types/misc"
import { useMemo } from "react"
import ComponentList from "../misc-ui/ComponentList"
import Ladder from "./Ladder"

export default function LadderGroupList({
  data,
  curGroup,
}: {
  data: LadderGroup[]
  curGroup: string
}) {
  const groupLabels = useMemo(
    () => data.map((item) => item.label ?? ""),
    [data],
  )

  return (
    <ComponentList labels={groupLabels} curItem={curGroup} buttonStyle="pill">
      {data.map((item) => (
        <div
          key={item.label + "-ladders"}
          className="w-full flex-shrink-0 snap-start overflow-y-auto"
        >
          {item.tables.map((table, index) => (
            <Ladder
              key={index}
              data={table.data}
              headings={table.headings}
              placingCategories={table.placingCategories}
              tableName={
                data.length > 1 || item.tables.length > 1
                  ? table.tableName
                  : undefined
              }
            />
          ))}
        </div>
      ))}
    </ComponentList>
  )
}
