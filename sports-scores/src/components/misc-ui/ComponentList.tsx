"use client"

import { cn } from "@/lib/utils"
import { ReactNode, useEffect, useRef, useState } from "react"

export type ButtonStyle = "pill" | "rectangle"

export default function ComponentList({
  children,
  labels,
  curItem,
  buttonStyle = "pill",
}: {
  children: ReactNode[]
  labels: string[]
  curItem: string
  buttonStyle?: ButtonStyle
}) {
  const [item, setItem] = useState(curItem)
  const btnListRef = useRef<HTMLDivElement>(null)
  const initialBtn = useRef<HTMLButtonElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  console.log(buttonStyle)

  useEffect(() => {
    //Ensure the curRound is scrolled into the centre of view on page load
    initialBtn.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
    })

    // Scroll to current round on mount
    const index = labels.indexOf(curItem)
    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current
      container.scrollLeft = index * container.offsetWidth
    }
  }, []) //Empty array so only runs once on mount

  //When called ensures the new round state is set and the related button is visible in view
  function handleRoundClick(label: string) {
    setItem(label)

    const divNode = btnListRef.current
    const btnNode = divNode?.querySelectorAll("button")[labels.indexOf(label)]
    btnNode?.scrollIntoView({
      behavior: "smooth",
    })

    // Scroll to the round
    const index = labels.indexOf(label)
    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: "smooth",
      })
    }
  }

  // Handle scroll to update active round
  function handleScroll() {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const width = container.offsetWidth
      const index = Math.round(scrollLeft / width)

      if (labels[index] && labels[index] !== item) {
        setItem(labels[index])

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
      <div
        ref={btnListRef}
        className={cn(
          "hideScroll mx-4 mb-2 flex overflow-x-auto",
          buttonStyle === "pill" && "gap-1",
          buttonStyle === "rectangle" &&
            "rounded-lg bg-gray-200 p-1 dark:bg-neutral-800",
        )}
      >
        {labels.map((label) => (
          <button
            onClick={() => handleRoundClick(label)}
            key={label}
            ref={label === curItem ? initialBtn : null}
            className={cn(
              buttonStyle === "pill" &&
                "inline-flex items-center justify-center rounded-full px-2.5 py-0.5",
              buttonStyle === "rectangle" &&
                "flex-1 place-content-center rounded-md bg-white px-2 py-1 text-center text-black shadow-sm focus:relative dark:bg-neutral-600 dark:text-neutral-200",
              label === item &&
                "bg-gray-300 text-black dark:bg-neutral-600 dark:text-neutral-200",
              label !== item &&
                "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-400",
            )}
          >
            <p className="whitespace-nowrap text-sm">{label}</p>
          </button>
        ))}
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="hideScroll flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {children.map((item, index) => (
          <div
            key={labels[index] + index.toString()}
            className="w-full flex-shrink-0 snap-start overflow-y-auto"
          >
            {item}
          </div>
        ))}
      </div>
    </>
  )
}
