
import Link from "next/link";

export default function NavButtonGroup({matchDetails, homeDetails, awayDetails}: any) {
    // console.log(matchDetails);
    return (<div className="flex justify-center">
        <div className="bg-gray-500">
        <Link href="/misc/coming">
            bbbbbbbber
        </Link>
        </div>
        <div className="bg-gray-500">
        <Link href="/misc/coming">
            bbbbbbbb
        </Link>
        </div>
    </div>);
}
