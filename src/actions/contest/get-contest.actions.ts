/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/db";
import { contestProblems, contests, problems } from "@/db/schema";

import { eq } from "drizzle-orm";

export async function getContest(contestId: string) {
  try {
    const contest = await db.query.contests.findFirst({
      where: eq(contests.id, contestId),
    });

    if (!contest) {
      throw new Error("Contest not found");
    }

    const now = new Date();

    const hasStarted = now >= contest.startTime;

    let contestProblemList: any[] = [];

    // only show problems after start
    if (hasStarted) {
      contestProblemList = await db
        .select({
          id: problems.id,
          name: problems.name,
          rating: problems.rating,
          tags: problems.tags,

          position: contestProblems.position,

          contestId: problems.contestId,
          index: problems.index,
        })
        .from(contestProblems)
        .innerJoin(problems, eq(problems.id, contestProblems.problemId))
        .where(eq(contestProblems.contestId, contestId));
    }

    return {
      success: true,
      contest,
      problems: contestProblemList.map((p) => ({
        ...p,
        url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
      })),
    };
  } catch (error) {
    console.error("Error fetching contest:", error);

    return {
      success: false,
      error: "Failed to fetch contest",
    };
  }
}
