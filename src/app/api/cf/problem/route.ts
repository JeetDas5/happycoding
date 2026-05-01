import { getProblem } from "@/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { problemId } = await req.json();
    if (!problemId) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 },
      );
    }
    const problem = await getProblem(problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    return NextResponse.json({ problem });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
