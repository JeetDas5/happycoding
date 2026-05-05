"use server";

import { getSession } from "@/lib/session";
import { startCFVerification, verifyCF } from "@/actions/codeforces.actions";
import {
  createOrganization,
  joinOrganization,
  getUserOrganizations,
  leaveOrganization,
} from "@/actions/organisations.actions";
import {
  getGlobalLeaderboard,
  getOrgLeaderboard,
} from "@/actions/leaderboard.actions";
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

  // Trigger sync automatically on dashboard load (replaces 5-min cron)
  manualSync(userId).catch((err) => {
    console.error("Dashboard auto-sync failed:", err);
  });

  const [user, orgs, globalLeaderboard, todayProblem, recentSubmissions] =
    await Promise.all([
      getUser(userId),
      getUserOrganizations(userId),
      getGlobalLeaderboard(10),
      getTodayProblem().catch(() => null),
      getRecentSubmissions(userId, 5),
    ]);

  const todayProblemUrl = todayProblem ? getProblemURL(todayProblem) : null;

  // Fetch leaderboards for each org
  const orgLeaderboards = await Promise.all(
    orgs.map(async (m) => ({
      orgId: m.organization.id,
      orgName: m.organization.name,
      leaderboard: await getOrgLeaderboard(m.organization.id),
    }))
  );

  return {
    user,
    orgs,
    globalLeaderboard,
    orgLeaderboards,
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

export async function handleLeaveOrg(orgId: string) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };
  try {
    await leaveOrganization(session.user.id, orgId);
    return { success: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to leave organization",
    };
  }
}
