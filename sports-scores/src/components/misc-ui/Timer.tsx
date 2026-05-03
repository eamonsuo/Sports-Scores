import { cn } from "@/lib/utils";

export default function Timer({
  display,
  displayColour,
}: {
  display: string;
  displayColour?: string;}) {
    return <p
                    suppressHydrationWarning
                    className={cn(
                      "whitespace-nowrap rounded-sm px-2 py-1 text-center text-xs",
    
                      displayColour === "green" &&
                        "bg-green-500 text-neutral-200 dark:bg-green-700",
                      displayColour === "yellow" &&
                        "bg-yellow-500 text-black dark:bg-yellow-600",
                      displayColour === "gray" &&
                        "bg-gray-200 text-gray-700 dark:bg-neutral-700 dark:text-neutral-400",
                    )}
                  >
                    {display}
                  </p>
  }