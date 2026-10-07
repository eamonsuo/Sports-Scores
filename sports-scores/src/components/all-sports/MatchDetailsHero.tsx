import { FALLBACK_IMAGE } from "@/lib/constants"
import { cn } from "cn"

import Image from "next/image"
import Link from "next/link"

export default function MatchDetailsHero({
  homeInfo,
  awayInfo,
  status,
  summaryText,
  winner,
}: {
  homeInfo: {
    name: string
    score: string | string[]
    img?: string | string[]
    slug?: string
  }
  awayInfo: {
    name: string
    score: string | string[]
    img?: string | string[]
    slug?: string
  }
  status: string
  summaryText?: string
  winner?: number
}) {
  const homeImg = Array.isArray(homeInfo.img) ? homeInfo.img[0] : homeInfo.img
  const awayImg = Array.isArray(awayInfo.img) ? awayInfo.img[0] : awayInfo.img

  return (
    <>
      {summaryText && (
        <p className="my-2 text-center text-lg text-neutral-400">
          {summaryText}
        </p>
      )}
      <div className="m-4 grid grid-cols-3 gap-2">
        <Link
          className="content-center justify-self-center"
          href={homeInfo?.slug ?? "#"}
        >
          {Array.isArray(homeInfo.img) ? (
            <div className="flex -space-x-3">
              {homeInfo.img.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  width={150}
                  height={150}
                  style={{ width: "60px", height: "auto" }}
                  alt={`Home team player ${idx + 1}`}
                  className="rounded-full border-2 border-white dark:border-neutral-800"
                />
              ))}
            </div>
          ) : (
            <Image
              src={homeImg || FALLBACK_IMAGE}
              width={150}
              height={150}
              style={{ width: "60px", height: "auto" }}
              alt="Home team image"
            />
          )}
        </Link>
        <div></div>

        <Link
          className="content-center justify-self-center"
          href={awayInfo?.slug ?? "#"}
        >
          {Array.isArray(awayInfo.img) ? (
            <div className="flex -space-x-3">
              {awayInfo.img.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  width={150}
                  height={150}
                  style={{ width: "60px", height: "auto" }}
                  alt={`Away team player ${idx + 1}`}
                  className="rounded-full border-2 border-white dark:border-neutral-800"
                />
              ))}
            </div>
          ) : (
            <Image
              src={awayImg || FALLBACK_IMAGE}
              width={150}
              height={150}
              style={{ width: "60px", height: "auto" }}
              alt="Away team image"
            />
          )}
        </Link>

        <Link
          href={homeInfo?.slug ?? "#"}
          className={cn(
            "content-center text-center text-gray-700 dark:text-neutral-500",
            winner !== undefined && winner === 1 && "font-bold",
          )}
        >
          {homeInfo.name}
        </Link>
        <div className="content-center text-center dark:text-neutral-400">
          {status}
        </div>
        <Link
          href={awayInfo?.slug ?? "#"}
          className={cn(
            "content-center text-center text-gray-700 dark:text-neutral-500",
            winner !== undefined && winner !== 1 && "font-bold",
          )}
        >
          {awayInfo.name}
        </Link>
        <p
          className={cn(
            "content-center text-center text-2xl dark:text-neutral-400",
            winner !== undefined && winner === 1 && "font-bold",
          )}
        >
          {Array.isArray(homeInfo?.score) && homeInfo.score.length > 1 ? (
            <>
              {homeInfo?.score[0]}
              <span className="text-base font-normal">
                {" "}
                {homeInfo?.score[1]}
              </span>
            </>
          ) : (
            <>{homeInfo?.score}</>
          )}
        </p>
        <div></div>
        <p
          className={cn(
            "content-center text-center text-2xl dark:text-neutral-400",
            winner !== undefined && winner !== 1 && "font-bold",
          )}
        >
          {Array.isArray(awayInfo?.score) && awayInfo.score.length > 1 ? (
            <>
              {awayInfo?.score[0]}
              <span className="text-base font-normal">
                {" "}
                {awayInfo?.score[1]}
              </span>
            </>
          ) : (
            <>{awayInfo?.score}</>
          )}
        </p>
      </div>
    </>
  )
}
