import spinner from "@/../public/spinner.gif";
import Image from "next/image";

export default function Spinner() {
  return (
    <div>
      <Image src={spinner} width={200} alt="Loading..." />
    </div>
  );
}
