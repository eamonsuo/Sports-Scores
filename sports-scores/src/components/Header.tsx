"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import backArrow from "@/../public/back-arrow-icon.svg";
import menu from "@/../public/three-horizontal-lines-icon.svg";

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gray-200 h-16 w-full flex justify-between border-b">
      <button className="ps-2" onClick={() => router.back()}>
        <Image src={backArrow} width={30} height={30} alt="back arrow"></Image>
      </button>
      <button className="pe-2 ">
        <Image src={menu} width={30} height={30} alt="menu"></Image>
      </button>
    </header>
  );
}
