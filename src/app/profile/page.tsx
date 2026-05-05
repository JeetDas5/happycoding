"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard-navbar";

type MeResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  totals: {
    solvedCount: number;
    totalPoints: number;
  };
  solvedProblems: Array<{
    problemId: string;
    name: string;
    tags: string[];
    pointsAwarded: number;
    submittedAt: string | null;
    problemLink: string;
  }>;
  tagCounts: Array<{ tag: string; count: number }>;
  heatmap: Array<{ date: string; count: number }>;
};

function dayLabel(date: Date) {
  return date.toISOString().slice(0, 10);
}

function intensityClass(count: number) {
  if (count <= 0) return "bg-muted";
  if (count === 1) return "bg-emerald-200 dark:bg-emerald-900";
  if (count === 2) return "bg-emerald-400 dark:bg-emerald-700";
  if (count === 3) return "bg-emerald-500 dark:bg-emerald-600";
  return "bg-emerald-700 dark:bg-emerald-500";
}

export default function ProfilePage() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load profile data");
        }
        const json = (await res.json()) as MeResponse;
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : "Something went wrong");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const heatmapDays = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of data?.heatmap || []) {
      map.set(item.date, item.count);
    }

    const days: Array<{ date: string; count: number }> = [];
    const today = new Date();
    for (let i = 139; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = dayLabel(d);
      days.push({ date: key, count: map.get(key) || 0 });
    }

    return days;
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-8 space-y-4">
          <p className="text-sm text-destructive">
            {error || "Unable to load profile"}
          </p>
          <Link href="/dashboard" className="text-sm text-primary underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {data.user.name}&apos;s Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Solved history, tags, and activity heat map
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Solved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.totals.solvedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Points From Solved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.totals.totalPoints}</p>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Top Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.tagCounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags yet</p>
              ) : (
                data.tagCounts.slice(0, 12).map((item) => (
                  <span
                    key={item.tag}
                    className="text-xs rounded-full border px-2 py-1 bg-muted/40"
                  >
                    {item.tag} ({item.count})
                  </span>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Activity Heat Map (Last 140 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-20 gap-1">
              {heatmapDays.map((item) => (
                <div
                  key={item.date}
                  className={`h-3 w-3 rounded-xs ${intensityClass(item.count)}`}
                  title={`${item.date}: ${item.count} solved`}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <span className="h-3 w-3 rounded-xs bg-muted" />
              <span className="h-3 w-3 rounded-xs bg-emerald-200 dark:bg-emerald-900" />
              <span className="h-3 w-3 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
              <span className="h-3 w-3 rounded-xs bg-emerald-500 dark:bg-emerald-600" />
              <span className="h-3 w-3 rounded-xs bg-emerald-700 dark:bg-emerald-500" />
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Solved Problems</CardTitle>
          </CardHeader>
          <CardContent>
            {data.solvedProblems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No solved problems yet.
              </p>
            ) : (
              <div className="space-y-2">
                {data.solvedProblems.map((problem) => (
                  <div
                    key={problem.problemId}
                    className="flex flex-col gap-2 rounded-xl border p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {problem.problemId} - {problem.name}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <span
                            key={`${problem.problemId}-${tag}`}
                            className="text-xs rounded border px-1.5 py-0.5 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {problem.pointsAwarded > 0
                          ? `+${problem.pointsAwarded} pts`
                          : "0 pts"}
                      </span>
                      <span>
                        {problem.submittedAt
                          ? new Date(problem.submittedAt).toLocaleDateString()
                          : "—"}
                      </span>
                      <a
                        href={problem.problemLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary"
                      >
                        Problem
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
