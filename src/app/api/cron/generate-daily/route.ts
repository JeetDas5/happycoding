import db from "@/db";
import { dailyProblems } from "@/db/schema";
import {
  getDifficultyForToday,
  pickRandomProblem,
} from "@/helper/daily-problem";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const exists = await db.query.dailyProblems.findFirst({
    where: (d, { eq }) => eq(d.date, today),
  });

  if (exists) {
    return Response.json({ success: true, problem: exists });
  }

  const difficulty = getDifficultyForToday();

  const problem = await pickRandomProblem(difficulty);

  const problemLink = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;

  await db.insert(dailyProblems).values({
    problemId: problem.id,
    date: today,
    difficulty,
    problemLink,
  });

  return Response.json({ success: true, problem });
}
