"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import backArrow from "@/../public/back-arrow-icon.svg";
import menu from "@/../public/three-horizontal-lines-icon.svg";
import refresh from "@/../public/refresh-svgrepo-com.svg";

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex h-16 w-full justify-between border-b bg-gray-200">
      <button className="ps-2" onClick={() => router.back()}>
        <Image src={backArrow} width={30} height={30} alt="back arrow"></Image>
      </button>
      <button className="pe-2" onClick={() => router.refresh()}>
        <Image src={refresh} width={40} height={40} alt="menu"></Image>
      </button>
    </header>
  );
}
