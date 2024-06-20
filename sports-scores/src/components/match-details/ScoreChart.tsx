"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ScoreChart({
  gameData,
  eventData,
}: {
  gameData: AFLGame;
  eventData: AFLGameEvents;
}) {
  let difference = 0;
  // console.log("NEW");
  // console.log("quarters", data);

  let y = eventData.events.flatMap((item) => {
    if (item.team.id == gameData.teams.home.id) {
      item.type === "behind" ? (difference += 1) : (difference += 6);
    } else {
      item.type === "behind" ? (difference -= 1) : (difference -= 6);
    }
    return difference;
  });

  y = [0].concat(y);
  y.push(y.at(-1) ?? 0);
  // console.log("y:", y);
  let x = [];

  for (let i = 0; i < y.length; i++) {
    x.push(i);
  }

  let ymax = y.reduce((a, b) => Math.max(a, b), -Infinity);
  let ymin = -y.reduce((a, b) => Math.min(a, b), Infinity);
  let yrange = ymax >= ymin ? ymax : ymin;

  // console.log("MAX", yrange);

  return (
    <>
      <p className="m-4">Score Trend</p>
      <div className="flex">
        <div className="ms-1 flex flex-col place-content-around">
          <Image
            src={gameData.teams.home.logo}
            width={15}
            height={15}
            alt="Home team image"
          />
          <Image
            src={gameData.teams.away.logo}
            width={15}
            height={15}
            alt="Away team image"
          />
        </div>
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
            margin: { l: 20, t: 0, b: 0, r: 20 },
            xaxis: { fixedrange: true, showticklabels: false },
            yaxis: {
              fixedrange: true,
              range: [-yrange - 1, yrange + 1],
              // side: "right",
            },
            // yaxis2: {
            //   range: ["Home", "Away"],
            // },
          }}
          config={{ displayModeBar: false }}
        />
      </div>
    </>
  );
}
