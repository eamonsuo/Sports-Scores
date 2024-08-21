import Image from "next/image";

export default function MatchDetailsHero({
  homeInfo,
  awayInfo,
  status,
}: {
  homeInfo: { img: string; name: string; score: string };
  awayInfo: { img: string; name: string; score: string };
  status: string;
}) {
  return (
    <div className="m-4 grid grid-cols-3 gap-2">
      <div className="content-center justify-self-center">
        <Image
          src={homeInfo.img}
          width={60}
          height={60}
          alt="Home team image"
        />
      </div>
      <div></div>

      <div className="content-center justify-self-center">
        <Image
          src={awayInfo.img}
          width={60}
          height={60}
          alt="Away team image"
        />
      </div>

      <p className="text-center text-gray-700 dark:text-neutral-500">
        {homeInfo.name}
      </p>
      <div className="text-center dark:text-neutral-400">{status}</div>
      <p className="text-center text-gray-700 dark:text-neutral-500">
        {awayInfo.name}
      </p>
      <p className="content-center text-center text-2xl dark:text-neutral-400">
        {homeInfo.score}
      </p>
      <div></div>
      <p className="content-center text-center text-2xl dark:text-neutral-400">
        {awayInfo.score}
      </p>
    </div>
  );
}
