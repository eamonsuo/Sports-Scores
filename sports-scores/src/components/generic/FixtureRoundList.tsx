"use client";

import fallback from "@/../public/vercel.svg";
import { RoundDetails } from "@/types/misc";
import { clsx } from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FixtureList from "./FixtureList";

export default function FixtureRoundList({
  data,
  curRound,
  cardVariant,
}: {
  data: RoundDetails[];
  curRound: string;
  cardVariant?: "tennis" | "default";
}) {
  const [round, setRound] = useState(curRound);
  const btnListRef = useRef<HTMLDivElement>(null);
  const initialBtn = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const roundLabels = data.map((item) => item.roundLabel);

  useEffect(() => {
    //Ensure the curRound is scrolled into the centre of view on page load
    initialBtn.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
    });

    // Scroll to current round on mount
    const index = roundLabels.indexOf(curRound);
    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current;
      container.scrollLeft = index * container.offsetWidth;
    }
  }, []); //Empty array so only runs once on mount

  //When called ensures the new round state is set and the related button is visible in view
  function handleRoundClick(roundLabel: string) {
    setRound(roundLabel);

    const divNode = btnListRef.current;
    const btnNode =
      divNode?.querySelectorAll("button")[roundLabels.indexOf(roundLabel)];
    btnNode?.scrollIntoView({
      behavior: "smooth",
    });

    // Scroll to the round
    const index = roundLabels.indexOf(roundLabel);
    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: "smooth",
      });
    }
  }

  // Handle scroll to update active round
  function handleScroll() {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const width = container.offsetWidth;
      const index = Math.round(scrollLeft / width);

      if (roundLabels[index] && roundLabels[index] !== round) {
        setRound(roundLabels[index]);

        // Scroll button into view only if it's not already visible
        // Use setTimeout to allow React to update the button styling first
        setTimeout(() => {
          const divNode = btnListRef.current;
          const btnNode = divNode?.querySelectorAll("button")[index];

          if (btnNode && divNode) {
            const btnRect = btnNode.getBoundingClientRect();
            const containerRect = divNode.getBoundingClientRect();

            // Check if button is fully visible within the container
            const isVisible =
              btnRect.left >= containerRect.left &&
              btnRect.right <= containerRect.right;

            if (!isVisible) {
              btnNode.scrollIntoView({
                behavior: "smooth",
                inline: "nearest",
              });
            }
          }
        }, 0);
      }
    }
  }

  return (
    <>
      <div
        ref={btnListRef}
        className="hideScroll mx-2 mb-2 flex gap-1 overflow-x-auto"
      >
        {roundLabels.map((item) => (
          <button
            onClick={() => handleRoundClick(item)}
            key={item}
            ref={item === curRound ? initialBtn : null}
            className={clsx(
              "inline-flex items-center justify-center rounded-full px-2.5 py-0.5",
              item === round &&
                "bg-gray-300 text-black dark:bg-neutral-600 dark:text-neutral-200",
              item !== round &&
                "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-400",
            )}
          >
            <p className="whitespace-nowrap text-sm">{item}</p>
          </button>
        ))}
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {data.map((item) => (
          <div
            key={item.roundLabel}
            className="w-full flex-shrink-0 snap-start overflow-y-auto"
          >
            <FixtureList data={item.matches} cardVariant={cardVariant} />
            {(item.byes?.length ?? 0) > 0 ? (
              <div className="flex items-center gap-1 overflow-x-auto p-4 dark:text-neutral-400">
                Bye:{" "}
                {item.byes?.map((x) => (
                  <Image
                    key={x.name}
                    src={x.img ?? fallback}
                    width={25}
                    height={25}
                    alt="Bye team"
                  />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
