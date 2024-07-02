"use client";

import { useEffect, useState } from "react";
import FixtureSummaryList from "./FixtureSummaryList";
import { MATCHSTATUSAFL, MATCHSTATUSNFL } from "@/lib/constants";

export default function FixtureRoundList({
  data,
  rounds,
  curRound,
}: {
  data: MatchSummary[];
  rounds: string[];
  curRound: string;
}) {
  const [round, setRound] = useState(curRound); //need to put in parent so that it only gets set once. Need to change page structure?

  useEffect(() => {
    let curBtn = document.getElementById(`${round}`);
    curBtn?.scrollIntoView({ inline: "center" });
  }, [round]);

  const hideScroll = `
    .hideScroll::-webkit-scrollbar {
        display: none;
    }`;

  let buttonRow = [];
  for (let i = 0; i < rounds.length; i++) {
    buttonRow.push(
      <button
        key={rounds[i]}
        id={rounds[i]}
        className="mx-2 mb-3 whitespace-nowrap border-b border-gray-300 text-sm"
        onClick={() => setRound(rounds[i])}
      >
        {rounds[i]}
      </button>,
    );
  }

  return (
    <>
      <style>{hideScroll}</style>
      <div className="hideScroll flex overflow-x-auto px-2">{buttonRow}</div>

      <FixtureSummaryList
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
