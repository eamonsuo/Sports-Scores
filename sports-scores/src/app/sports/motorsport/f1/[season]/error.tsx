"use client";

import ErrorPage from "@/components/misc-ui/ErrorPage";

// Error boundaries must be Client Components

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <ErrorPage />;
}
