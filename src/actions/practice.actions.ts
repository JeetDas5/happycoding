"use server";

import { and, gte, lte, sql, notInArray, eq, arrayOverlaps } from "drizzle-orm";
import { problems, submissions } from "@/db/schema";
import db from "@/db";

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export interface PracticeFilters {
  tags?: string[];
  minRating?: number;
  maxRating?: number;
  limit?: number;
  excludeSolved?: boolean;
  userId?: string;
}

export async function getPracticeProblems(filters: PracticeFilters) {
  try {
    const {
      tags = [],
      minRating = 800,
      maxRating = 2000,
      limit = 10,
      excludeSolved = false,
      userId,
    } = filters;

    if (minRating > maxRating) {
      throw new Error("Invalid rating range");
    }

    const conditions = [
      gte(problems.rating, minRating),
      lte(problems.rating, maxRating),
    ];

    if (tags.length > 0) {
      conditions.push(arrayOverlaps(problems.tags, tags));
    }

    if (excludeSolved && userId) {
      const solved = await db
        .select({ problemId: submissions.problemId })
        .from(submissions)
        .where(eq(submissions.userId, userId));

      const solvedIds = solved.map((s) => s.problemId);

      if (solvedIds.length > 0) {
        conditions.push(notInArray(problems.id, solvedIds));
      }
    }

    const candidates = await db
      .select()
      .from(problems)
      .where(and(...conditions))
      .limit(200);

    if (candidates.length === 0) {
      return {
        problems: [],
        message: "No problems found for given filters",
      };
    }

    const shuffled = shuffle(candidates);
    const selected = shuffled.slice(0, Math.min(limit, 50));

    const result = selected.map((p) => ({
      id: p.id,
      name: p.name,
      rating: p.rating,
      tags: p.tags,
      contestId: p.contestId,
      index: p.index,
      url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
    }));

    return {
      problems: result,
      count: result.length,
    };
  } catch (error) {
    console.error("[PRACTICE_ACTION_ERROR]", error);
    throw new Error("Failed to fetch practice problems");
  }
}
