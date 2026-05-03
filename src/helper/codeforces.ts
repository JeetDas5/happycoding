import db from "@/db";
import { submissions, users } from "@/db/schema";
import axios from "axios";
import { and, desc, eq, sql } from "drizzle-orm";
import { calculatePoints } from "./scoring";
import { getUser } from "./auth";
import { syncUser } from "./sync";
import type {
  CodeforcesProblem,
  CodeforcesProblemsetResponse,
  CodeforcesSubmission,
} from "@/types/codeforces";

export async function fetchProblems(): Promise<CodeforcesProblem[]> {
  const res = await axios.get<CodeforcesProblemsetResponse>(
    "https://codeforces.com/api/problemset.problems",
  );
  const data = res.data;

  return data.result.problems;
}

export async function getUserSubmissions(
  handle: string,
  count: number = 10,
): Promise<CodeforcesSubmission[]> {
  const res = await axios.get<{ status: string; result: CodeforcesSubmission[] }>(
    `https://codeforces.com/api/user.status?handle=${handle}&count=${count}`,
  );
  const data = res.data;

  return data.result;
}

export function hasSolved(
  submissions: CodeforcesSubmission[],
  problemId: string | number,
): boolean {
  return submissions.some(
    (sub) =>
      `${sub.problem.contestId}${sub.problem.index}` === problemId &&
      sub.verdict === "OK",
  );
}

export async function getProblem(problemId: string): Promise<CodeforcesProblem | undefined> {
  const index = problemId[problemId.length - 1];
  const contestId = problemId.slice(0, -1);

  const problems = await fetchProblems();

  return problems.find(
    (p) => p.contestId === parseInt(contestId) && p.index === index,
  );
}

export async function markSolved(userId: string, problemId: string): Promise<void> {
  const alreadySubmitted = await db.query.submissions.findFirst({
    where: and(
      eq(submissions.userId, userId),
      eq(submissions.problemId, problemId),
    ),
  });

  if (alreadySubmitted) return;

  const problem = await getProblem(problemId);
  if (!problem) return;

  const points = calculatePoints(problem.rating || problem.points || 0);

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

export async function getTodayProblem(): Promise<CodeforcesProblem | null> {
  const today = new Date().toISOString().split("T")[0];

  const todayRecord = await db.query.dailyProblems.findFirst({
    where: (d, { eq }) => eq(d.date, today),
  });
  if (!todayRecord) {
    return null;
  }

  const problem = await getProblem(todayRecord.problemId);

  if (!problem) {
    return null;
  }

  return problem;
}

export function getProblemURL(problem: CodeforcesProblem): string {
  return `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
}

export async function manualSync(userId: string): Promise<void> {
  const user = await getUser(userId);
  if(!user || !user.cfVerified) return;
  await syncUser(user);
}

export async function getRecentSubmissions(userId: string, limit: number = 5) {
  const userSubmissions = await db.query.submissions.findMany({
    where: eq(submissions.userId, userId),
    orderBy: desc(submissions.submittedAt),
    limit,
  });
  return userSubmissions;
}
