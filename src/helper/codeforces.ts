/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/db";
import { submissions, users } from "@/db/schema";
import axios from "axios";
import { and, eq, sql } from "drizzle-orm";
import { calculatePoints } from "./scoring";

export async function fetchProblems() {
  const res = await axios.get("https://codeforces.com/api/problemset.problems");
  const data = await res.data;

  return data.result.problems;
}

export function filterProblems(problems: any[]) {
  return problems.filter(
    (p) =>
      p.rating >= 800 && p.rating <= 1600 && !p.tags.includes("interactive"),
  );
}

export async function getUserSubmissions(handle: string, count: number = 10) {
  const res = await axios.get(
    `https://codeforces.com/api/user.status?handle=${handle}&count=${count}`,
  );
  const data = await res.data;

  return data.result;
}

export function hasSolved(submissions: any[], problemId: string | number) {
  return submissions.some(
    (sub) =>
      `${sub.problem.contestId}${sub.problem.index}` === problemId &&
      sub.verdict === "OK",
  );
}

export async function getProblem(problemId: string) {
  const index = problemId[problemId.length - 1];
  const contestId = problemId.slice(0, -1);

  const problems = await fetchProblems();

  return problems.find(
    (p: any) => p.contestId === parseInt(contestId) && p.index === index,
  );
}

export async function markSolved(userId: string, problemId: string) {
  const alreadySubmitted = await db.query.submissions.findFirst({
    where: and(
      eq(submissions.userId, userId),
      eq(submissions.problemId, problemId),
    ),
  });

  if (alreadySubmitted) return;

  const problem = await getProblem(problemId);

  const points = calculatePoints(problem.points);

  await db.insert(submissions).values({
    userId,
    problemId,
    status: "solved",
    submittedAt: new Date(),
    pointsAwarded: points,
  });

  await db
    .update(users)
    .set({
      points: sql`${users.points} + ${points}`,
    })
    .where(eq(users.id, userId));
}
