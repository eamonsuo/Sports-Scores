import Link from "next/link";
import { Button } from "./Button";

export default function ErrorPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center overflow-y-auto bg-neutral-950">
      <p className="mb-4 px-4 pt-8 text-center">Something went wrong!</p>
      <Link href="/">
        <Button className="text-gray-50">Go Home</Button>
      </Link>
    </div>
  );
}
