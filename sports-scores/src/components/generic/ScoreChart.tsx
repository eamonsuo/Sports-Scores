"use client";

import Image from "next/image";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";

export default function ScoreChart({
  scoreDifference,
  homeLogo,
  awayLogo,
}: {
  scoreDifference: { event: string; difference: number }[]; // Array of numbers representing the score difference between the home team (+) and away team (-) after each score
  homeLogo: string;
  awayLogo: string;
}) {
  const chartConfig = {
    desktop: {
      label: "Score Difference",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  console.log("DEV --- ", scoreDifference);

  let values = scoreDifference;
  values = [{ event: "Start", difference: 0 }].concat(values);
  values.push(values.at(-1) ?? { event: "End", difference: 0 });

  let ymax = values.reduce((a, b) => Math.max(a, b.difference), -Infinity);
  let ymin = -values.reduce((a, b) => Math.min(a, b.difference), Infinity);
  let yrange = ymax >= ymin ? ymax : ymin;

  return (
    <>
      <p className="m-4">Score Trend</p>
      <div className="mx-4 flex gap-2">
        <div className="flex flex-col place-content-around">
          <Image src={homeLogo} width={15} height={15} alt="Home team image" />
          <Image src={awayLogo} width={15} height={15} alt="Away team image" />
        </div>
        <ChartContainer config={chartConfig} className="min-h-[100px] flex-1">
          <LineChart accessibilityLayer data={values}>
            <YAxis
              width={20}
              tickLine={false}
              ticks={[-yrange - 1, 0, yrange + 1]}
              domain={[-yrange - 1, yrange + 1]}
            />
            <XAxis tickLine={false} tick={false} axisLine={false} height={5} />
            <CartesianGrid strokeDasharray="4" vertical={false} />
            <Line type="stepAfter" dataKey="difference" dot={false} />
          </LineChart>
        </ChartContainer>
      </div>
    </>
  );
}
