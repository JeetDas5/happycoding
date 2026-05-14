"use server";

import db from "@/db";
import { contestProblems, contests, memberships } from "@/db/schema";
import { and, eq } from "drizzle-orm";

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

export async function createContest({
  userId,
  orgId,
  title,
  description,
  startTime,
  endTime,
  problems,
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
      problems.map((p) => ({
        contestId: contest.id,
        problemId: p.problemId,
        position: p.position,
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
      error: "Failed to create contest",
    };
  }
}
