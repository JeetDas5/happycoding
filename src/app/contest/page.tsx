import { getSession } from "@/lib/session";
import { getUserOrganizations } from "@/actions/organisations.actions";
import {
  getUserContests,
  getContest,
  getContestSubmissions,
} from "@/actions/contest/get-contest.actions";
import { getContestLeaderboard } from "@/actions/contest/get-leaderboard.actions";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import {
  ContestClient,
  type Contest,
  type LeaderboardEntry,
  type Submission,
  type Problem,
} from "./contest-client";

export const metadata = {
  title: "Contests | HappyCoding",
  description:
    "Create and compete in custom competitive programming contests with your peers.",
};

export default async function ContestPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Get user's organizations and the contests they have access to
  const userOrgsRaw = await getUserOrganizations(userId);
  const contestsResult = await getUserContests(userId);

  if (userOrgsRaw.length === 0) {
    return (
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        <DashboardNavbar />
        <main className="container mx-auto px-4 pt-12 pb-8 flex flex-col items-center justify-center space-y-6">
          <div className="text-center max-w-md bg-card/40 backdrop-blur-xl border p-8 rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              No Organization Found
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">
              Contests are created within organizations. Please join or create
              an organization first to participate.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Format organizations for the client
  const userOrgs = userOrgsRaw.map((o) => ({
    id: o.organization.id,
    name: o.organization.name,
    role: o.role || "member", // "leader" | "admin" | "member"
  }));

  // Safe date serialization for client component
  const contests = (contestsResult.contests || []).map((c) => ({
    ...c,
    startTime: c.startTime.toISOString(),
    endTime: c.endTime.toISOString(),
    createdAt: c.createdAt ? c.createdAt.toISOString() : null,
  }));

  let selectedContest: Contest | null = null;
  let leaderboard: LeaderboardEntry[] = [];
  let submissions: Submission[] = [];
  let problems: Problem[] = [];

  const selectedContestId = searchParams.id;
  if (selectedContestId) {
    const detailResult = await getContest(selectedContestId);
    if (detailResult.success && detailResult.contest) {
      // Check if user has access (contest org must match one of user's orgs)
      const hasAccess = userOrgs.some(
        (o) => o.id === detailResult.contest.organizationId
      );

      if (hasAccess) {
        selectedContest = {
          ...detailResult.contest,
          startTime: detailResult.contest.startTime.toISOString(),
          endTime: detailResult.contest.endTime.toISOString(),
          createdAt: detailResult.contest.createdAt
            ? detailResult.contest.createdAt.toISOString()
            : null,
        };

        problems = detailResult.problems || [];

        const leaderboardResult = await getContestLeaderboard(
          selectedContestId
        );
        if (leaderboardResult.success && leaderboardResult.leaderboard) {
          leaderboard = leaderboardResult.leaderboard.map((entry) => ({
            ...entry,
            score: entry.score ?? 0,
            penalty: entry.penalty ?? 0,
          }));
        }

        const submissionsResult = await getContestSubmissions(
          selectedContestId
        );
        if (submissionsResult.success && submissionsResult.submissions) {
          submissions = submissionsResult.submissions.map((s) => ({
            ...s,
            penalty: s.penalty ?? 0,
            submittedAt: s.submittedAt ? s.submittedAt.toISOString() : null,
          }));
        }
      } else {
        // No access - redirect to main contest list
        redirect("/contest");
      }
    } else {
      // Contest not found - redirect to main contest list
      redirect("/contest");
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Premium glowing background elements */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.02) 1px, transparent 1px)",
          backgroundSize: "8rem 8rem",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-7xl h-200 bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <DashboardNavbar />

      <main className="relative z-10 container mx-auto px-4 pt-6 pb-20">
        <ContestClient
          currentUserId={userId}
          userOrgs={userOrgs}
          contests={contests}
          selectedContest={selectedContest}
          leaderboard={leaderboard}
          submissions={submissions}
          problems={problems}
        />
      </main>
    </div>
  );
}
