"use server";

import db from "@/db";
import {
  contestProblems,
  contests,
  problems,
  memberships,
  contestParticipants,
  contestSubmissions,
  users,
} from "@/db/schema";

import { eq, inArray, desc } from "drizzle-orm";

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

export async function getUserContests(userId: string) {
  try {
    const userOrgs = await db.query.memberships.findMany({
      where: eq(memberships.userId, userId),
    });

    if (userOrgs.length === 0) {
      return { success: true, contests: [] };
    }

    const orgIds = userOrgs.map((o) => o.orgId);

    const contestList = await db.query.contests.findMany({
      where: inArray(contests.organizationId, orgIds),
      orderBy: [desc(contests.startTime)],
    });

    const userParticipations = await db.query.contestParticipants.findMany({
      where: eq(contestParticipants.userId, userId),
    });
    const joinedContestIds = new Set(userParticipations.map((p) => p.contestId));

    const contestsWithJoined = contestList.map((c) => ({
      ...c,
      hasJoined: joinedContestIds.has(c.id),
    }));

    return {
      success: true,
      contests: contestsWithJoined,
    };
  } catch (error) {
    console.error("Error fetching user contests:", error);
    return {
      success: false,
      error: "Failed to fetch contests",
    };
  }
}

export async function getContestSubmissions(contestId: string) {
  try {
    const subs = await db
      .select({
        id: contestSubmissions.id,
        userId: contestSubmissions.userId,
        problemId: contestSubmissions.problemId,
        verdict: contestSubmissions.verdict,
        accepted: contestSubmissions.accepted,
        submittedAt: contestSubmissions.submittedAt,
        penalty: contestSubmissions.penalty,
        userName: users.name,
        cfHandle: users.cfHandle,
      })
      .from(contestSubmissions)
      .innerJoin(users, eq(users.id, contestSubmissions.userId))
      .where(eq(contestSubmissions.contestId, contestId))
      .orderBy(desc(contestSubmissions.submittedAt));

    return {
      success: true,
      submissions: subs,
    };
  } catch (error) {
    console.error("Error fetching contest submissions:", error);
    return {
      success: false,
      error: "Failed to fetch contest submissions",
    };
  }
}
