"use server";

import db from "@/db";
import { contestProblems, contests, memberships, problems } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import axios from "axios";

type ProblemInput = {
  problemId: string;
  position: string;
};

type CreateContestInput = {
  userId: string;
  orgId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  problems: ProblemInput[];
};

async function ensureProblemsExist(problemsToEnsure: ProblemInput[]) {
  try {
    const ids = problemsToEnsure.map((p) => p.problemId);
    if (ids.length === 0) return;

    // Check which ones already exist locally
    const existing = await db
      .select({ id: problems.id })
      .from(problems)
      .where(inArray(problems.id, ids));

    const existingIds = new Set(existing.map((e) => e.id));
    const missingIds = ids.filter((id) => !existingIds.has(id));

    if (missingIds.length === 0) return;

    // Fetch problems from Codeforces
    const response = await axios.get("https://codeforces.com/api/problemset.problems");
    if (response.data?.status !== "OK") {
      throw new Error("Codeforces API failed to respond OK");
    }

    const cfProblems = response.data.result.problems;
    const insertValues = [];

    for (const problemId of missingIds) {
      const index = problemId.slice(-1).toUpperCase();
      const contestIdStr = problemId.slice(0, -1);
      const contestId = parseInt(contestIdStr);

      if (isNaN(contestId)) {
        // Fallback for weird IDs
        insertValues.push({
          id: problemId,
          contestId: 0,
          index: index || "A",
          name: `Problem ${problemId}`,
          type: "PROGRAMMING",
          tags: [],
        });
        continue;
      }

      const cfMatch = cfProblems.find(
        (p: any) => p.contestId === contestId && p.index === index
      );

      if (cfMatch) {
        insertValues.push({
          id: problemId,
          contestId: cfMatch.contestId,
          index: cfMatch.index,
          name: cfMatch.name,
          type: cfMatch.type || "PROGRAMMING",
          points: cfMatch.points || null,
          rating: cfMatch.rating || null,
          tags: cfMatch.tags || [],
        });
      } else {
        // Fallback placeholder
        insertValues.push({
          id: problemId,
          contestId,
          index,
          name: `Problem ${problemId}`,
          type: "PROGRAMMING",
          tags: [],
        });
      }
    }

    if (insertValues.length > 0) {
      await db.insert(problems).values(insertValues);
    }
  } catch (error) {
    console.error("Error ensuring problems exist:", error);
  }
}

export async function createContest({
  userId,
  orgId,
  title,
  description,
  startTime,
  endTime,
  problems: inputProblems,
}: CreateContestInput) {
  try {
    const membership = await db.query.memberships.findFirst({
      where: and(eq(memberships.userId, userId), eq(memberships.orgId, orgId)),
    });

    if (!membership) {
      throw new Error("Not a member of organization");
    }

    if (membership.role !== "leader" && membership.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // validate times
    if (startTime >= endTime) {
      throw new Error("Invalid contest timing");
    }

    // Ensure all problems are registered in the problems table
    await ensureProblemsExist(inputProblems);

    // create contest
    const [contest] = await db
      .insert(contests)
      .values({
        organizationId: orgId,
        title,
        description,
        startTime,
        endTime,
        createdBy: userId,
      })
      .returning();

    // insert contest problems
    await db.insert(contestProblems).values(
      inputProblems.map((p) => ({
        contestId: contest.id,
        problemId: p.problemId,
        position: p.position.toUpperCase(),
      }))
    );

    return {
      success: true,
      contest,
    };
  } catch (error) {
    console.error("Error creating contest:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create contest",
    };
  }
}
