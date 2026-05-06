import db from "@/db";
import { users, memberships } from "@/db/schema";
import { desc, asc, eq, and } from "drizzle-orm";

export async function getGlobalLeaderboard() {
  return await db.query.users.findMany({
    where: eq(users.cfVerified, true),
    orderBy: [
      desc(users.points),
      desc(users.streak),
      asc(users.lastSolvedDate),
    ],
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
    .where(and(eq(memberships.orgId, orgId), eq(users.cfVerified, true)))
    .orderBy(desc(users.points), desc(users.streak), asc(users.lastSolvedDate));
}
