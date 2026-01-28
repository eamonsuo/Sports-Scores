"use client";
import ErrorPage from "@/components/misc-ui/ErrorPage";
import Footer from "@/components/misc-ui/Footer";
import { Inter } from "next/font/google";

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
            <ErrorPage />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
