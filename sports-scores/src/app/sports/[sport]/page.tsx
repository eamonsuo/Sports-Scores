import { redirect } from "next/navigation"

export default async function Page(props: {
  params: Promise<{ sport: string }>
}) {
  const { sport } = await props.params

  redirect(`/sports/${sport}/today`)
}
