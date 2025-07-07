"use client";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { SPORT } from "@/types/misc";
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
    img: "/footer/abc-news-logo.svg",
    altText: "ABC News",
  },
  {
    sport: SPORT.CRICKET,
    link: `/sports/${SPORT.CRICKET}/main/matches/today`,
    img: "/footer/cricket-ball.svg",
    altText: "Cricket",
  },
  {
    sport: SPORT.NRL,
    link: `/sports/${SPORT.NRL}/matches`,
    img: "/footer/nrl-ball.svg",
    altText: "NRL",
  },
  {
    sport: SPORT.AFL,
    link: `/sports/${SPORT.AFL}/matches`,
    img: "/footer/afl-ball.svg",
    altText: "AFL",
  },
  {
    sport: SPORT.NFL,
    link: `/sports/${SPORT.NFL}/main/matches`,
    img: "/footer/american-football.svg",
    altText: "NFL",
  },
  {
    sport: SPORT.F1,
    link: `/sports/${SPORT.F1}/main/races#current-date`,
    img: "/footer/f1-helmet.svg",
    altText: "F1",
  },
  {
    sport: SPORT.GOLF,
    link: `/sports/${SPORT.GOLF}`,
    img: "/footer/golf-ball.svg",
    altText: "Golf",
  },
  {
    sport: SPORT.CYCLING,
    // link: `/sports/${SPORT.CYCLING}`,
    link: `https://www.flashscore.com.au/cycling/`,
    img: "/footer/bike.svg",
    altText: "Cycling",
  },
  {
    sport: SPORT.FOOTBALL,
    // link: `/sports/${SPORT.FOOTBALL}`,
    link: `https://www.livescore.com/en/`,
    img: "/footer/football.svg",
    altText: "Football",
  },
  {
    sport: SPORT.SURFING,
    // link: `/sports/${SPORT.SURFING}`,
    link: `https://www.worldsurfleague.com/events`,
    img: "/footer/surfboard.svg",
    altText: "Surfing",
  },
  {
    sport: SPORT.TENNIS,
    // link: `/sports/${SPORT.TENNIS}`,
    link: `https://www.livescore.com/en/tennis/`,
    img: "/footer/tennis.svg",
    altText: "Tennis",
  },
  {
    sport: SPORT.BASEBALL,
    // link: `/sports/${SPORT.BASEBALL}/main/matches`,
    link: `https://www.flashscore.com.au/baseball/`,
    img: "/footer/baseball.svg",
    altText: "Baseball",
  },
  {
    sport: SPORT.BASKETBALL,
    // link: `/sports/${SPORT.BASKETBALL}`,
    link: `https://www.livescore.com/en/basketball/`,
    img: "/footer/basketball.svg",
    altText: "Basketball",
  },
  {
    sport: SPORT.ICE_HOCKEY,
    // link: `/sports/${SPORT.ICE_HOCKEY}`,
    link: `https://www.livescore.com/en/hockey/`,
    img: "/footer/hockey-puck.svg",
    altText: "Hockey",
  },
  {
    sport: SPORT.NETBALL,
    // link: `/sports/${SPORT.NETBALL}`,
    link: `https://www.flashscore.com.au/netball/`,
    img: "/footer/netball.png",
    altText: "Netball",
  },
  {
    sport: SPORT.RUGBY_UNION,
    // link: `/sports/${SPORT.RUGBY_UNION}`,
    link: `https://www.flashscore.com.au/rugby/`,
    img: "/footer/union.png",
    altText: "Rugby Union",
  },
  {
    sport: SPORT.OLYMPICS,
    link: `/sports/${SPORT.OLYMPICS}`,
    img: "/olympic-rings.svg",
    altText: "Olympics",
  },
];

export default function Footer() {
  const [curSport, setCurSport] = useState("");
  return (
    <footer className="hideScroll flex h-32 w-full flex-row place-items-center gap-2 overflow-auto bg-gray-200 p-1 dark:bg-neutral-900">
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
