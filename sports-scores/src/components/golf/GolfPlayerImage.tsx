import { getGolfImageUrl } from "@/lib/projUtils";
import Image from "next/image";

export default function GolfPlayerImage({ country }: { country: string }) {
  var url = getGolfImageUrl(country);

  if (url === null || url === undefined) {
    return country;
  }

  return (
    <div className="flex items-center justify-center">
      <Image src={url} height={25} width={25} alt={`${country} Flag`} />
    </div>
  );
}
