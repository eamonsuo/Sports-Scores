"use client";

import Link from "next/link";
import { Button } from "./Button";

export default function ErrorPage({ externalUrl }: { externalUrl?: string }) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center overflow-y-auto bg-neutral-950">
      <p className="mb-4 px-4 pt-8 text-center">Something went wrong!</p>
      <Button onClick={handleReload} className="m-2 text-gray-50">
        Reload Page
      </Button>
      <Link href="/" className="m-2">
        <Button className="text-gray-50">Go Home</Button>
      </Link>
      {externalUrl && (
        <Link href={externalUrl} className="m-2">
          <Button className="text-gray-50">Go to Internet</Button>
        </Link>
      )}
    </div>
  );
}
