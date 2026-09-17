"use client"

import { FALLBACK_IMAGE } from "@/lib/constants"
import { FixtureRound } from "@/types/misc"
import dynamic from "next/dynamic"
import Image from "next/image"
import ComponentList from "../misc-ui/ComponentList"
import FixtureListComponent from "./FixtureList"

// TODO: REMOVE IN FUTURE
const FixtureList =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./FixtureList"), { ssr: false })
    : FixtureListComponent

export default function FixtureRoundList({
  data,
  curRound,
}: {
  data: FixtureRound[]
  curRound: string
}) {
  const roundLabels: { groupLabel?: string; labels: string[] }[] = data.reduce(
    (acc, item) => {
      if (!acc.some((group) => group.groupLabel === item.sport)) {
        acc.push({
          groupLabel: item.sport,
          labels: [item.roundLabel],
        })
      } else {
        const group = acc.find((group) => group.groupLabel === item.sport)
        group?.labels.push(item.roundLabel)
      }
      return acc
    },
    [] as { groupLabel?: string; labels: string[] }[],
  )

  return (
    <ComponentList labels={roundLabels} curItem={curRound} showAllLabels={true}>
      {data.map((item) => (
        <div
          key={item.roundLabel}
          className="w-full shrink-0 snap-start overflow-y-auto"
        >
          <FixtureList data={item.matches} />
          {(item.byes?.length ?? 0) > 0 ? (
            <div className="flex items-center gap-1 overflow-x-auto p-4 dark:text-neutral-400">
              Bye:{" "}
              {item.byes?.map((x) => (
                <Image
                  key={x.name}
                  src={x.img ?? FALLBACK_IMAGE}
                  width={60}
                  height={60}
                  style={{ width: "25px", height: "auto" }}
                  alt="Bye team"
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </ComponentList>
  )
}
