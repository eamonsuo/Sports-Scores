"use client";

import { useEffect, useRef, useState } from "react";
import FixtureList from "./FixtureList";
import { MATCHSTATUSAFL, MATCHSTATUSNFL } from "@/lib/constants";

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

  const hideScroll = `
    .hideScroll::-webkit-scrollbar {
        display: none;
    }`;

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
      <style>{hideScroll}</style>
      <div className="hideScroll flex overflow-x-auto px-2">{buttonRow}</div>

      <FixtureList
        data={data.filter(
          (item) =>
            item.roundLabel === round &&
            (item.status !== MATCHSTATUSAFL.LONG_CANC ||
              item.status !== MATCHSTATUSNFL.LONG_CANC),
        )}
      />
    </>
  );
}
