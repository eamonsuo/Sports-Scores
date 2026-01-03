"use client";
import { Button } from "@/components/misc/Button";
import Footer from "@/components/misc/Footer";
import Placeholder from "@/components/misc/Placeholder";
import { Inter } from "next/font/google";
import Link from "next/link";

// Error boundaries must be Client Components
const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html className="dark">
      <body className={inter.className}>
        <div className="flex min-h-dvh w-dvw flex-col">
          {/* <Header></Header> */}
          <main className="flex-1 items-center overflow-y-auto bg-neutral-950">
            <Placeholder>Something went wrong!</Placeholder>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
