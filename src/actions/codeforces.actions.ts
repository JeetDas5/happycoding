/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/db";
import { users } from "@/db/schema";
import { getUserSubmissions } from "@/helper";

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
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.cfHandle || !user.cfVerificationStartedAt) {
    throw new Error(
      "User does not have a Codeforces handle or verification not started",
    );
  }

  const submissions = await getUserSubmissions(user.cfHandle);

  const startTime = new Date(user.cfVerificationStartedAt).getTime() / 1000;

  const solved = submissions.find(
    (sub: any) => sub.verdict === "OK" && sub.creationTimeSeconds > startTime,
  );

  if (solved) {
    await db
      .update(users)
      .set({ cfVerified: true, cfVerificationStartedAt: null })
      .where(eq(users.id, user.id));

    return { success: true };
  }

  return { success: false, message: "No valid submission found" };
}

export async function findAcceptedSubmission(
  subs: any[],
  problemId: string,
  startTime: any,
) {
  return subs.find(
    (sub) =>
      sub.verdict === "OK" &&
      `${sub.problem.contestId}${sub.problem.index}` === problemId &&
      sub.creationTimeSeconds * 1000 > startTime,
  );
}


