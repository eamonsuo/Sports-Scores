"use client";

import { useState } from "react";
import FixtureSummaryList from "./FixtureSummaryList";
import { MATCHSTATUSAFL } from "@/lib/constants";

export default function FixtureRoundList({
  data,
  rounds,
  startingRound,
  curRound,
}: {
  data: MatchSummary[];
  rounds: number;
  startingRound: number;
  curRound: number;
}) {
  const [round, setRound] = useState(curRound);

  const hideScroll = `
    .hideScroll::-webkit-scrollbar {
        display: none;
    }`;

  let buttonRow = [];
  for (let i = startingRound; i <= rounds; i++) {
    buttonRow.push(
      <button
        key={i}
        className="mx-2 mb-3 whitespace-nowrap border-b border-gray-300 text-sm"
        onClick={() => setRound(i)}
      >
        {`Round ${i}`}
      </button>,
    );
  }

  return (
    <>
      <style>{hideScroll}</style>
      <div className="hideScroll flex overflow-x-auto">{buttonRow}</div>

      <FixtureSummaryList
        data={data.filter(
          (item) =>
            item.roundNum === round && item.status !== MATCHSTATUSAFL.LONG_CANC,
        )}
      />
    </>
  );
}
