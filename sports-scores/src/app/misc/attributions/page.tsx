import Image from "next/image";

export default function Page() {
  return (
    <>
      <p>
        <Image
          src={"/afl-ball.svg"}
          width={30}
          height={30}
          alt="AFL ball"
          className="text-center"
        ></Image>
        Icons made from{" "}
        <a href="https://www.onlinewebfonts.com/icon">svg icons</a>is licensed
        by CC BY 4.0
      </p>
      <p>
        <Image
          src={"/abc-news-logo.svg"}
          width={30}
          height={30}
          alt="ABC Logo"
          className="text-center"
        ></Image>
        <a href="https://commons.wikimedia.org/wiki/File:Australian_Broadcasting_Corporation_logo_(1974-).svg">
          Australian Broadcasting Corporation
        </a>
        , Public domain, via Wikimedia Commons
      </p>
    </>
  );
}
