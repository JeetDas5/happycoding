"use server";

import db from "@/db";
import { contestParticipants, contests, memberships } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type JoinContestInput = {
  userId: string;
  contestId: string;
};

export async function joinContest({ userId, contestId }: JoinContestInput) {
  try {
    const contest = await db.query.contests.findFirst({
      where: eq(contests.id, contestId),
    });

    if (!contest) {
      throw new Error("Contest not found");
    }

    // check org membership
    const membership = await db.query.memberships.findFirst({
      where: and(
        eq(memberships.userId, userId),
        eq(memberships.orgId, contest.organizationId)
      ),
    });

    if (!membership) {
      throw new Error("Not organization member");
    }

    // prevent duplicate join
    const existing = await db.query.contestParticipants.findFirst({
      where: and(
        eq(contestParticipants.userId, userId),
        eq(contestParticipants.contestId, contestId)
      ),
    });

    if (existing) {
      return {
        success: true,
        message: "Already joined",
      };
    }

    // join
    await db.insert(contestParticipants).values({
      contestId,
      userId,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error joining contest:", error);

    return {
      success: false,
      error: "Failed to join contest",
    };
  }
}
