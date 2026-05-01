import db from "@/db";
import { problems } from "@/db/schema";
import { fetchProblems } from "@/helper";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Fetching problems from Codeforces...");
    const problemsList = await fetchProblems();
    console.log(`Found ${problemsList.length} problems.`);
    for (const p of problemsList) {
      if (!p.rating) continue;

      const id = `${p.contestId}${p.index}`;

      await db
        .insert(problems)
        .values({
          id,
          contestId: p.contestId,
          index: p.index,
          name: p.name,
          rating: p.rating,
          tags: p.tags,
        })
        .onConflictDoNothing();
    }
    console.log("Problems saved to db");
  } catch (error) {
    console.error("Error saving problem:", error);
    return NextResponse.json(
      { error: "Failed to save problem" },
      { status: 500 },
    );
  }
}
