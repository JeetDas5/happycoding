"use server";

import db from "@/db";
import { contestParticipants, users } from "@/db/schema";

import { eq, desc, asc } from "drizzle-orm";

export async function getContestLeaderboard(contestId: string) {
  try {
    const leaderboard = await db
      .select({
        userId: users.id,
        name: users.name,

        score: contestParticipants.score,
        penalty: contestParticipants.penalty,
      })
      .from(contestParticipants)
      .innerJoin(users, eq(users.id, contestParticipants.userId))
      .where(eq(contestParticipants.contestId, contestId))
      .orderBy(
        desc(contestParticipants.score),
        asc(contestParticipants.penalty)
      );

    return {
      success: true,
      leaderboard: leaderboard.map((u, index) => ({
        rank: index + 1,
        ...u,
      })),
    };
  } catch (error) {
    console.error("[LEADERBOARD_ERROR]", error);

    return {
      success: false,
      error: "Failed to fetch leaderboard",
    };
  }
}
