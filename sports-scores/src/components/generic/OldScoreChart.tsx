"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import Spinner from "../misc/Spinner";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function OldScoreChart({
  scoreDifference,
  homeLogo,
  awayLogo,
}: {
  scoreDifference: number[]; // Array of numbers representing the score difference between the home team (+) and away team (-) after each score
  homeLogo: string;
  awayLogo: string;
}) {
  const [loading, setLoading] = useState(true);

  let y = scoreDifference;

  y = [0].concat(y);
  y.push(y.at(-1) ?? 0);

  let ymax = y.reduce((a, b) => Math.max(a, b), -Infinity);
  let ymin = -y.reduce((a, b) => Math.min(a, b), Infinity);
  let yrange = ymax >= ymin ? ymax : ymin;

  return (
    <>
      <p className="m-4">Score Trend</p>
      {loading && <Spinner />} {/* TODO improve */}
      <div className="flex">
        <div className="ms-1 flex flex-col place-content-around">
          <Image src={homeLogo} width={15} height={15} alt="Home team image" />
          <Image src={awayLogo} width={15} height={15} alt="Away team image" />
        </div>
        <Plot
          onInitialized={() => setLoading(false)}
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
            xaxis: { showticklabels: false },
            yaxis: {
              range: [-yrange - 1, yrange + 1],
              // side: "right",
            },
            // yaxis2: {
            //   range: ["Home", "Away"],
            // },
          }}
          config={{ staticPlot: true /*responsive: true*/ }}
        />
      </div>
    </>
  );
}
