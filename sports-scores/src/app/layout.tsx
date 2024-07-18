import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/misc/Header";
import Footer from "@/components/misc/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sports Scores App",
  description: "An app to track scores for all your sports",
  icons: "favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      {/* Dark mode enabled */}
      <body className={inter.className}>
        {/* Set to Dynamic view height aka height of browser minus any browser things. Helps on
         mobile where safari search overhangs regular view height*/}
        <div className="flex h-dvh w-dvw flex-col">
          <Header></Header>
          <main className="flex-1 items-center overflow-y-auto bg-white dark:bg-neutral-950">
            {children}
          </main>
          <Footer></Footer>
        </div>
      </body>
    </html>
  );
}
