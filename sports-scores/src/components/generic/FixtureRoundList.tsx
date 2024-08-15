"use client";

import { MATCHSTATUSAFL, MATCHSTATUSNFL } from "@/lib/constants";
import { MatchSummary } from "@/types/misc";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import FixtureList from "./FixtureList";

export default function FixtureRoundList({
  data,
  curRound,
}: {
  data: MatchSummary[];
  curRound: string;
}) {
  const [round, setRound] = useState(curRound); //need to put in parent so that it only gets set once. Need to change page structure?
  const btnListRef = useRef<HTMLDivElement>(null); //Ref for the div which contains all round buttons
  const initialBtn = useRef<HTMLButtonElement>(null); //Ref for btn of curRound
  let roundLabels = [...new Set(data.map((item) => item.roundLabel ?? ""))];

  useEffect(() => {
    //Ensure the curRound is scrolled into the centre of view on page load
    initialBtn.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
    });
  }, []);

  //When called ensures the new round state is set and the related button is visible in view
  function handleRoundClick(roundLabel: string) {
    setRound(roundLabel);

    const divNode = btnListRef.current;
    const btnNode =
      divNode?.querySelectorAll("button")[roundLabels.indexOf(roundLabel)];
    btnNode?.scrollIntoView({
      behavior: "smooth",
    });
  }

  // Swipe actions
  const MOVE_THRESHOLD = 100;

  let initialX = 0;
  let moveX = 0;

  function touchStart(event: React.TouchEvent<HTMLDivElement>) {
    initialX = event.touches[0].pageX;
  }

  function touchMove(event: React.TouchEvent<HTMLDivElement>) {
    let currentX = event.touches[0].pageX;
    moveX = currentX - initialX;
  }

  function touchEnd() {
    let curIndex = roundLabels.indexOf(round);

    if (moveX < -MOVE_THRESHOLD) {
      curIndex + 1 !== roundLabels.length &&
        handleRoundClick(roundLabels[curIndex + 1]);
    } else if (moveX > MOVE_THRESHOLD) {
      curIndex !== 0 && handleRoundClick(roundLabels[curIndex - 1]);
    }

    moveX = 0;
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
            ref={item === curRound ? initialBtn : null} //Only use for initial page load
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
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        className="flex-1 overflow-y-auto"
      >
        <FixtureList
          data={data.filter(
            (item) =>
              item.roundLabel === round &&
              item.status !== MATCHSTATUSAFL.LONG_CANC &&
              item.status !== MATCHSTATUSNFL.LONG_CANC,
          )}
        />
      </div>
    </>
  );
}
