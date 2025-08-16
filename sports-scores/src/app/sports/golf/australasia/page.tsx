import { redirect } from "next/navigation";

export default async function Page() {
  redirect("https://pga.org.au/report/?tourn=auto&class=aus");
}
