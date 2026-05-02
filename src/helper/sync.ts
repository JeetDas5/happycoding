/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/db";
import { getTodayProblem, getUserSubmissions } from "./codeforces";
import { findAcceptedSubmission } from "@/actions/codeforces.actions";
import { calculatePoints } from "./scoring";
import { submissions, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { updateStreak } from "@/actions/streak.actions";

export async function syncUser(user: any) {
  if (!user.cfHandle || !user.cfVerified) return;

  const userSubmissions = await getUserSubmissions(user.cfHandle);

  const todayProblem = await getTodayProblem();

  const problemId = todayProblem?.contestId + todayProblem?.index;
  if (!problemId) return;

  const already = await db.query.submissions.findFirst({
    where: (s, { and, eq }) =>
      and(eq(s.userId, user.id), eq(s.problemId, problemId)),
  });

  if (already) return;

  const todayStart = new Date().setHours(0, 0, 0, 0);

  const accepted = await findAcceptedSubmission(
    userSubmissions,
    problemId,
    todayStart,
  );

  if (!accepted) return;

  // get problem rating
  const problem = await db.query.problems.findFirst({
    where: (p, { eq }) => eq(p.id, problemId),
  });

  if (!problem) return;

  const points = calculatePoints(problem.rating);

  // save submission
  await db.insert(submissions).values({
    userId: user.id,
    problemId,
    verdict: "OK",
    cfSubmissionId: accepted.id,
    submittedAt: new Date(accepted.creationTimeSeconds * 1000),
    pointsAwarded: points,
  });

  // update user points
  await db
    .update(users)
    .set({
      points: sql`points + ${points}`,
    })
    .where(eq(users.id, user.id));

  await updateStreak(user.id);
}
