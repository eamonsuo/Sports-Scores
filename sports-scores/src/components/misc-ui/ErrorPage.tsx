"use client"

import Link from "next/link"
import { Button } from "../shadcn/button"

export default function ErrorPage({ externalUrl }: { externalUrl?: string }) {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center overflow-y-auto bg-neutral-950">
      <p className="mb-4 px-4 pt-8 text-center">Something went wrong!</p>
      <Button onClick={handleReload} className="m-2" variant="secondary">
        Reload Page
      </Button>
      <Link href="/" className="m-2">
        <Button variant="secondary">Go Home</Button>
      </Link>
      {externalUrl && (
        <Link href={externalUrl} className="m-2">
          <Button variant="secondary">Go to Internet</Button>
        </Link>
      )}
    </div>
  )
}
