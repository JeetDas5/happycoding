import { startCFVerification } from "@/actions/codeforces.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, handle } = await req.json();
  if (!userId || !handle) {
    return NextResponse.json(
      { success: false, message: "Missing userId or handle" },
      { status: 400 },
    );
  }
  try {
    const result = await startCFVerification(userId, handle);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error starting CF verification:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
