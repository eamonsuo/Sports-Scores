import { cookies } from "next/headers";

export async function getClientDate(): Promise<Date> {
  const cookieStore = await cookies();
  const clientDateStr = cookieStore.get("clientDate")?.value;
  return clientDateStr ? new Date(clientDateStr) : new Date();
}
