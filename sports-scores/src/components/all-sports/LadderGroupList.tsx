"use client"

import { LadderGroup } from "@/types/misc"
import { clsx } from "clsx"
import { useEffect, useMemo, useRef, useState } from "react"
import Ladder from "./Ladder"

export default function LadderGroupList({
  data,
  curGroup,
}: {
  data: LadderGroup[]
  curGroup: string
}) {
  const [group, setGroup] = useState(curGroup)
  const btnListRef = useRef<HTMLDivElement>(null)
  const initialBtn = useRef<HTMLButtonElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const groupLabels = useMemo(
    () => data.map((item) => item.label ?? ""),
    [data],
  )

  useEffect(() => {
    //Ensure the curGroup is scrolled into the centre of view on page load
    initialBtn.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
    })

    // Scroll to current group on mount
    const index = groupLabels.indexOf(curGroup)
    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current
      container.scrollLeft = index * container.offsetWidth
    }
  }, [])

  function handleGroupClick(groupLabel: string) {
    setGroup(groupLabel)

    const divNode = btnListRef.current
    const btnNode =
      divNode?.querySelectorAll("button")[groupLabels.indexOf(groupLabel)]
    btnNode?.scrollIntoView({
      behavior: "smooth",
    })

    // Scroll to the group
    const index = groupLabels.indexOf(groupLabel)
    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: "smooth",
      })
    }
  }

  // Handle scroll to update active group
  function handleScroll() {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const width = container.offsetWidth
      const index = Math.round(scrollLeft / width)

      if (groupLabels[index] && groupLabels[index] !== group) {
        setGroup(groupLabels[index])

        // Scroll button into view only if it's not already visible
        // Use setTimeout to allow React to update the button styling first
        setTimeout(() => {
          const divNode = btnListRef.current
          const btnNode = divNode?.querySelectorAll("button")[index]

          if (btnNode && divNode) {
            const btnRect = btnNode.getBoundingClientRect()
            const containerRect = divNode.getBoundingClientRect()

            // Check if button is fully visible within the container
            const isVisible =
              btnRect.left >= containerRect.left &&
              btnRect.right <= containerRect.right

            if (!isVisible) {
              btnNode.scrollIntoView({
                behavior: "smooth",
                inline: "nearest",
              })
            }
          }
        }, 0)
      }
    }
  }

  return (
    <>
      {groupLabels.length > 1 && (
        <div
          ref={btnListRef}
          className="hideScroll mx-4 mb-2 flex gap-1 overflow-x-auto"
        >
          {groupLabels.map((item) => (
            <button
              onClick={() => handleGroupClick(item)}
              key={item}
              ref={item === curGroup ? initialBtn : null}
              className={clsx(
                "inline-flex items-center justify-center rounded-full px-2.5 py-0.5",
                item === group &&
                  "bg-gray-300 text-black dark:bg-neutral-600 dark:text-neutral-200",
                item !== group &&
                  "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-400",
              )}
            >
              <p className="whitespace-nowrap text-sm">{item}</p>
            </button>
          ))}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="hideScroll flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
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
      </div>
    </>
  )
}
