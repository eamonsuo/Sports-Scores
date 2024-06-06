import Image from "next/image";
import aflBall from "@/../public/noun-football-683692.svg"

export default async function Page() {
    return(<p><Image src={aflBall} width={30} height={30} alt="AFL ball" className="text-center"></Image><div>Icons made from <a href="https://www.onlinewebfonts.com/icon">svg icons</a>is licensed by CC BY 4.0</div></p>)
}