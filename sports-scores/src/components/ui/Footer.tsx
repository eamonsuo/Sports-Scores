import Link from "next/link";
import Image from "next/image";

import cricketBall from "@/../public/cricket-ball-icon.svg";
import aflBall from "@/../public/football.svg";

export default function Footer() {
  return (
    <footer className="flex h-16 w-full flex-row place-items-center gap-2 overflow-auto border-t bg-gray-200 p-1">
      <Link href="/sports/cricket">
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
      <Link href="/sports/afl#current-date">
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
    </footer>
  );
}
