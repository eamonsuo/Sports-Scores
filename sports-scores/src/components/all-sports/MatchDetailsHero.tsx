import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export default function MatchDetailsHero({
  homeInfo,
  awayInfo,
  status,
}: {
  homeInfo: { img?: string | string[]; name: string; score: string | string[] };
  awayInfo: { img?: string | string[]; name: string; score: string | string[] };
  status: string;
}) {
  const homeImg = Array.isArray(homeInfo.img) ? homeInfo.img[0] : homeInfo.img;
  const awayImg = Array.isArray(awayInfo.img) ? awayInfo.img[0] : awayInfo.img;

  return (
    <div className="m-4 grid grid-cols-3 gap-2">
      <div className="content-center justify-self-center">
        {Array.isArray(homeInfo.img) ? (
          <div className="flex -space-x-3">
            {homeInfo.img.map((img, idx) => (
              <Image
                key={idx}
                src={img || fallback}
                width={60}
                height={60}
                alt={`Home team player ${idx + 1}`}
                className="rounded-full border-2 border-white dark:border-neutral-800"
              />
            ))}
          </div>
        ) : (
          <Image
            src={homeImg || fallback}
            width={60}
            height={60}
            alt="Home team image"
          />
        )}
      </div>
      <div></div>

      <div className="content-center justify-self-center">
        {Array.isArray(awayInfo.img) ? (
          <div className="flex -space-x-3">
            {awayInfo.img.map((img, idx) => (
              <Image
                key={idx}
                src={img || fallback}
                width={60}
                height={60}
                alt={`Away team player ${idx + 1}`}
                className="rounded-full border-2 border-white dark:border-neutral-800"
              />
            ))}
          </div>
        ) : (
          <Image
            src={awayImg || fallback}
            width={60}
            height={60}
            alt="Away team image"
          />
        )}
      </div>

      <p className="content-center text-center text-gray-700 dark:text-neutral-500">
        {homeInfo.name}
      </p>
      <div className="content-center text-center dark:text-neutral-400">
        {status}
      </div>
      <p className="content-center text-center text-gray-700 dark:text-neutral-500">
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
