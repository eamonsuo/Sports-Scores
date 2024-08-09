import { cricinfoSeriesScraper } from "@/lib/scraper";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

export default async function Page() {
  const scrape = await cricinfoSeriesScraper();

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {scrape.map((item) => (
        <div className="mt-4" key={item.title}>
          {item.title}
          {item.items.map((item) => (
            <React.Fragment key={item.series.id}>
              <Link
                href=""
                className="mt-4 flex rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700"
              >
                <div className="me-2 content-center">
                  {item.images.length > 0 && (
                    <Image
                      src={getImageUrl(item.images[0].url)}
                      width={20}
                      height={20}
                      alt="Series logo"
                    ></Image>
                  )}
                  {item.images.length === 2 && (
                    <Image
                      src={getImageUrl(item.images[1].url)}
                      width={20}
                      height={20}
                      alt="Series logo"
                    ></Image>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="dark:text-neutral-400">
                    {item.series.longName}
                  </p>
                  <p className="text-xs">
                    {new Date(item.series.startDate).toDateString()} -{" "}
                    {new Date(item.series.endDate).toDateString()}
                  </p>
                </div>
                <p className="content-center justify-self-end">{">"}</p>
              </Link>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
