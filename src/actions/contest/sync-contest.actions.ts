"use server";

import db from "@/db";
import {
  contests,
  contestParticipants,
  contestProblems,
  contestSubmissions,
  users,
} from "@/db/schema";

import { and, asc, desc, eq } from "drizzle-orm";

const CODEFORCES_API = "https://codeforces.com/api/user.status";

async function getUserSubmissions(handle: string) {
  const response = await fetch(
    `${CODEFORCES_API}?handle=${handle}&from=1&count=100`
  );

  const data = await response.json();

  if (data.status !== "OK") {
    return [];
  }

  return data.result;
}

function calculatePenaltyMinutes(
  contestStart: Date,
  submissionTimeSeconds: number
) {
  const submissionTime = new Date(submissionTimeSeconds * 1000);

  return Math.floor(
    (submissionTime.getTime() - contestStart.getTime()) / (1000 * 60)
  );
}

export async function syncContest(contestId: string) {
  try {
    // fetch contest
    const contest = await db.query.contests.findFirst({
      where: eq(contests.id, contestId),
    });

    if (!contest) {
      throw new Error("Contest not found");
    }

    const now = new Date();

    // sync only during contest
    if (now < contest.startTime || now > contest.endTime) {
      return {
        success: false,
        error: "Contest not running",
      };
    }

    // fetch contest problems
    const problemList = await db.query.contestProblems.findMany({
      where: eq(contestProblems.contestId, contestId),
    });

    const problemIds = new Set(problemList.map((p) => p.problemId));

    // fetch participants
    const participants = await db
      .select({
        userId: users.id,
        cfHandle: users.cfHandle,
      })
      .from(contestParticipants)
      .innerJoin(users, eq(users.id, contestParticipants.userId))
      .where(eq(contestParticipants.contestId, contestId));

    // process every participant
    for (const participant of participants) {
      if (!participant.cfHandle) continue;

      const submissions = await getUserSubmissions(participant.cfHandle);

      let solvedCount = 0;
      let totalPenalty = 0;

      // track already solved
      const solvedProblems = new Set<string>();

      for (const sub of submissions) {
        if (sub.verdict !== "OK") continue;

        const problemId = `${sub.problem.contestId}${sub.problem.index}`;

        // not contest problem
        if (!problemIds.has(problemId)) continue;

        // duplicate accepted
        if (solvedProblems.has(problemId)) continue;

        const submissionTime = new Date(sub.creationTimeSeconds * 1000);

        // before contest
        if (submissionTime < contest.startTime) continue;

        // after contest
        if (submissionTime > contest.endTime) continue;

        solvedProblems.add(problemId);

        solvedCount++;

        const penalty = calculatePenaltyMinutes(
          contest.startTime,
          sub.creationTimeSeconds
        );

        totalPenalty += penalty;

        // already stored?
        const existing = await db.query.contestSubmissions.findFirst({
          where: and(
            eq(contestSubmissions.contestId, contestId),
            eq(contestSubmissions.userId, participant.userId),
            eq(contestSubmissions.problemId, problemId)
          ),
        });

        if (existing) continue;

        // save accepted solve
        await db.insert(contestSubmissions).values({
          contestId,

          userId: participant.userId,

          problemId,

          cfSubmissionId: sub.id,

          verdict: "OK",

          accepted: true,

          penalty,

          submittedAt: submissionTime,
        });
      }

      // update participant standing
      await db
        .update(contestParticipants)
        .set({
          score: solvedCount,
          penalty: totalPenalty,
        })
        .where(
          and(
            eq(contestParticipants.contestId, contestId),
            eq(contestParticipants.userId, participant.userId)
          )
        );
    }

    // generate ranks
    const standings = await db
      .select({
        userId: contestParticipants.userId,

        score: contestParticipants.score,

        penalty: contestParticipants.penalty,
      })
      .from(contestParticipants)
      .where(eq(contestParticipants.contestId, contestId))
      .orderBy(
        desc(contestParticipants.score),
        asc(contestParticipants.penalty)
      );

    // update ranks
    for (let i = 0; i < standings.length; i++) {
      await db
        .update(contestParticipants)
        .set({
          rank: i + 1,
        })
        .where(
          and(
            eq(contestParticipants.contestId, contestId),
            eq(contestParticipants.userId, standings[i].userId)
          )
        );
    }

    return {
      success: true,
      message: "Contest synced successfully",
    };
  } catch (error) {
    console.error("[SYNC_CONTEST_ERROR]", error);

    return {
      success: false,
      error: "Failed to sync contest",
    };
  }
}
