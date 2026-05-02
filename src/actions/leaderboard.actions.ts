import db from "@/db";
import { users, memberships } from "@/db/schema";
import { desc, asc, eq } from "drizzle-orm";

export async function getGlobalLeaderboard(limit: number = 10) {
  return await db.query.users.findMany({
    orderBy: [
      desc(users.points),
      desc(users.streak),
      asc(users.lastSolvedDate),
    ],
    limit,
  });
}

export async function getOrgLeaderboard(orgId: string) {
  return await db
    .select({
      id: users.id,
      name: users.name,
      points: users.points,
      streak: users.streak,
    })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(eq(memberships.orgId, orgId))
    .orderBy(desc(users.points), desc(users.streak), asc(users.lastSolvedDate));
}
