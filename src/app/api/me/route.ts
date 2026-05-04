import db from "@/db";
import { problems, submissions } from "@/db/schema";
import { getSession } from "@/lib/session";
import { and, desc, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

type SolvedProblem = {
  problemId: string;
  name: string;
  tags: string[];
  pointsAwarded: number;
  submittedAt: string | null;
  problemLink: string;
};

function buildProblemLink(
  contestId: number | null,
  index: string | null,
  problemId: string,
) {
  if (contestId && index) {
    return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
  }

  return `https://codeforces.com/problemset?search=${encodeURIComponent(problemId)}`;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      problemId: submissions.problemId,
      submittedAt: submissions.submittedAt,
      pointsAwarded: submissions.pointsAwarded,
      name: problems.name,
      tags: problems.tags,
      contestId: problems.contestId,
      index: problems.index,
    })
    .from(submissions)
    .leftJoin(problems, eq(problems.id, submissions.problemId))
    .where(
      and(
        eq(submissions.userId, session.user.id),
        or(eq(submissions.status, "solved"), eq(submissions.verdict, "OK")),
      ),
    )
    .orderBy(desc(submissions.submittedAt));

  const solvedProblems: SolvedProblem[] = rows.map((row) => {
    const tags = Array.isArray(row.tags) ? row.tags.filter(Boolean) : [];

    return {
      problemId: row.problemId,
      name: row.name || row.problemId,
      tags,
      pointsAwarded: row.pointsAwarded || 0,
      submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
      problemLink: buildProblemLink(row.contestId, row.index, row.problemId),
    };
  });

  const tagCounter = new Map<string, number>();
  const heatmapCounter = new Map<string, number>();

  for (const problem of solvedProblems) {
    for (const tag of problem.tags) {
      tagCounter.set(tag, (tagCounter.get(tag) || 0) + 1);
    }

    if (problem.submittedAt) {
      const day = problem.submittedAt.slice(0, 10);
      heatmapCounter.set(day, (heatmapCounter.get(day) || 0) + 1);
    }
  }

  const tagCounts = [...tagCounter.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const heatmap = [...heatmapCounter.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    user: session.user,
    totals: {
      solvedCount: solvedProblems.length,
      totalPoints: solvedProblems.reduce(
        (acc, cur) => acc + cur.pointsAwarded,
        0,
      ),
    },
    solvedProblems,
    tagCounts,
    heatmap,
  });
}
