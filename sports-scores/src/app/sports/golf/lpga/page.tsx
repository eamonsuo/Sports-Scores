import { redirect } from "next/navigation";

export default async function Page() {
  redirect("https://www.google.com/search?igu=1&gws_rd=ssl&q=lpga");
}
