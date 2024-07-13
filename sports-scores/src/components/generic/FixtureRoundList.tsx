"use client";

import { useEffect, useRef, useState } from "react";
import FixtureList from "./FixtureList";
import { MATCHSTATUSAFL, MATCHSTATUSNFL } from "@/lib/constants";
import { clsx } from "clsx";
import { MatchSummary } from "@/types/misc";

export default function FixtureRoundList({
  data,
  curRound,
}: {
  data: MatchSummary[];
  curRound: string;
}) {
  const [round, setRound] = useState(curRound); //need to put in parent so that it only gets set once. Need to change page structure?
  const curBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    curBtn.current?.scrollIntoView({ inline: "center", behavior: "smooth" });
  }, []);

  let roundLabels = [...new Set(data.map((item) => item.roundLabel ?? ""))];

  let buttonRow = [];
  for (let i = 0; i < roundLabels.length; i++) {
    buttonRow.push(
      <button
        key={roundLabels[i]}
        id={roundLabels[i]}
        ref={roundLabels[i] === curRound ? curBtn : null}
        className="mx-2 mb-3 whitespace-nowrap border-b border-gray-300 text-sm"
        onClick={() => setRound(roundLabels[i])}
      >
        {roundLabels[i]}
      </button>,
    );
  }

  return (
    <>
      <div className="hideScroll mx-2 mb-2 flex gap-1 overflow-x-auto">
        {roundLabels.map((item) => (
          <button
            onClick={() => setRound(item)}
            ref={item === curRound ? curBtn : null}
            key={item}
            className={clsx(
              "inline-flex items-center justify-center rounded-full px-2.5 py-0.5",
              item === round && "bg-gray-300 text-black",
              item !== round && "bg-gray-100 text-gray-700",
            )}
          >
            <p className="whitespace-nowrap text-sm">{item}</p>
          </button>
        ))}
      </div>

      <FixtureList
        data={data.filter(
          (item) =>
            item.roundLabel === round &&
            item.status !== MATCHSTATUSAFL.LONG_CANC &&
            item.status !== MATCHSTATUSNFL.LONG_CANC,
        )}
      />
    </>
  );
}
