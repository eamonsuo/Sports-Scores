"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import { SPORT } from "@/lib/constants";

import cricketBall from "@/../public/cricket-ball-icon.svg";
import aflBall from "@/../public/football.svg";
import abc from "@/../public/Australian_Broadcasting_Corporation_logo_(1974-).svg";
import nflBall from "@/../public/american-football.svg";
import nrlBall from "@/../public/rugby-game-svgrepo-com.svg";
import f1Helmet from "@/../public/f1-helmet-svgrepo-com.svg";
import golfBall from "@/../public/golf-ball-with-dents-svgrepo-com.svg";
import oly from "@/../public/Olympic_Rings.svg";

const footerLinks: {
  sport: string;
  link: string;
  img: string;
  altText: string;
}[] = [
  {
    sport: "abc news",
    link: "https://www.abc.net.au/news/sport",
    img: abc,
    altText: "ABC News",
  },
  {
    sport: SPORT.CRICKET,
    link: `/sports/${SPORT.CRICKET}/main/myteams#current-date`,
    img: cricketBall,
    altText: "Cricket",
  },
  {
    sport: SPORT.NRL,
    link: `/sports/${SPORT.NRL}`,
    img: nrlBall,
    altText: "NRL",
  },
  {
    sport: SPORT.AFL,
    link: `/sports/${SPORT.AFL}/main/matches`,
    img: aflBall,
    altText: "AFL",
  },
  {
    sport: SPORT.NFL,
    link: `/sports/${SPORT.NFL}/main/matches`,
    img: nflBall,
    altText: "NFL",
  },
  {
    sport: SPORT.F1,
    link: `/sports/${SPORT.F1}/main/races#current-date`,
    img: f1Helmet,
    altText: "F1",
  },
  {
    sport: SPORT.GOLF,
    link: `/sports/${SPORT.GOLF}`,
    img: golfBall,
    altText: "Golf",
  },
];

export default function Footer() {
  const [curSport, setCurSport] = useState("");
  return (
    <footer className="hideScroll flex h-16 w-full flex-row place-items-center gap-2 overflow-auto bg-gray-200 p-1 dark:bg-neutral-900">
      {footerLinks.map((item) => (
        <Link
          key={item.sport}
          href={item.link}
          onClick={() => setCurSport(item.sport)}
        >
          <div
            className={clsx(
              "flex size-11 place-content-center rounded-full",
              curSport === item.sport
                ? "bg-gray-500 dark:bg-neutral-400"
                : "bg-gray-400 dark:bg-neutral-600",
            )}
          >
            <Image
              src={item.img}
              width={30}
              height={30}
              alt={item.altText}
              className="text-center"
            ></Image>
          </div>
        </Link>
      ))}
    </footer>
  );
}
