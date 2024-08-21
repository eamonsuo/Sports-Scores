import { cricinfoAllSeriesScraper } from "@/lib/scraper";
import { getCricketImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const scrape = await cricinfoAllSeriesScraper();

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {scrape.map((item) => (
        <div className="mt-4" key={item.title}>
          {item.title}
          {item.items.map((series) => (
            <React.Fragment key={series.series.id}>
              <Link
                href={`/sports/cricket/series/${series.series.slug}-${series.series.objectId}/matches#current-date`}
                className="mt-4 flex rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700"
              >
                <div className="me-2 content-center">
                  {series.images.length > 0 && (
                    <Image
                      src={getCricketImageUrl(series.images[0].url)}
                      width={20}
                      height={20}
                      alt="Series logo"
                    ></Image>
                  )}
                  {series.images.length === 2 && (
                    <Image
                      src={getCricketImageUrl(series.images[1].url)}
                      width={20}
                      height={20}
                      alt="Series logo"
                    ></Image>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="dark:text-neutral-400">
                    {series.series.longName}
                  </p>
                  <p className="text-xs">
                    {new Date(series.series.startDate).toDateString()} -{" "}
                    {new Date(series.series.endDate).toDateString()}
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
