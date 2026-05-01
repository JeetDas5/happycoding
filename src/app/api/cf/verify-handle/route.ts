import { verifyCF } from "@/actions/codeforces.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Missing userId" },
      { status: 400 },
    );
  }
  try {
    const result = await verifyCF(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error starting CF verification:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
