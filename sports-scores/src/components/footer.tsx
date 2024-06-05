import Link from "next/link";
import Image from "next/image";

import cricketBall from "../../public/cricket-ball-icon.svg"

export default function Footer() {
    return (
    <div className="bg-gray-200 flex flex-row h-[8vh] p-1 gap-2 overflow-auto border-t">
        <Link href="/sports/cricket">
            <div className="size-11 rounded-full bg-gray-500 flex place-content-center">
                <Image src={cricketBall} width={30} height={30} alt="cricket ball" className="text-center"></Image>
            </div>
        </Link>
        <Link href="/sports/afl">
            <div className="size-11 rounded-full bg-gray-500 flex place-content-center">
                <Image src={cricketBall} width={30} height={30} alt="cricket ball" className="text-center"></Image>
            </div>
        </Link>
    </div>);
}