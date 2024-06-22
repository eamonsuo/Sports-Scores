"use client";

import { useState } from "react";
import FixtureSummaryList from "./FixtureSummaryList";

export default function FixtureRoundList({
  data,
  rounds,
}: {
  data: MatchSummary[];
  rounds: number;
}) {
  const [round, setRound] = useState(1);

  const hideScroll = `
    .roundScroll::-webkit-scrollbar {
        display: none;
    }`;

  let buttonRow = [];
  for (let i = 1; i <= rounds; i++) {
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
      <div className="roundScroll flex overflow-x-auto">{buttonRow}</div>

      <FixtureSummaryList
        data={data.filter(
          (item) =>
            item.otherDetail === `Round ${round}` &&
            item.status !== "Cancelled",
        )}
      />
    </>
  );
}
