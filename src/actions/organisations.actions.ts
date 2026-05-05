"use server";

import { nanoid } from "nanoid";
import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { memberships, organizations, users } from "@/db/schema";

export async function createOrganization(userId: string, name: string) {
  const inviteCode = nanoid(8);

  const [org] = await db
    .insert(organizations)
    .values({
      name,
      inviteCode,
      createdBy: userId,
    })
    .returning();

  await db.insert(memberships).values({
    userId,
    orgId: org.id,
    role: "leader",
  });

  return org;
}

export async function joinOrganization(userId: string, inviteCode: string) {
  const org = await db.query.organizations.findFirst({
    where: (o, { eq }) => eq(o.inviteCode, inviteCode),
  });

  if (!org) throw new Error("Invalid invite code");

  const existingMembership = await db.query.memberships.findFirst({
    where: (m, { and, eq }) => and(eq(m.userId, userId), eq(m.orgId, org.id)),
  });

  if (existingMembership)
    throw new Error("User is already a member of this organization");

  await db.insert(memberships).values({
    userId,
    orgId: org.id,
    role: "member",
  });

  return org;
}

export async function getUserOrganizations(userId: string) {
  return await db.query.memberships.findMany({
    where: (m, { eq }) => eq(m.userId, userId),
    with: {
      organization: true,
    },
  });
}

export async function getOrgMembers(orgId: string) {
  return await db.query.memberships.findMany({
    where: (m, { eq }) => eq(m.orgId, orgId),
    with: {
      user: true,
    },
  });
}

export async function getOrgLeaderboard(orgId: string) {
  return await db
    .select({
      userId: memberships.userId,
      points: users.points,
      name: users.name,
    })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(eq(memberships.orgId, orgId))
    .orderBy(desc(users.points));
}

export async function getGlobalLeaderboard() {
  return await db.select().from(users).orderBy(desc(users.points)).limit(100);
}

export async function leaveOrganization(userId: string, orgId: string) {
  const membership = await db.query.memberships.findFirst({
    where: (m, { and, eq }) => and(eq(m.userId, userId), eq(m.orgId, orgId)),
  });

  if (!membership) throw new Error("User is not a member of this organization");

  if (membership.role === "leader") {
    // Check if there are other members
    const otherMembers = await db.query.memberships.findMany({
      where: (m, { and, eq, ne }) =>
        and(eq(m.orgId, orgId), ne(m.userId, userId)),
    });

    if (otherMembers.length > 0) {
      // Check if there's another leader or admin
      const hasAnotherAdmin = otherMembers.some(
        (m) => m.role === "leader" || m.role === "admin",
      );
      if (!hasAnotherAdmin) {
        throw new Error(
          "You are the only leader. Please promote someone else before leaving.",
        );
      }
    }
  }

  await db.delete(memberships).where(eq(memberships.id, membership.id));

  // Optional: If no members left, delete the organization
  const remainingMembers = await db.query.memberships.findMany({
    where: (m, { eq }) => eq(m.orgId, orgId),
  });

  if (remainingMembers.length === 0) {
    await db.delete(organizations).where(eq(organizations.id, orgId));
  }

  return { success: true };
}
