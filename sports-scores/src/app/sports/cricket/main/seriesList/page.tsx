import Placeholder from "@/components/misc/Placeholder";
import { cricketAllSeries } from "@/services/cricket.service";
import Link from "next/link";

export default async function Page() {
  const rawSeries = await cricketAllSeries();

  if (rawSeries === null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  //Update to make generic

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {rawSeries.Stages.map((item) => (
        <div className="mt-4" key={item.Sid}>
          <Link
            href={`/sports/cricket/series/${item.Ccd}/${item.Scd}/matches`}
            className="mt-4 flex rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700"
          >
            <div className="me-2 content-center">
              {/* {item.seriesImages.length > 0 && (
                <Image
                  src={item.seriesImages[0]}
                  width={20}
                  height={20}
                  alt="Series logo"
                ></Image>
              )}
              {item.seriesImages.length === 2 && (
                <Image
                  src={item.seriesImages[1]}
                  width={20}
                  height={20}
                  alt="Series logo"
                ></Image>
              )} */}
            </div>
            <div className="flex flex-1 flex-col">
              <p className="dark:text-neutral-400">{item.Snm}</p>
              <p className="text-xs">
                {""} - {""}
              </p>
            </div>
            <p className="content-center justify-self-end">{">"}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
