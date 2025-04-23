"use client";
import { SPORT } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

const footerLinks: {
  sport: string;
  link: string;
  img: string;
  altText: string;
}[] = [
  {
    sport: "abc news",
    link: "https://www.abc.net.au/news/sport",
    img: "/abc-news-logo.svg",
    altText: "ABC News",
  },
  {
    sport: SPORT.CRICKET,
    link: `/sports/${SPORT.CRICKET}/main/matches#current-date`,
    img: "/cricket-ball.svg",
    altText: "Cricket",
  },
  {
    sport: SPORT.NRL,
    link: `/sports/${SPORT.NRL}/matches`,
    img: "/nrl-ball.svg",
    altText: "NRL",
  },
  {
    sport: SPORT.AFL,
    link: `/sports/${SPORT.AFL}/matches`,
    img: "/afl-ball.svg",
    altText: "AFL",
  },
  {
    sport: SPORT.NFL,
    link: `/sports/${SPORT.NFL}/main/matches`,
    img: "/american-football.svg",
    altText: "NFL",
  },
  {
    sport: SPORT.F1,
    link: `/sports/${SPORT.F1}/main/races#current-date`,
    img: "/f1-helmet.svg",
    altText: "F1",
  },
  {
    sport: SPORT.GOLF,
    link: `/sports/${SPORT.GOLF}`,
    img: "/golf-ball.svg",
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
          <Avatar
            className={cn(
              "size-11 p-[6px]",
              curSport === item.sport
                ? "bg-gray-500 dark:bg-neutral-400"
                : "bg-gray-400 dark:bg-neutral-600",
            )}
          >
            <AvatarImage src={item.img} alt={item.sport} />
            <AvatarFallback>
              <Image src={"/vercel.svg"} width={30} height={10} alt="" />
            </AvatarFallback>
          </Avatar>
        </Link>
      ))}
    </footer>
  );
}
