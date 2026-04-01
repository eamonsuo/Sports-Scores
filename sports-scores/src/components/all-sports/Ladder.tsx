import fallback from "@/../public/vercel.svg";
import { clsx } from "clsx";
import Image from "next/image";

const defaultColours = [
  "bg-green-500",
  "bg-green-300",
  "bg-blue-500",
  "bg-blue-300",
  "bg-yellow-500",
  "bg-yellow-300",
];

type TeamInfo = {
  team: {
    id: string | number;
    name: string;
    logo?: string;
  };
  position: number;
};

export type LadderPlacingCategory = {
  position: number[];
  label: string;
  colour?: string;
};

export interface SportsLadder<H extends readonly string[]> {
  tableName?: string;
  headings: H;
  data: (Record<H[number], string | number | undefined> & TeamInfo)[]; // Team data + each value related to a specified heading
  placingCategories: LadderPlacingCategory[];
}

export default function Ladder<const H extends readonly string[]>({
  tableName,
  headings,
  data,
  placingCategories,
}: SportsLadder<H>) {
  return (
    <div>
      <p className="pb-1 pt-3 dark:text-neutral-400">{tableName}</p>

      <table className="w-full dark:text-neutral-400">
        <thead>
          <tr>
            <th></th>
            <th className="pe-2"></th>
            <th className="px-2">Team</th>
            {headings.map((heading) => (
              <th key={heading} className="px-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item, idx) => {
            // Get the colour for this placing if specified
            const categoryIdx = placingCategories.findIndex((c) =>
              c.position.includes(item.position),
            );
            const category =
              categoryIdx >= 0 ? placingCategories[categoryIdx] : undefined;
            const colour =
              category?.colour ??
              (categoryIdx >= 0
                ? defaultColours[categoryIdx % defaultColours.length]
                : undefined);
            return (
              <tr key={item.team.id} className="border-b border-t">
                <td className={clsx("w-1 p-0", colour)} />
                <td className="py-2 pe-2 ps-1">{item.position}</td>
                <td className="text-left text-sm">
                  <div className="flex">
                    <Image
                      src={item.team.logo ?? fallback}
                      height={10}
                      width={15}
                      alt={"Logo"}
                      className="me-2"
                    />
                    {item.team.name}
                  </div>
                </td>

                {headings.map((heading) => (
                  <td key={heading}>{item[heading as H[number]]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Display placing category labels */}
      {placingCategories.length > 0 && (
        <div className="my-4 flex flex-col flex-wrap gap-4 text-sm">
          {placingCategories.map((category, idx) => (
            <div key={category.label} className="flex items-center gap-2">
              <span
                className={clsx(
                  "inline-block h-3 w-3 rounded-full",
                  category.colour ??
                    defaultColours[idx % defaultColours.length],
                )}
              />
              <span>{category.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
