/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/db";

export function getDifficultyForToday() {
  const day = new Date().getDay();

  if (day === 1 || day === 2) return "easy";
  if (day === 3 || day === 4) return "medium";
  if (day === 6) return "hard";

  return "mixed";
}

export function getRatingRange(level: string) {
  if (level === "easy") return [800, 1000];
  if (level === "medium") return [1000, 1200];
  if (level === "hard") return [1200, 1500];
  return [800, 1500];
}

export async function pickRandomProblem(level: string) {
  const [min, max] = getRatingRange(level);

  const candidates = await db.query.problems.findMany({
    where: (p, { and, gte, lte }) =>
      and(gte(p.rating, min), lte(p.rating, max)),
  });

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export async function getRecentProblems(last7DaysDate: string) {
  return await db.query.dailyProblems.findMany({
    where: (d, { gte }) => gte(d.date, last7DaysDate),
  });
}

export function getFilteredProblems(candidates: any[], recentProblems: any[]) {
  const usedIds = new Set(recentProblems.map((p) => p.problemId));
  return candidates.filter((p) => !usedIds.has(p.id));
}
