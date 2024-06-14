import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="en">
      <body className={inter.className}>
        {/* Set to Dynamic view height aka height of browser minus any browser things. Helps on
         mobile where safari search overhangs regular view height*/}
        <div className="flex flex-col h-dvh">
          <Header></Header>
          <main className="items-center flex-1 overflow-y-auto bg-white">
            {children}
          </main>
          <Footer></Footer>
        </div>
      </body>
    </html>
  );
}
