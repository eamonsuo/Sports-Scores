import { cookies } from "next/headers";

export async function getClientDate(): Promise<Date> {
  const cookieStore = await cookies();
  const clientDateStr = cookieStore.get("clientDate")?.value;
  return clientDateStr ? new Date(clientDateStr) : new Date();
}

export async function getClientTimezone(): Promise<string> {
  const cookieStore = await cookies();
  const tz = cookieStore.get("clientTimezone")?.value;
  return tz ? decodeURIComponent(tz) : "UTC";
}
