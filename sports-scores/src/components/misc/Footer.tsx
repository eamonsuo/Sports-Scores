"use client";
import Link from "next/link";
import Image from "next/image";

import cricketBall from "@/../public/cricket-ball-icon.svg";
import aflBall from "@/../public/football.svg";
import abc from "@/../public/Australian_Broadcasting_Corporation_logo_(1974-).svg";
import nflBall from "@/../public/american-football.svg";
import nrlBall from "@/../public/rugby-game-svgrepo-com.svg";
import f1Helmet from "@/../public/f1-helmet-svgrepo-com.svg";
import golfBall from "@/../public/golf-ball-with-dents-svgrepo-com.svg";
import oly from "@/../public/The Paris 2024 Summer Olympics and Paralympics.svg";
import { SPORT, TAILWINDS } from "@/lib/constants";
import clsx from "clsx";
import { useState } from "react";

export default function Footer() {
  const [curSport, setCurSport] = useState("");
  return (
    <footer className="hideScroll flex h-16 w-full flex-row place-items-center gap-2 overflow-auto border-t bg-gray-200 p-1">
      <Link href="https://www.abc.net.au/news/sport">
        <div className={clsx(TAILWINDS.FOOTER_SPORT)}>
          <Image
            src={abc}
            width={30}
            height={30}
            alt="ABC Logo"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link
        href={`/sports/${SPORT.OLYMPICS}`}
        onClick={() => setCurSport(SPORT.OLYMPICS)}
      >
        <div
          className={clsx(
            TAILWINDS.FOOTER_SPORT,
            curSport === SPORT.OLYMPICS ? "bg-gray-500" : "bg-gray-400",
          )}
        >
          <Image
            src={oly}
            width={50}
            height={50}
            alt="Wiki"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link
        href={`/sports/${SPORT.CRICKET}`}
        onClick={() => setCurSport(SPORT.CRICKET)}
      >
        <div
          className={clsx(
            TAILWINDS.FOOTER_SPORT,
            curSport === SPORT.CRICKET ? "bg-gray-500" : "bg-gray-400",
          )}
        >
          <Image
            src={cricketBall}
            width={30}
            height={30}
            alt="cricket ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link
        href={`/sports/${SPORT.NRL}`}
        onClick={() => setCurSport(SPORT.NRL)}
      >
        <div
          className={clsx(
            TAILWINDS.FOOTER_SPORT,
            curSport === SPORT.NRL ? "bg-gray-500" : "bg-gray-400",
          )}
        >
          <Image
            src={nrlBall}
            width={30}
            height={30}
            alt="NRL Ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link
        href={`/sports/${SPORT.AFL}#currentDate`}
        onClick={() => setCurSport(SPORT.AFL)}
      >
        <div
          className={clsx(
            TAILWINDS.FOOTER_SPORT,
            curSport === SPORT.AFL ? "bg-gray-500" : "bg-gray-400",
          )}
        >
          <Image
            src={aflBall}
            width={30}
            height={30}
            alt="AFL ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link
        href={`/sports/${SPORT.NFL}/main/matches`}
        onClick={() => setCurSport(SPORT.NFL)}
      >
        <div
          className={clsx(
            TAILWINDS.FOOTER_SPORT,
            curSport === SPORT.NFL ? "bg-gray-500" : "bg-gray-400",
          )}
        >
          <Image
            src={nflBall}
            width={30}
            height={30}
            alt="NFL ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link
        href={`/sports/${SPORT.F1}#currentDate`}
        onClick={() => setCurSport(SPORT.F1)}
      >
        <div
          className={clsx(
            TAILWINDS.FOOTER_SPORT,
            curSport === SPORT.F1 ? "bg-gray-500" : "bg-gray-400",
          )}
        >
          <Image
            src={f1Helmet}
            width={30}
            height={30}
            alt="F1 Helmet"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link
        href={`/sports/${SPORT.GOLF}`}
        onClick={() => setCurSport(SPORT.GOLF)}
      >
        <div
          className={clsx(
            TAILWINDS.FOOTER_SPORT,
            curSport === SPORT.GOLF ? "bg-gray-500" : "bg-gray-400",
          )}
        >
          <Image
            src={golfBall}
            width={30}
            height={30}
            alt="Golf Ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
    </footer>
  );
}
