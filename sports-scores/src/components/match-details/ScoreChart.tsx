"use client";

import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ScoreChart({ data }: { data: AFLGameEvents }) {
  let difference = 0;
  let homeTeam = 14;
  let awayTeam = 9;

  let y = data.events.flatMap((item) => {
    if (item.team.id == homeTeam) {
      item.type === "behind" ? (difference += 1) : (difference += 6);
    } else {
      item.type === "behind" ? (difference -= 1) : (difference -= 6);
    }
    return difference;
  });

  y = [0].concat(y);
  console.log(y.at(-1));
  y.push(y.at(-1) ?? 0);
  console.log("y:", y);
  let x = [];

  for (let i = 0; i < y.length / 2; i++) {
    x.push(i);
    x.push(i);
  }
  console.log("x:", Array.from(Array(y.length).keys()));

  console.log(
    "MAX",
    y.reduce((a, b) => Math.max(a, b), -Infinity),
  );

  return (
    <>
      <p className="m-4">Score Trend</p>
      <Plot
        className="w-full"
        data={[
          {
            x: Array.from(Array(y.length).keys()),
            y: y,
            type: "scatter",
            mode: "lines",
            line: { shape: "hv" },
          },
          // {
          //   x: [0, 0],
          //   y: ["home", "Away"],
          // },
        ]}
        layout={{
          height: 200,
          margin: { l: 40, t: 20, b: 40, r: 40 },
          yaxis: {
            fixedrange: true,
            range: [
              -y.reduce((a, b) => Math.max(a, b), -Infinity) - 1,
              y.reduce((a, b) => Math.max(a, b), -Infinity) + 1,
            ],
            // side: "right",
          },
          // yaxis2: {
          //   range: ["Home", "Away"],
          // },
        }}
        config={{ displayModeBar: false }}
      />
    </>
  );
}
