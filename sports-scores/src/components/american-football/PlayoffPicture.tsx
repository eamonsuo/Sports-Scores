"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../misc-ui/Button";

// Types for the playoff data structure
interface Team {
  name: string;
  seed: number;
  logo?: string;
  record?: string;
}

export interface PlayoffPictureProps {
  afc: {
    divisional: Team;
    wildCard: [Team, Team][];
    inHunt: Team[];
    eliminated: Team[];
  };
  nfc: {
    divisional: Team;
    wildCard: [Team, Team][];
    inHunt: Team[];
    eliminated: Team[];
  };
}

export default function PlayoffPicture({ afc, nfc }: PlayoffPictureProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-4 w-full">
      <div className="mb-2 flex justify-center">
        <Button
          variant="outline"
          className="rounded bg-neutral-600 px-4 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          Playoff Picture
        </Button>
      </div>
      {open && (
        <div className="grid grid-cols-2 gap-6 rounded-lg border bg-gray-100 p-4 dark:bg-neutral-900">
          {/* AFC Column */}
          <div>
            <h3 className="mb-2 text-center text-lg text-red-700 dark:text-red-400">
              AFC
            </h3>
            <div className="mb-4">
              <h4 className="text-center">Divisional Round</h4>

              <div
                key={afc.divisional.seed}
                className="flex items-center justify-center gap-2 py-1"
              >
                <span>{afc.divisional.seed}</span>
                {afc.divisional.logo && (
                  <Image
                    src={afc.divisional.logo}
                    alt={"Team Logo"}
                    className="h-8 w-8"
                  />
                )}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-center">Wild Card Round</h4>
              {afc.wildCard.map(([home, away], i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 py-1"
                >
                  <span>{home.seed}</span>

                  {home.logo && (
                    <Image
                      src={home.logo}
                      alt={"Team Logo"}
                      className="h-8 w-8"
                    />
                  )}
                  <span className="mx-2 text-xs text-gray-400">vs</span>
                  <span>{away.seed}</span>
                  {away.logo && (
                    <Image
                      src={away.logo}
                      alt={"Team Logo"}
                      className="h-8 w-8"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h4 className="text-center">In the Hunt</h4>
              {Array.from({ length: Math.ceil(afc.inHunt.length / 3) }).map(
                (_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex items-center justify-center gap-2 py-1"
                  >
                    {afc.inHunt
                      .slice(rowIdx * 3, rowIdx * 3 + 3)
                      .map((team) => (
                        <span key={team.seed} className="flex items-center">
                          {team.logo && (
                            <Image
                              src={team.logo}
                              alt={"Team Logo"}
                              className="h-8 w-8"
                            />
                          )}
                        </span>
                      ))}
                  </div>
                ),
              )}
            </div>
            <div>
              <h4 className="text-center">Eliminated</h4>
              {Array.from({ length: Math.ceil(afc.eliminated.length / 3) }).map(
                (_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex items-center justify-center gap-2 py-1 text-gray-400"
                  >
                    {afc.eliminated
                      .slice(rowIdx * 3, rowIdx * 3 + 3)
                      .map((team) => (
                        <span key={team.seed} className="flex items-center">
                          {team.logo && (
                            <Image
                              src={team.logo}
                              alt={"Team Logo"}
                              className="h-8 w-8"
                            />
                          )}
                        </span>
                      ))}
                  </div>
                ),
              )}
            </div>
          </div>
          {/* NFC Column */}
          <div>
            <h3 className="mb-2 text-center text-lg text-blue-700 dark:text-blue-400">
              NFC
            </h3>
            <div className="mb-4">
              <h4 className="text-center">Divisional Round</h4>
              <div
                key={nfc.divisional.seed}
                className="flex items-center justify-center gap-2 py-1"
              >
                <span>{nfc.divisional.seed}</span>
                {nfc.divisional.logo && (
                  <Image
                    src={nfc.divisional.logo}
                    alt={"Team Logo"}
                    className="h-8 w-8"
                  />
                )}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-center">Wild Card Round</h4>
              {nfc.wildCard.map(([home, away], i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 py-1"
                >
                  <span>{home.seed}</span>

                  {home.logo && (
                    <Image
                      src={home.logo}
                      alt={"Team Logo"}
                      className="h-8 w-8"
                    />
                  )}
                  <span className="mx-2 text-xs text-gray-400">vs</span>
                  <span>{away.seed}</span>
                  {away.logo && (
                    <Image
                      src={away.logo}
                      alt={"Team Logo"}
                      className="h-8 w-8"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h4 className="text-center">In the Hunt</h4>
              {Array.from({ length: Math.ceil(nfc.inHunt.length / 3) }).map(
                (_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex items-center justify-center gap-2 py-1"
                  >
                    {nfc.inHunt
                      .slice(rowIdx * 3, rowIdx * 3 + 3)
                      .map((team) => (
                        <span key={team.seed} className="flex items-center">
                          {team.logo && (
                            <Image
                              src={team.logo}
                              alt={"Team Logo"}
                              className="h-8 w-8"
                            />
                          )}
                        </span>
                      ))}
                  </div>
                ),
              )}
            </div>
            <div>
              <h4 className="text-center">Eliminated</h4>
              {Array.from({ length: Math.ceil(nfc.eliminated.length / 3) }).map(
                (_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex items-center justify-center gap-2 py-1 text-gray-400"
                  >
                    {nfc.eliminated
                      .slice(rowIdx * 3, rowIdx * 3 + 3)
                      .map((team) => (
                        <span key={team.seed} className="flex items-center">
                          {team.logo && (
                            <Image
                              src={team.logo}
                              alt={"Team Logo"}
                              className="h-8 w-8"
                            />
                          )}
                        </span>
                      ))}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
