import Link from "next/link";
import Image from "next/image";

import cricketBall from "@/../public/cricket-ball-icon.svg";
import aflBall from "@/../public/football.svg";
import abc from "@/../public/Australian_Broadcasting_Corporation_logo_(1974-).svg";
import nflBall from "@/../public/american-football.svg";
import nrlBall from "@/../public/rugby-game-svgrepo-com.svg";
import f1Helmet from "@/../public/f1-helmet-svgrepo-com.svg";
import golfBall from "@/../public/golf-ball-with-dents-svgrepo-com.svg";
import { SPORT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="flex h-16 w-full flex-row place-items-center gap-2 overflow-auto border-t bg-gray-200 p-1">
      <Link href="https://www.abc.net.au/news/sport">
        <div className="flex size-11 place-content-center rounded-full bg-gray-400 active:bg-gray-500">
          <Image
            src={abc}
            width={30}
            height={30}
            alt="ABC Logo"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link href={`/sports/${SPORT.CRICKET}`}>
        <div className="flex size-11 place-content-center rounded-full bg-gray-400 active:bg-gray-500">
          <Image
            src={cricketBall}
            width={30}
            height={30}
            alt="cricket ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link href={`/sports/${SPORT.NRL}`}>
        <div className="flex size-11 place-content-center rounded-full bg-gray-400 active:bg-gray-500">
          <Image
            src={nrlBall}
            width={30}
            height={30}
            alt="NRL Ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link href={`/sports/${SPORT.AFL}#currentDate`}>
        <div className="flex size-11 place-content-center rounded-full bg-gray-400 active:bg-gray-500">
          <Image
            src={aflBall}
            width={30}
            height={30}
            alt="AFL ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link href={`/sports/${SPORT.NFL}/matches`}>
        <div className="flex size-11 place-content-center rounded-full bg-gray-400 active:bg-gray-500">
          <Image
            src={nflBall}
            width={30}
            height={30}
            alt="NFL ball"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link href={`/sports/${SPORT.F1}#currentDate`}>
        <div className="flex size-11 place-content-center rounded-full bg-gray-400 active:bg-gray-500">
          <Image
            src={f1Helmet}
            width={30}
            height={30}
            alt="F1 Helmet"
            className="text-center"
          ></Image>
        </div>
      </Link>
      <Link href={`/sports/${SPORT.GOLF}`}>
        <div className="flex size-11 place-content-center rounded-full bg-gray-400 active:bg-gray-500">
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
