
import Link from "next/link";

export default function NavButtonGroup({buttons}: {buttons: NavButtonGroupProps}) {
    return (<div className="flex m-4">
        {buttons.map((item) => 
            <div key={item.label} className={`bg-gray-500 text-center p-2 border-2 flex-1`}>
                <Link href={item.link}>
                    {item.label}
                </Link>
            </div>)
        }
    </div>);
}
