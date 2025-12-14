import { fetchCricketMatchesByDate } from "@/endpoints/cricket.api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date } = await params;

  try {
    const data = await fetchCricketMatchesByDate(date);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cricket matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}
