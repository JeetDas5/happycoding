import { fetchProblems, getUserSubmissions } from "@/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { handle } = await req.json();

    if (!handle) {
      return NextResponse.json(
        { error: "Handle is required" },
        { status: 400 },
      );
    }

    const submissions = await getUserSubmissions(handle, 5);
    return NextResponse.json({ submissions });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function GET() {
  try {
    const problems = await fetchProblems();
    return NextResponse.json({ problems });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
