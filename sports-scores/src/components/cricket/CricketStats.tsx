"use client"

import { CricketInningIncident } from "@/types/cricket"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../shadcn/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function CricketStats({
  matchIncidents,
}: {
  matchIncidents?: CricketInningIncident[]
}) {
  return (
    matchIncidents && (
      <div className="flex flex-col gap-6 p-4">
        <Manhatten matchIncidents={matchIncidents} />
        <RunRate matchIncidents={matchIncidents} />
        <Worm matchIncidents={matchIncidents} />
      </div>
    )
  )
}

const colours = [
  "#3182bd",
  "#dd6b20",
  "#805ad5",
  "#d69e2e",
  "#38a169",
  "#e53e3e",
]

function Manhatten({
  matchIncidents,
}: {
  matchIncidents: CricketInningIncident[]
}) {
  const overs = new Map<number, Record<string, string | number>>()

  matchIncidents.forEach((inning) => {
    inning.inningIncidents.forEach((over) => {
      const item = overs.get(over.over) ?? { over: over.over }

      item[inning.inningLabel] = over.runs

      for (let i = 0; i < over.wickets; i++) {
        item[inning.inningLabel + "Wickets"] = over.runs + 1 + i
      }

      overs.set(over.over, item)
    })
  })

  const data = Array.from(overs.values()).sort(
    (a, b) => Number(a.over) - Number(b.over),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manhatten</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart accessibilityLayer data={data}>
            <Legend />

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="over"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={30}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {matchIncidents.map((inning, index) => (
              <Bar
                key={inning.inningLabel}
                dataKey={inning.inningLabel}
                // fill={
                //   inning.inningLabel === "desktop"
                //     ? "var(--color-desktop)"
                //     : "var(--color-mobile)"
                // }
                fill={colours[index % colours.length]}
                radius={4}
              />
            ))}
            {/* {matchIncidents.map((inning, index) => (
              <Scatter
                key={inning.inningLabel + "Wickets"}
                dataKey={inning.inningLabel + "Wickets"}
                legendType="none"
                fill={colours[index % colours.length]}
              />
            ))} */}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function RunRate({
  matchIncidents,
}: {
  matchIncidents: CricketInningIncident[]
}) {
  const overs = new Map<number, Record<string, string | number>>()

  matchIncidents.forEach((inning) => {
    inning.inningIncidents.forEach((over) => {
      const item = overs.get(over.over) ?? { over: over.over }

      item[inning.inningLabel] =
        Number(over.teamScore.split("/")[1]) / over.over

      for (let i = 0; i < over.wickets; i++) {
        item[inning.inningLabel + "Wickets"] =
          Number(over.teamScore.split("/")[1]) / over.over + i
      }

      overs.set(over.over, item)
    })
  })

  const data = Array.from(overs.values()).reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <Legend />
            <XAxis
              dataKey="over"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              width={30}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {matchIncidents.map((inning, index) => (
              <Line
                key={inning.inningLabel}
                dataKey={inning.inningLabel}
                dot={false}
                type="natural"
                stroke={colours[index % colours.length]}
              />
            ))}
            {matchIncidents.map((inning, index) => (
              <Scatter
                key={inning.inningLabel + "Wickets"}
                dataKey={inning.inningLabel + "Wickets"}
                legendType="none"
                fill={colours[index % colours.length]}
              />
            ))}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function Worm({ matchIncidents }: { matchIncidents: CricketInningIncident[] }) {
  const overs = new Map<number, Record<string, string | number>>()

  matchIncidents.forEach((inning) => {
    inning.inningIncidents.forEach((over) => {
      const item = overs.get(over.over) ?? { over: over.over }

      item[inning.inningLabel] = Number(over.teamScore.split("/")[1])

      for (let i = 0; i < over.wickets; i++) {
        item[inning.inningLabel + "Wickets"] =
          Number(over.teamScore.split("/")[1]) + i
      }

      overs.set(over.over, item)
    })
  })

  const data = Array.from(overs.values()).reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Worm</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <Legend />
            <XAxis
              dataKey="over"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              width={30}
              tickMargin={10}
              axisLine={false}
            />
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            /> */}
            {matchIncidents.map((inning, index) => (
              <Line
                key={inning.inningLabel}
                dataKey={inning.inningLabel}
                dot={false}
                type="natural"
                stroke={colours[index % colours.length]}
              />
            ))}
            {matchIncidents.map((inning, index) => (
              <Scatter
                key={inning.inningLabel + "Wickets"}
                dataKey={inning.inningLabel + "Wickets"}
                legendType="none"
                fill={colours[index % colours.length]}
              />
            ))}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
