"use client"; // Error boundaries must be Client Components

import ErrorPage from "@/components/misc-ui/ErrorPage";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <ErrorPage externalUrl="https://www.google.com/search?q=f1" />;
}
