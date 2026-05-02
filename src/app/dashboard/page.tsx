import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Star,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  Building2,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "./actions";
import { CFWidget, SyncButton, OrgWidget, CopyButton } from "./client-widgets";

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) redirect("/login");

  const {
    user,
    orgs,
    globalLeaderboard,
    todayProblem,
    todayProblemUrl,
    recentSubmissions,
  } = data;

  const difficulty = todayProblem?.rating
    ? todayProblem.rating < 1000
      ? "easy"
      : todayProblem.rating < 1200
        ? "medium"
        : "hard"
    : "medium";
  console.log("Today's problem difficulty: ", difficulty);

  const rank =
    globalLeaderboard.findIndex((u: { id: string }) => u.id === user?.id) + 1;
  const difficultyColor: Record<string, string> = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Happy<span className="text-primary">Coding</span>
          </Link>
          <div className="flex items-center gap-3">
            <SyncButton />
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
            >
              <Link
                href="/api/auth/logout"
                className="flex flex-row gap-1 justify-center items-center"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-4 pb-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Keep your streak alive and climb the leaderboard.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            label="Current Streak"
            value={`${user?.streak ?? 0}`}
            sub="days"
            accent="orange"
          />
          <StatCard
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            label="Total Points"
            value={`${user?.points ?? 0}`}
            sub="pts"
            accent="yellow"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5 text-primary" />}
            label="Global Rank"
            value={rank > 0 ? `#${rank}` : "N/A"}
            sub="of top 10"
            accent="primary"
          />
          <StatCard
            icon={<Code2 className="w-5 h-5 text-green-500" />}
            label="Problems Solved"
            value={`${
              recentSubmissions.filter(
                (s) => s.status === "solved" || s.verdict === "OK",
              ).length
            }`}
            sub="recent"
            accent="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="py-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    Today&apos;s Challenge
                  </CardTitle>
                  {todayProblem && (
                    <span
                      className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-muted ${
                        difficultyColor[difficulty || ""] ||
                        "text-muted-foreground"
                      }`}
                    >
                      {difficulty || "Mixed"}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {todayProblem ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        {
                          (
                            todayProblem as {
                              contestId: number;
                              index: string;
                              name: string;
                            }
                          ).contestId
                        }
                        {
                          (
                            todayProblem as {
                              contestId: number;
                              index: string;
                              name: string;
                            }
                          ).index
                        }{" "}
                        —{" "}
                        {
                          (
                            todayProblem as {
                              contestId: number;
                              index: string;
                              name: string;
                            }
                          ).name
                        }
                      </h3>
                      {(todayProblem as { rating?: number }).rating && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Rating:{" "}
                          <span className="font-semibold text-foreground">
                            {(todayProblem as { rating?: number }).rating}
                          </span>
                        </p>
                      )}
                    </div>
                    {(todayProblem as { tags?: string[] }).tags && (
                      <div className="flex flex-wrap gap-2">
                        {((todayProblem as { tags?: string[] }).tags || [])
                          .slice(0, 5)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-2">
                      <Button className=" gap-2 px-2 py-4">
                        <Link
                          href={todayProblemUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-row justify-center items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Solve on Codeforces</span>
                        </Link>
                      </Button>
                      {!user?.cfVerified && (
                        <p className="text-xs text-muted-foreground">
                          Connect Codeforces to auto-sync progress
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      No problem assigned for today yet.
                    </p>
                    <p className="text-xs mt-1">Check back later!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Codeforces Integration */}
            <Card className="py-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Codeforces Integration
                </CardTitle>
                <CardDescription>
                  Link your Codeforces handle to auto-track submissions and earn
                  points.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CFWidget
                  cfHandle={user?.cfHandle}
                  cfVerified={user?.cfVerified}
                  cfVerificationStartedAt={user?.cfVerificationStartedAt}
                />
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentSubmissions.length > 0 ? (
                  <div className="space-y-2">
                    {recentSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              sub.verdict === "OK" || sub.status === "solved"
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-mono text-sm font-medium">
                            {sub.problemId}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {sub.pointsAwarded && sub.pointsAwarded > 0 ? (
                            <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                              +{sub.pointsAwarded} pts
                            </span>
                          ) : null}
                          <span className="text-xs text-muted-foreground">
                            {sub.submittedAt
                              ? new Date(sub.submittedAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No submissions yet.</p>
                    <p className="text-xs mt-1">
                      Solve today&apos;s problem to get started!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Global Leaderboard */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  Global Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div>
                  {globalLeaderboard.map(
                    (
                      u: {
                        id: string;
                        name: string;
                        points: number | null;
                        streak: number | null;
                      },
                      idx: number,
                    ) => (
                      <div
                        key={u.id}
                        className={`flex items-center gap-3 px-4 py-3 border-b last:border-0 ${
                          u.id === user?.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-bold w-6 text-center ${
                            idx === 0
                              ? "text-yellow-500"
                              : idx === 1
                                ? "text-zinc-400"
                                : idx === 2
                                  ? "text-orange-500"
                                  : "text-muted-foreground"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              u.id === user?.id ? "text-primary" : ""
                            }`}
                          >
                            {u.name} {u.id === user?.id && "(you)"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold">{u.points ?? 0}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Flame className="w-3 h-3 text-orange-400" />
                            {u.streak ?? 0}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                  {globalLeaderboard.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-6">
                      No data yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizations */}
            <Card className="py-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  My Organizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orgs.length > 0 && (
                  <div className="space-y-2">
                    {orgs.map(
                      (m: {
                        id: string;
                        role: string | null;
                        organization: {
                          id: string;
                          name: string;
                          inviteCode: string;
                        };
                      }) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/40 border"
                        >
                          <div>
                            <p className="text-sm font-semibold">
                              {m.organization.name}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {m.role}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono bg-background border rounded px-2 py-0.5">
                            {m.organization.inviteCode}
                            <CopyButton text={m.organization.inviteCode} />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    {orgs.length === 0
                      ? "Join or create an organization"
                      : "Join another or create"}
                  </p>
                  <OrgWidget />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col gap-2">
          <div className="p-2 rounded-lg bg-muted/50 w-fit">{icon}</div>
          <div>
            <p className="text-2xl font-bold">
              {value}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {sub}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
