import Link from "next/link"
import { Button } from "../shadcn/button"
import Placeholder from "./Placeholder"

export default function NoData({ href }: { href?: string }) {
  return (
    <>
      <Placeholder>NO DATA</Placeholder>
      <Link href={href ?? ""} className="mb-6 flex justify-center rounded">
        <Button variant={"secondary"}>Link to Web Scores</Button>
      </Link>
    </>
  )
}
