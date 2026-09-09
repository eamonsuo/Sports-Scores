import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import ClientDateSetter from "@/components/misc-ui/ClientDateSetter"
import Footer from "@/components/misc-ui/Footer"
import { APPLE_SPLASH_IMAGES } from "@/lib/appleSplashScreens"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sports Scores App",
  description: "An app to track scores for all your sports",
  appleWebApp: {
    capable: true,
    title: "Sports Scores",
    statusBarStyle: "black",
    startupImage: APPLE_SPLASH_IMAGES.map(({ url, media }) => ({ url, media })),
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Dark mode enabled.
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientDateSetter />
        {/* Set to Dynamic view height aka height of browser minus any browser things. Helps on
         mobile where safari search overhangs regular view height*/}
        <div className="flex h-dvh w-dvw flex-col">
          <main className="flex-1 items-center overflow-y-auto bg-white dark:bg-neutral-950">
            {children}
          </main>
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
