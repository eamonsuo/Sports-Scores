"use client"
import { Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import { FOOTER_LINKS } from "@/lib/constants"
import { useOrderPreference } from "@/lib/orderPreferences"
import { cn } from "@/lib/shadcnUtils"
import { FOOTER_ORDER_STORAGE_KEY } from "@/lib/storageKeys"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar"
import CustomizeOrderDialog from "./CustomizeOrderDialog"

const footerLinks = FOOTER_LINKS

const defaultFooterOrder = footerLinks.map((item) => item.sport)
const footerLinksBySport = new Map(
  footerLinks.map((item) => [item.sport, item]),
)

export default function Footer() {
  const pathname = usePathname()
  const { order, hidden, reorder, toggleHidden, reset } = useOrderPreference(
    FOOTER_ORDER_STORAGE_KEY,
    defaultFooterOrder,
  )

  const visibleLinks = useMemo(
    () =>
      order
        .map((sport) => footerLinksBySport.get(sport))
        .filter(
          (item): item is (typeof footerLinks)[number] =>
            !!item && !hidden.includes(item.sport),
        ),
    [order, hidden],
  )

  const isActive = (link: string) => {
    if (link === "/") return pathname === "/"
    if (link.startsWith("http")) return false
    return pathname.startsWith(link.split("/").slice(0, 3).join("/"))
  }

  return (
    <footer className="bg-gray-200 dark:bg-neutral-900">
      <div className="hideScroll flex h-16 w-full flex-row place-items-center gap-2 overflow-auto p-2">
        {visibleLinks.map((item) => (
          <Link key={item.sport} href={item.link}>
            <Avatar
              className={cn(
                "size-11 p-1.5",
                isActive(item.link)
                  ? "bg-gray-500 dark:bg-neutral-400"
                  : "bg-gray-400 dark:bg-neutral-600",
              )}
            >
              <AvatarImage src={item.img} alt={item.sport} />
              <AvatarFallback>
                <Image
                  src={"/vercel.svg"}
                  width={60}
                  height={20}
                  style={{ width: "30px", height: "auto" }}
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
          </Link>
        ))}
        <CustomizeOrderDialog
          title="Customize Footer"
          trigger={
            <button
              type="button"
              aria-label="Customize footer"
              className="flex shrink-0 items-center justify-center"
            >
              <Avatar className="size-11 bg-gray-400 p-1.5 dark:bg-neutral-600">
                <AvatarFallback className="bg-transparent">
                  <Settings className="size-6 text-black" />
                </AvatarFallback>
              </Avatar>
            </button>
          }
          items={footerLinks.map((item) => ({
            id: item.sport,
            altText: item.altText,
            img: item.img,
          }))}
          order={order}
          hidden={hidden}
          onReorder={reorder}
          onToggleHidden={toggleHidden}
          onReset={reset}
        />
      </div>
      <div className="h-6 dark:bg-neutral-900">
        <hr></hr>
      </div>
    </footer>
  )
}
