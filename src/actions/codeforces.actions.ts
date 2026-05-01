"use server";

import db from "@/db";
import { users } from "@/db/schema";

import { eq } from "drizzle-orm";

export async function startCFVerification(userId: string, handle: string) {
  await db
    .update(users)
    .set({
      cfHandle: handle,
      cfVerified: false,
      cfVerificationStartedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return { success: true };
}

export async function verifyCF(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    throw new Error("User not found");
  }

  const submissions = await getUserSubmissions(user.cfHandle);

  const startTime = new Date(user.cfVerificationStartedAt).getTime() / 1000;

  const solved = submissions.find(
    (sub) => sub.verdict === "OK" && sub.creationTimeSeconds > startTime,
  );

  if (solved) {
    await db
      .update(users)
      .set({ cfVerified: true })
      .where(eq(users.id, user.id));

    return true;
  }

  return false;
}
