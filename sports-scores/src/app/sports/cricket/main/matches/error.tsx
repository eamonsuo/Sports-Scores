"use client"; // Error boundaries must be Client Components

import ErrorPage from "@/components/misc-ui/ErrorPage";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return <ErrorPage />;
}
