import db from "@/db";
import { users } from "@/db/schema";
import { getUser } from "@/helper";
import { eq } from "drizzle-orm";

export async function updateStreak(userId: string) {
  const user = await getUser(userId);

  if(!user || !user.lastSolvedDate || !user.streak) return;

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  const lastDate = user.lastSolvedDate
    ? new Date(user.lastSolvedDate).toISOString().split("T")[0]
    : null;

  let newStreak = 1;

  if (lastDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    if (lastDate === todayDate) {
      // already counted today
      return user.streak;
    }

    if (lastDate === yesterdayDate) {
      newStreak = user.streak + 1;
    }
  }

  await db.update(users).set({
    streak: newStreak,
    lastSolvedDate: new Date(),
  }).where(eq(users.id, userId));

  return newStreak;
}