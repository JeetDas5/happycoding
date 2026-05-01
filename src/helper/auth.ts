import db from "@/db";

export async function isLeader(userId: string, orgId: string) {
  const membership = await db.query.memberships.findFirst({
    where: (m, { and, eq }) => and(eq(m.userId, userId), eq(m.orgId, orgId)),
  });

  return membership?.role === "leader";
}

export async function getUser(userId: string) {
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  return user;
}
