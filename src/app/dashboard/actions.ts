"use server";

import { getSession } from "@/lib/session";
import { startCFVerification, verifyCF } from "@/actions/codeforces.actions";
import {
  createOrganization,
  joinOrganization,
  getUserOrganizations,
  getOrgLeaderboard,
} from "@/actions/organisations.actions";
import { getGlobalLeaderboard } from "@/actions/leaderboard.actions";
import { getUser } from "@/helper/auth";
import {
  getTodayProblem,
  getProblemURL,
  manualSync,
  getRecentSubmissions,
} from "@/helper/codeforces";

export async function getDashboardData() {
  const session = await getSession();
  if (!session) return null;

  const userId = session.user.id;

  const [user, orgs, globalLeaderboard, todayProblem, recentSubmissions] =
    await Promise.all([
      getUser(userId),
      getUserOrganizations(userId),
      getGlobalLeaderboard(10),
      getTodayProblem().catch(() => null),
      getRecentSubmissions(userId, 5),
    ]);

  const todayProblemUrl = todayProblem ? getProblemURL(todayProblem) : null;

  return {
    user,
    orgs,
    globalLeaderboard,
    todayProblem,
    todayProblemUrl,
    recentSubmissions,
  };
}

export async function handleStartCFVerification(handle: string) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };
  try {
    await startCFVerification(session.user.id, handle);
    return { success: true };
  } catch (e) {
    return {
      error:
        e instanceof Error
          ? e.message
          : "Failed to start Codeforces verification",
    };
  }
}

export async function handleVerifyCF(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated", success: false };
  try {
    const result = await verifyCF(session.user.id);
    return result;
  } catch (e) {
    return {
      error:
        e instanceof Error ? e.message : "Failed to verify Codeforces account",
      success: false,
    };
  }
}

export async function handleCreateOrg(name: string) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };
  try {
    const org = await createOrganization(session.user.id, name);
    return { success: true, org };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to create organization",
    };
  }
}

export async function handleJoinOrg(inviteCode: string) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };
  try {
    const org = await joinOrganization(session.user.id, inviteCode);
    return { success: true, org };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to join organization",
    };
  }
}

export async function handleManualSync() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };
  try {
    await manualSync(session.user.id);
    return { success: true };
  } catch (e) {
    return {
      error:
        e instanceof Error ? e.message : "Failed to sync Codeforces account",
    };
  }
}

export async function handleGetOrgLeaderboard(orgId: string) {
  return getOrgLeaderboard(orgId);
}
