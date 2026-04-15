"use client";
import Image from "next/image";
import { useState } from "react";
import { AvatarFallback } from "../misc-ui/Avatar";
import { Button } from "../misc-ui/Button";

export interface PlayoffTeam {
  name: string;
  seed: number;
  logo?: string;
}

export interface PlayoffSection {
  title: string;
  teams: PlayoffTeam[] | [PlayoffTeam, PlayoffTeam][];
}

export interface PlayoffConference {
  conferenceMatches: PlayoffSection[];
  name?: string;
  colour?: string;
}

const gridCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

function Matchup({ home, away }: { home: PlayoffTeam; away: PlayoffTeam }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <span className="w-4 text-right">{home.seed}</span>
      {home.logo && (
        <Image
          src={home.logo ?? AvatarFallback}
          alt={"Team Logo"}
          width={32}
          height={32}
        />
      )}
      <span className="mx-2 text-xs text-gray-400">vs</span>
      {away.logo && (
        <Image
          src={away.logo ?? AvatarFallback}
          alt={"Team Logo"}
          width={32}
          height={32}
        />
      )}
      <span className="w-4 text-left">{away.seed}</span>
    </div>
  );
}

export default function PlayoffPicture({
  data,
  buttonLabel,
}: {
  data: PlayoffConference[];
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-4 w-full">
      <div className="mb-2 flex justify-center">
        <Button
          variant="outline"
          className="rounded bg-neutral-600 px-4 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          {buttonLabel ?? "Playoff Picture"}
        </Button>
      </div>
      {open && (
        <div
          className={`grid ${gridCols[data.length] ?? "grid-cols-1"} gap-6 rounded-lg border bg-gray-100 p-4 dark:bg-neutral-900`}
        >
          {data.map((conference, i) => (
            <div key={i}>
              <h3
                className={`mb-2 text-center text-lg ${conference.colour ?? "text-gray-700 dark:text-gray-300"}`}
              >
                {conference.name}
              </h3>
              {conference.conferenceMatches.map((section, j) => (
                <div key={j} className="mb-4">
                  <h4 className="text-center">{section.title}</h4>
                  {Array.isArray(section.teams[0])
                    ? (section.teams as [PlayoffTeam, PlayoffTeam][]).map(
                        ([home, away], k) => (
                          <Matchup key={k} home={home} away={away} />
                        ),
                      )
                    : Array.from({
                        length: Math.ceil(section.teams.length / 3),
                      }).map((_, rowIdx) => (
                        <div
                          key={rowIdx}
                          className="flex items-center justify-center gap-2 py-1"
                        >
                          {(section.teams as PlayoffTeam[])
                            .slice(rowIdx * 3, rowIdx * 3 + 3)
                            .map((team) => (
                              <span
                                key={team.seed}
                                className="flex items-center"
                              >
                                {team.logo && (
                                  <Image
                                    src={team.logo ?? AvatarFallback}
                                    alt={"Team Logo"}
                                    width={32}
                                    height={32}
                                  />
                                )}
                              </span>
                            ))}
                        </div>
                      ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap">
              <tbody>
                <tr className="collapse"></tr>
                <tr>
                  <td className="w-px"></td>
                  <td className="w-36"></td>
                  <td className="w-24"></td>
                  <td className="w-0.5 pl-2"></td>
                  <td className="w-0.5 pr-1"></td>
                  <td className="w-6"></td>
                  <td className="w-36"></td>
                  <td className="w-24"></td>
                  <td className="w-0.5 pl-2"></td>
                  <td className="w-1 pl-1"></td>
                  <td className="w-0.5 pr-1"></td>
                  <td className="w-6"></td>
                  <td className="w-36"></td>
                  <td className="w-24"></td>
                  <td className="w-0.5 pl-2"></td>
                  <td className="w-0.5 pr-1"></td>
                  <td className="w-6"></td>
                  <td className="w-36"></td>
                  <td className="w-24"></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border" colSpan={2} rowSpan={2}>
                    Qualifying and elimination finals
                  </td>
                  <td rowSpan={7}></td>
                  <td rowSpan={7}></td>
                  <td className="border" colSpan={3} rowSpan={2}>
                    Semi-finals
                  </td>
                  <td rowSpan={7}></td>
                  <td rowSpan={7}></td>
                  <td rowSpan={7}></td>
                  <td className="border" colSpan={3} rowSpan={2}>
                    Preliminary finals
                  </td>
                  <td rowSpan={15}></td>
                  <td rowSpan={15}></td>
                  <td className="border" colSpan={3} rowSpan={2}>
                    Grand final
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td colSpan={2} rowSpan={2}></td>
                  <td colSpan={3} rowSpan={4}></td>
                  <td colSpan={3} rowSpan={10}></td>
                  <td colSpan={3} rowSpan={14}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border" colSpan={2} rowSpan={2}>
                    QF1
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l border-t" rowSpan={2}>
                    {qualifyingFinals[0][0].logo && (
                      <Image
                        src={qualifyingFinals[0][0].logo ?? AvatarFallback}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}
                  </td>
                  <td className="border" rowSpan={2}>
                    Home
                  </td>
                  <td
                    colSpan={3}
                    rowSpan={2}
                    className="border-b-2 border-gray-500"
                  ></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l" rowSpan={2}>
                    {qualifyingFinals[0][1].logo && (
                      <Image
                        src={qualifyingFinals[0][1].logo}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Away
                  </td>
                  <td className="border-r-2 border-t-2 border-solid border-red-500"></td>
                  <td></td>
                  <td colSpan={3} rowSpan={2} className="border">
                    SF1
                  </td>
                  <td rowSpan={3}></td>
                  <td
                    rowSpan={3}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={3}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-red-500"
                  ></td>
                  <td rowSpan={2}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td colSpan={2} rowSpan={2}></td>
                  <td
                    className="border-b border-l border-t"
                    colSpan={2}
                    rowSpan={2}
                  >
                    Loser of QF1
                  </td>
                  <td className="border" rowSpan={2}>
                    Home
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-r-2 border-solid border-red-500"></td>
                  <td className="border-b-2 border-solid border-red-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td colSpan={2} rowSpan={2} className="border">
                    EF1
                  </td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-t-2 border-solid border-gray-500"></td>
                  <td className="border-b border-l" colSpan={2} rowSpan={2}>
                    Winner of EF1
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Away
                  </td>
                  <td className="border-r-2 border-t border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td></td>
                  <td colSpan={3} rowSpan={2} className="border">
                    QF1
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l border-t" rowSpan={2}>
                    {eliminationFinals[0][0].logo && (
                      <Image
                        src={eliminationFinals[0][0].logo}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}{" "}
                  </td>
                  <td className="border" rowSpan={2}>
                    Home
                  </td>
                  <td colSpan={3}></td>
                  <td
                    className="border-b border-l border-t"
                    colSpan={2}
                    rowSpan={2}
                  >
                    Winner of QF1
                  </td>
                  <td className="border" rowSpan={2}>
                    Home
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b-2 border-r-2 border-solid border-gray-500"></td>
                  <td></td>
                  <td colSpan={3} rowSpan={2}></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l" rowSpan={2}>
                    {eliminationFinals[0][1].logo && (
                      <Image
                        src={eliminationFinals[0][1].logo}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Away
                  </td>
                  <td className="border-t border-solid border-gray-500"></td>
                  <td></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-t border-solid border-gray-500"></td>
                  <td className="border-b border-l" colSpan={2} rowSpan={2}>
                    Winner of SF2
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Away
                  </td>
                  <td className="border-r-2 border-t border-solid border-gray-500"></td>
                  <td></td>
                  <td colSpan={3} rowSpan={2} className="border">
                    NRL Grand Final
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td rowSpan={6}></td>
                  <td rowSpan={6}></td>
                  <td colSpan={3} rowSpan={7}></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td colSpan={2} rowSpan={2}></td>
                  <td colSpan={3} rowSpan={2}></td>
                  <td
                    className="border-b border-l border-t"
                    colSpan={2}
                    rowSpan={2}
                  >
                    Winner of PF1
                  </td>
                  <td className="border" rowSpan={2}>
                    Neutral
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td rowSpan={2}></td>
                  <td
                    rowSpan={2}
                    className="-translate-x-px bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),gray_calc(50%-1px),gray_calc(50%+1px),transparent_calc(50%+1px)),linear-gradient(to_bottom_right,transparent_calc(50%-1px),gray_calc(50%-1px),gray_calc(50%+1px),transparent_calc(50%+1px))]"
                  ></td>
                  <td rowSpan={2}></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td colSpan={2} rowSpan={2} className="border">
                    EF2
                  </td>
                  <td colSpan={3} rowSpan={2} className="border">
                    QF2
                  </td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-t border-solid border-gray-500"></td>
                  <td className="border-b border-l" colSpan={2} rowSpan={2}>
                    Winner of PF2
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Neutral
                  </td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l border-t" rowSpan={2}>
                    {eliminationFinals[1][0].logo && (
                      <Image
                        src={eliminationFinals[1][0].logo}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}
                  </td>
                  <td className="border" rowSpan={2}>
                    Home
                  </td>
                  <td
                    className="border-b border-l border-t"
                    colSpan={2}
                    rowSpan={2}
                  >
                    Winner of SF1
                  </td>
                  <td className="border" rowSpan={2}>
                    Away
                  </td>
                  <td colSpan={3} rowSpan={12}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-r-2 border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l" rowSpan={2}>
                    {eliminationFinals[1][1].logo && (
                      <Image
                        src={eliminationFinals[1][1].logo}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Away
                  </td>
                  <td className="border-r-2 border-t border-solid border-gray-500"></td>
                  <td></td>
                  <td colSpan={3} rowSpan={2} className="border">
                    SF2
                  </td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-t border-solid border-gray-500"></td>
                  <td className="border-b border-l" colSpan={2} rowSpan={2}>
                    Winner of QF2
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Home
                  </td>
                  <td className="border-t border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={2}></td>
                  <td rowSpan={8}></td>
                  <td rowSpan={8}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td colSpan={2} rowSpan={2}></td>
                  <td
                    className="border-b border-l border-t"
                    colSpan={2}
                    rowSpan={2}
                  >
                    Winner of EF2
                  </td>
                  <td className="border" rowSpan={2}>
                    Away
                  </td>
                  <td colSpan={3} rowSpan={8}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-solid border-gray-500"></td>
                  <td className="border-b-2 border-r-2 border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td colSpan={2} rowSpan={2} className="border">
                    QF2
                  </td>
                  <td className="border-r-2 border-solid border-red-500"></td>
                  <td className="border-t-2 border-solid border-red-500"></td>
                  <td className="border-b border-l" colSpan={2} rowSpan={2}>
                    Loser of QF2
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Home
                  </td>
                  <td className="border-t border-solid border-gray-500"></td>
                  <td className="border-r-2 border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td
                    rowSpan={2}
                    className="border-r-2 border-solid border-red-500"
                  ></td>
                  <td rowSpan={2}></td>
                  <td rowSpan={3}></td>
                  <td
                    rowSpan={3}
                    className="border-r-2 border-solid border-gray-500"
                  ></td>
                  <td rowSpan={3}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l border-t" rowSpan={2}>
                    {qualifyingFinals[1][0].logo && (
                      <Image
                        src={qualifyingFinals[1][0].logo}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}
                  </td>
                  <td className="border" rowSpan={2}>
                    Home
                  </td>
                  <td colSpan={3} rowSpan={2}></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b-2 border-r-2 border-solid border-red-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td className="border-b border-l" rowSpan={2}>
                    {qualifyingFinals[1][1].logo && (
                      <Image
                        src={qualifyingFinals[1][1].logo}
                        alt={"Team Logo"}
                        width={26}
                        height={26}
                      />
                    )}
                  </td>
                  <td className="border-b border-l border-r" rowSpan={2}>
                    Away
                  </td>
                  <td className="border-t-2 border-solid border-gray-500"></td>
                  <td className="border-t-2 border-solid border-gray-500"></td>
                  <td
                    colSpan={3}
                    rowSpan={2}
                    className="border-t-2 border-gray-500"
                  ></td>
                  <td className="border-t-2 border-solid border-gray-500"></td>
                  <td className="border-t-2 border-solid border-gray-500"></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="h-3"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
 */
