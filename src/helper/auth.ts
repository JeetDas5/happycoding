import db from "@/db";
import { users } from "@/db/schema";
import { and, lt, gt, isNotNull } from "drizzle-orm";

export async function resetExpiredStreaks() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0); // Start of yesterday in UTC

  await db
    .update(users)
    .set({ streak: 0 })
    .where(
      and(
        isNotNull(users.lastSolvedDate),
        lt(users.lastSolvedDate, yesterday),
        gt(users.streak, 0)
      )
    );
}

export async function isLeader(userId: string, orgId: string) {
  const membership = await db.query.memberships.findFirst({
    where: (m, { and, eq }) => and(eq(m.userId, userId), eq(m.orgId, orgId)),
  });

  return membership?.role === "leader";
}

export async function getUser(userId: string): Promise<User | null> {
  await resetExpiredStreaks();
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });
  if (!user) return null;

  return user;
}
