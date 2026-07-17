"use client"

import { CricketInningIncident } from "@/types/cricket"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../shadcn/chart"

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

function Manhatten({
  matchIncidents,
}: {
  matchIncidents: CricketInningIncident[]
}) {
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

  const overs = new Map<number, Record<string, string | number>>()

  matchIncidents.forEach((inning) => {
    inning.inningIncidents.forEach((over) => {
      const item = overs.get(over.over) ?? { over: over.over }

      item[inning.inningLabel] = over.runs

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
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="over"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {matchIncidents.map((inning) => (
              <Bar
                key={inning.inningLabel}
                dataKey={inning.inningLabel}
                // fill={
                //   inning.inningLabel === "desktop"
                //     ? "var(--color-desktop)"
                //     : "var(--color-mobile)"
                // }
                radius={4}
              />
            ))}
          </BarChart>
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

  const overs = new Map<number, Record<string, string | number>>()

  matchIncidents.forEach((inning) => {
    inning.inningIncidents.forEach((over) => {
      const item = overs.get(over.over) ?? { over: over.over }

      item[inning.inningLabel] =
        Number(over.teamScore.split("/")[1]) / over.over

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
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="over"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {matchIncidents.map((inning) => (
              <Line
                key={inning.inningLabel}
                dataKey={inning.inningLabel}
                dot={false}
                type="natural"
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function Worm({ matchIncidents }: { matchIncidents: CricketInningIncident[] }) {
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

  const overs = new Map<number, Record<string, string | number>>()

  matchIncidents.forEach((inning) => {
    inning.inningIncidents.forEach((over) => {
      const item = overs.get(over.over) ?? { over: over.over }

      item[inning.inningLabel] = Number(over.teamScore.split("/")[1])

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
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="over"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {matchIncidents.map((inning) => (
              <Line
                key={inning.inningLabel}
                dataKey={inning.inningLabel}
                dot={false}
                type="natural"
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
