"use client";

import { useRouter } from "next/navigation";

// Error boundaries must be Client Components

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="h-full w-full px-4 pt-8 text-center">
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => useRouter().refresh()
        }
      >
        Try again
      </button>
    </div>
  );
}
