"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash,
  Clock,
  Trophy,
  Calendar,
  RefreshCw,
  ExternalLink,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  BarChart3,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createContest } from "@/actions/contest/create-contest.actions";
import { joinContest } from "@/actions/contest/join-contest.actions";
import { syncContest } from "@/actions/contest/sync-contest.actions";

export interface Org {
  id: string;
  name: string;
  role: string;
}

export interface Contest {
  id: string;
  organizationId: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  createdBy: string;
  isPublic: boolean | null;
  status: string;
  createdAt: string | null;
  hasJoined?: boolean;
}

export interface Problem {
  id: string;
  name: string;
  rating: number | null;
  tags: string[] | null;
  position: string;
  contestId: number | null;
  index: string;
  url: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  score: number;
  penalty: number;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  verdict: string | null;
  accepted: boolean | null;
  submittedAt: string | null;
  penalty: number;
  userName: string;
  cfHandle: string | null;
}

interface ContestClientProps {
  currentUserId: string;
  userOrgs: Org[];
  contests: Contest[];
  selectedContest: Contest | null;
  leaderboard: LeaderboardEntry[];
  submissions: Submission[];
  problems: Problem[];
}

export function ContestClient({
  currentUserId,
  userOrgs,
  contests,
  selectedContest,
  leaderboard,
  submissions,
  problems,
}: ContestClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"problems" | "leaderboard" | "matrix">("problems");
  const [dashboardTab, setDashboardTab] = useState<"ongoing" | "upcoming" | "completed">("ongoing");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Create Contest Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orgId, setOrgId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTimeStr, setStartTimeStr] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTimeStr, setEndTimeStr] = useState("");
  const [formProblems, setFormProblems] = useState<{ problemId: string; position: string }[]>([
    { problemId: "", position: "A" },
  ]);

  // Check if current user is admin/leader in at least one organization
  const canCreateContests = useMemo(() => {
    return userOrgs.some((o) => o.role === "leader" || o.role === "admin");
  }, [userOrgs]);

  // Set default organization for create contest form
  useEffect(() => {
    const defaultOrg = userOrgs.find((o) => o.role === "leader" || o.role === "admin");
    if (defaultOrg) {
      setOrgId(defaultOrg.id);
    }
  }, [userOrgs]);

  // Categorize contests dynamically
  const categorizedContests = useMemo(() => {
    const now = new Date();
    const ongoing: Contest[] = [];
    const upcoming: Contest[] = [];
    const completed: Contest[] = [];

    contests.forEach((c) => {
      const start = new Date(c.startTime);
      const end = new Date(c.endTime);

      if (now < start) {
        upcoming.push(c);
      } else if (now >= start && now <= end) {
        ongoing.push(c);
      } else {
        completed.push(c);
      }
    });

    return { ongoing, upcoming, completed };
  }, [contests]);

  // Check user registration status for active contest
  const hasJoinedSelected = useMemo(() => {
    if (!selectedContest) return false;
    const match = contests.find((c) => c.id === selectedContest.id);
    return match?.hasJoined || false;
  }, [selectedContest, contests]);

  // Calculate live contest status
  const contestStatus = useMemo(() => {
    if (!selectedContest) return "none";
    const now = new Date();
    const start = new Date(selectedContest.startTime);
    const end = new Date(selectedContest.endTime);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "completed";
  }, [selectedContest]);

  // Matrix lookups
  const submissionsMap = useMemo(() => {
    const map: Record<string, Record<string, Submission>> = {};
    submissions.forEach((sub) => {
      if (!map[sub.userId]) {
        map[sub.userId] = {};
      }
      // If already solved, preserve the successful one, else store
      const prev = map[sub.userId][sub.problemId];
      if (!prev || sub.accepted || (!prev.accepted && !sub.accepted)) {
        map[sub.userId][sub.problemId] = sub;
      }
    });
    return map;
  }, [submissions]);

  // Handle Add Problem in Form
  const handleAddProblem = () => {
    const nextLetter = String.fromCharCode(65 + formProblems.length); // A, B, C...
    setFormProblems([...formProblems, { problemId: "", position: nextLetter }]);
  };

  // Handle Remove Problem in Form
  const handleRemoveProblem = (index: number) => {
    const updated = formProblems.filter((_, i) => i !== index);
    // Recalculate letters
    const remapped = updated.map((p, i) => ({
      ...p,
      position: String.fromCharCode(65 + i),
    }));
    setFormProblems(remapped);
  };

  const handleProblemChange = (index: number, field: "problemId" | "position", value: string) => {
    const updated = [...formProblems];
    updated[index] = { ...updated[index], [field]: value };
    setFormProblems(updated);
  };

  // Handle Create Contest Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Please enter a title");
    if (!orgId) return toast.error("Please select an organization");
    if (!startDate || !startTimeStr) return toast.error("Please select a start date and time");
    if (!endDate || !endTimeStr) return toast.error("Please select an end date and time");

    const start = new Date(`${startDate}T${startTimeStr}`);
    const end = new Date(`${endDate}T${endTimeStr}`);

    if (start >= end) {
      return toast.error("Start time must be before the end time");
    }

    const validProblems = formProblems.filter((p) => p.problemId.trim() !== "");
    if (validProblems.length === 0) {
      return toast.error("Please add at least one problem with a valid ID");
    }

    startTransition(async () => {
      try {
        const res = await createContest({
          userId: currentUserId,
          orgId,
          title,
          description: description || undefined,
          startTime: start,
          endTime: end,
          problems: validProblems,
        });

        if (res.success) {
          toast.success("Contest created successfully!");
          setIsCreateOpen(false);
          // Clear inputs
          setTitle("");
          setDescription("");
          setStartDate("");
          setStartTimeStr("");
          setEndDate("");
          setEndTimeStr("");
          setFormProblems([{ problemId: "", position: "A" }]);
          router.refresh();
        } else {
          toast.error(res.error || "Failed to create contest");
        }
      } catch (err) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  // Handle Join Contest
  const handleJoin = async () => {
    if (!selectedContest) return;
    startTransition(async () => {
      try {
        const res = await joinContest({
          userId: currentUserId,
          contestId: selectedContest.id,
        });

        if (res.success) {
          toast.success("Successfully registered for the contest!");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to register");
        }
      } catch (err) {
        toast.error("Could not register at this time.");
      }
    });
  };

  // Handle Sync Submissions
  const handleSync = async () => {
    if (!selectedContest) return;
    const toastId = toast.loading("Syncing submissions from Codeforces API...");
    try {
      const res = await syncContest(selectedContest.id);
      if (res.success) {
        toast.success("Submissions synced! Standings updated.", { id: toastId });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to sync submissions", { id: toastId });
      }
    } catch (err) {
      toast.error("Synchronization failed.", { id: toastId });
    }
  };

  // RENDER DETAILED VIEW
  if (selectedContest) {
    return (
      <div className="space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/contest")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground pl-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Contests</span>
          </Button>

          {contestStatus === "ongoing" && hasJoinedSelected && (
            <Button
              onClick={handleSync}
              className="bg-primary hover:bg-primary/80 text-white font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Submissions</span>
            </Button>
          )}
        </div>

        {/* Contest Header */}
        <Card className="glass-card border-border bg-card/40 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
            <Badge
              variant={
                contestStatus === "ongoing"
                  ? "default"
                  : contestStatus === "upcoming"
                  ? "secondary"
                  : "outline"
              }
              className={
                contestStatus === "ongoing"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : contestStatus === "upcoming"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-muted text-muted-foreground"
              }
            >
              {contestStatus === "ongoing"
                ? "Live / Ongoing"
                : contestStatus === "upcoming"
                ? "Upcoming"
                : "Completed"}
            </Badge>
            {hasJoinedSelected && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Registered
              </Badge>
            )}
          </div>

          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground pr-36">
              {selectedContest.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {new Date(selectedContest.startTime).toLocaleString()} —{" "}
                {new Date(selectedContest.endTime).toLocaleString()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedContest.description && (
              <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed border-t border-border/50 pt-4">
                {selectedContest.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Countdown Timer Widget */}
        <Card className="glass-card border-border bg-card/30 backdrop-blur-md">
          <CardContent className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: "8s" }} />
              <div>
                <h4 className="font-bold text-sm text-foreground uppercase tracking-widest">
                  {contestStatus === "upcoming"
                    ? "Contest Starts In"
                    : contestStatus === "ongoing"
                    ? "Time Remaining"
                    : "Contest Has Ended"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {contestStatus === "completed"
                    ? "Standings are frozen and final"
                    : "Keep solving on Codeforces and sync your standings"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CountdownTimer
                targetDate={
                  contestStatus === "upcoming" ? selectedContest.startTime : selectedContest.endTime
                }
                status={contestStatus}
              />
            </div>
          </CardContent>
        </Card>

        {/* UPCOMING VIEW (Members haven't entered yet, need to join/register) */}
        {contestStatus === "upcoming" && (
          <Card className="border-border bg-card/20 py-8 text-center rounded-3xl">
            <CardContent className="flex flex-col items-center justify-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Prepare for Battle!</h3>
                <p className="text-muted-foreground text-sm">
                  Register for this contest to secure your place on the live leaderboard. You will be able to view and solve problems once the timer hits zero.
                </p>
              </div>

              {hasJoinedSelected ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-green-500/5">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Registered & Ready!</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Problems will unlock when contest starts.</span>
                </div>
              ) : (
                <Button
                  onClick={handleJoin}
                  disabled={isPending}
                  size="lg"
                  className="bg-primary hover:bg-primary/85 text-white font-bold h-12 px-8 rounded-full transition-all shadow-lg shadow-primary/20"
                >
                  {isPending ? "Registering..." : "Register / Join Contest"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* ONGOING / COMPLETED MAIN PANEL */}
        {(contestStatus === "ongoing" || contestStatus === "completed") && (
          <div className="space-y-6">
            {!hasJoinedSelected && contestStatus === "ongoing" && (
              <Card className="border-yellow-500/30 bg-yellow-500/5 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  <span className="font-bold">Notice:</span> You haven&apos;t registered for this contest. Join now to appear on the leaderboard!
                </div>
                <Button onClick={handleJoin} disabled={isPending} size="sm" className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  {isPending ? "Joining..." : "Join Contest"}
                </Button>
              </Card>
            )}

            {/* TAB SELECTOR */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("problems")}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "problems"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="w-4 h-4" />
                Problems ({problems.length})
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "leaderboard"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab("matrix")}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "matrix"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Problems Solved Matrix
              </button>
            </div>

            {/* TABS CONTAINER */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* PROBLEMS TAB */}
              {activeTab === "problems" && (
                <div className="space-y-4">
                  {problems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No problems configured for this contest.</div>
                  ) : (
                    problems.map((problem) => {
                      const userSolved = submissions.some(
                        (s) =>
                          s.userId === currentUserId &&
                          s.problemId === problem.id &&
                          s.accepted
                      );

                      return (
                        <Card
                          key={problem.id}
                          className="glass-card border-border bg-card/30 hover:bg-card/40 transition-all duration-300 overflow-hidden"
                        >
                          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                  {problem.position}
                                </Badge>
                                <h3 className="text-xl font-bold text-foreground">
                                  {problem.name}
                                </h3>
                                {userSolved && (
                                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Solved</span>
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-muted-foreground text-xs">
                                  ID: {problem.id}
                                </Badge>
                                {problem.rating && (
                                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/20 text-xs">
                                    Rating: {problem.rating}
                                  </Badge>
                                )}
                                {problem.tags &&
                                  problem.tags.slice(0, 5).map((t) => (
                                    <Badge key={t} variant="secondary" className="text-xs uppercase tracking-widest text-[9px] bg-muted/50 text-muted-foreground">
                                      {t}
                                    </Badge>
                                  ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 border-t md:border-0 border-border pt-4 md:pt-0">
                              <a
                                href={problem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-border hover:bg-primary hover:text-white transition-all cursor-pointer h-11 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-foreground bg-transparent"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Solve on Codeforces</span>
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              )}

              {/* LEADERBOARD TAB */}
              {activeTab === "leaderboard" && (
                <Card className="glass-card border-border bg-card/30 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <th className="px-6 py-4 w-20 text-center">Rank</th>
                          <th className="px-6 py-4">Participant</th>
                          <th className="px-6 py-4 text-center">Score (Solved)</th>
                          <th className="px-6 py-4 text-center">Total Penalty (m)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-sm">
                        {leaderboard.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                              No participants on the leaderboard yet. Solve a problem and sync to populate standing.
                            </td>
                          </tr>
                        ) : (
                          leaderboard.map((entry) => {
                            const isMe = entry.userId === currentUserId;
                            return (
                              <tr
                                key={entry.userId}
                                className={`transition-all hover:bg-muted/10 ${
                                  isMe ? "bg-primary/5 font-semibold" : ""
                                }`}
                              >
                                <td className="px-6 py-4 text-center">
                                  {entry.rank === 1 ? (
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20 shadow-lg shadow-yellow-500/5">
                                      🥇
                                    </span>
                                  ) : entry.rank === 2 ? (
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-300/10 text-zinc-300 font-bold border border-zinc-300/20">
                                      🥈
                                    </span>
                                  ) : entry.rank === 3 ? (
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-600/10 text-amber-600 font-bold border border-amber-600/20">
                                      🥉
                                    </span>
                                  ) : (
                                    <span className="font-mono text-muted-foreground">{entry.rank}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{entry.name}</span>
                                    {isMe && <Badge className="bg-primary/20 text-primary py-0.5 px-2 text-[10px]">You</Badge>}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center font-mono font-bold text-green-400 text-lg">
                                  {entry.score}
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-muted-foreground">
                                  {entry.penalty}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* MATRIX TAB */}
              {activeTab === "matrix" && (
                <Card className="glass-card border-border bg-card/30 overflow-hidden">
                  <div className="overflow-x-auto p-2">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/15">
                          <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-muted-foreground">Participant</th>
                          {problems.map((prob) => (
                            <th
                              key={prob.id}
                              className="px-4 py-4 text-center font-bold text-xs uppercase tracking-wider text-muted-foreground w-32 min-w-[120px]"
                            >
                              <div className="flex flex-col items-center">
                                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md mb-1 font-extrabold">
                                  {prob.position}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]" title={prob.name}>
                                  {prob.name}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-sm">
                        {leaderboard.length === 0 ? (
                          <tr>
                            <td colSpan={problems.length + 1} className="px-6 py-8 text-center text-muted-foreground">
                              No solve attempts logged yet.
                            </td>
                          </tr>
                        ) : (
                          leaderboard.map((user) => {
                            const isMe = user.userId === currentUserId;
                            return (
                              <tr
                                key={user.userId}
                                className={`transition-all hover:bg-muted/10 ${isMe ? "bg-primary/5" : ""}`}
                              >
                                <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span>{user.name}</span>
                                    {isMe && <Badge className="bg-primary/20 text-primary text-[9px] px-1 py-0">You</Badge>}
                                  </div>
                                </td>

                                {problems.map((prob) => {
                                  const cellSub = submissionsMap[user.userId]?.[prob.id];

                                  return (
                                    <td key={prob.id} className="px-2 py-3 text-center">
                                      {cellSub ? (
                                        cellSub.accepted ? (
                                          <div className="mx-auto flex flex-col justify-center items-center h-12 w-24 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-semibold p-1 animate-in zoom-in duration-200">
                                            <CheckCircle2 className="w-4 h-4 mb-0.5" />
                                            <span className="text-[10px] font-mono leading-none">
                                              +{cellSub.penalty}m
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="mx-auto flex flex-col justify-center items-center h-12 w-24 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold p-1">
                                            <XCircle className="w-4 h-4 mb-0.5" />
                                            <span className="text-[10px] font-mono leading-none">
                                              Attempted
                                            </span>
                                          </div>
                                        )
                                      ) : (
                                        <div className="mx-auto h-12 w-24 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground/30 font-semibold">
                                          —
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // RENDER MAIN DASHBOARD VIEW
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="px-4 py-1 text-sm">
            Competitions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-2">
            Coding <span className="text-primary">Contests</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Compete in custom competitive programming matches inside your organizations, with live leaderboard updates!
          </p>
        </div>

        {canCreateContests && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Create Contest</span>
          </Button>
        )}
      </div>

      {/* DASHBOARD TAB SELECTOR */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setDashboardTab("ongoing")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            dashboardTab === "ongoing"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4 text-green-400" />
          Ongoing ({categorizedContests.ongoing.length})
        </button>
        <button
          onClick={() => setDashboardTab("upcoming")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            dashboardTab === "upcoming"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-4 h-4 text-blue-400" />
          Upcoming ({categorizedContests.upcoming.length})
        </button>
        <button
          onClick={() => setDashboardTab("completed")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            dashboardTab === "completed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="w-4 h-4 text-zinc-400" />
          Completed ({categorizedContests.completed.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render selected category contests */}
        {categorizedContests[dashboardTab].length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-border rounded-3xl bg-muted/10">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="font-bold text-lg text-foreground mb-1">No {dashboardTab} contests</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {dashboardTab === "ongoing"
                ? "No battles are currently active. Check out the upcoming tab to see what is scheduled next!"
                : dashboardTab === "upcoming"
                ? "No future contests are currently scheduled. Let your organization leaders know!"
                : "No contests have been completed yet."}
            </p>
          </div>
        ) : (
          categorizedContests[dashboardTab].map((contest) => {
            const orgName = userOrgs.find((o) => o.id === contest.organizationId)?.name || "Organization";
            return (
              <Card
                key={contest.id}
                className="glass-card border-border bg-card/30 hover:bg-card/45 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-md hover:shadow-lg group"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge variant="outline" className="text-xs border-border bg-muted/30">
                      {orgName}
                    </Badge>
                    {contest.hasJoined && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] uppercase tracking-wider font-extrabold">
                        Registered
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {contest.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                    {contest.description || "No description provided."}
                  </p>

                  <div className="space-y-2 border-t border-border/50 pt-3 mt-auto">
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Starts:</span>
                      <span>{new Date(contest.startTime).toLocaleDateString()} {new Date(contest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Ends:</span>
                      <span>{new Date(contest.endTime).toLocaleDateString()} {new Date(contest.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push(`/contest?id=${contest.id}`)}
                    className="w-full mt-2 bg-muted hover:bg-primary hover:text-white border-border text-foreground transition-all cursor-pointer font-bold rounded-xl h-10 flex items-center justify-center gap-2 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                  >
                    <span>
                      {dashboardTab === "ongoing"
                        ? "Enter Contest"
                        : dashboardTab === "upcoming"
                        ? "View Details"
                        : "View Standings"}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* CREATE CONTEST PREMIUM MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] z-10 custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Create Organization Contest</span>
                </h3>
                <p className="text-muted-foreground text-xs">
                  Schedule a battle of wits! Add problems from Codeforces and invite members.
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-5">
                {/* Organization Select */}
                <div className="space-y-2">
                  <Label htmlFor="orgSelect" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Select Organization</Label>
                  <select
                    id="orgSelect"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted/50 text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  >
                    {userOrgs
                      .filter((o) => o.role === "leader" || o.role === "admin")
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.role})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="titleInput" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Contest Title</Label>
                  <Input
                    id="titleInput"
                    placeholder="Enter an exciting title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl border-border bg-muted/30 focus-visible:ring-primary/40 h-11 text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="descInput" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Description (Optional)</Label>
                  <textarea
                    id="descInput"
                    placeholder="Provide details about rules, guidelines, or instructions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-border bg-muted/30 text-foreground p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Timings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Start Time</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-xl border-border bg-muted/30 focus-visible:ring-primary/40 text-foreground"
                      />
                      <Input
                        type="time"
                        value={startTimeStr}
                        onChange={(e) => setStartTimeStr(e.target.value)}
                        className="rounded-xl border-border bg-muted/30 focus-visible:ring-primary/40 text-foreground"
                      />
                    </div>
                  </div>

                  {/* End Time */}
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">End Time</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-xl border-border bg-muted/30 focus-visible:ring-primary/40 text-foreground"
                      />
                      <Input
                        type="time"
                        value={endTimeStr}
                        onChange={(e) => setEndTimeStr(e.target.value)}
                        className="rounded-xl border-border bg-muted/30 focus-visible:ring-primary/40 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Problem Inputs */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Contest Problems</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddProblem}
                      className="border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white h-8 text-xs font-semibold rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Problem
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                    {formProblems.map((problem, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <Badge className="bg-muted text-muted-foreground border-border h-10 w-10 flex items-center justify-center rounded-xl font-bold shrink-0">
                          {problem.position}
                        </Badge>
                        <Input
                          placeholder="Codeforces Problem ID (e.g. 1791A)"
                          value={problem.problemId}
                          onChange={(e) => handleProblemChange(index, "problemId", e.target.value)}
                          className="rounded-xl border-border bg-muted/30 focus-visible:ring-primary/40 h-10 text-foreground whitespace-nowrap placeholder:text-muted-foreground/40 font-mono"
                        />
                        <select
                          value={problem.position}
                          onChange={(e) => handleProblemChange(index, "position", e.target.value)}
                          className="rounded-xl border border-border bg-muted/30 text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary h-10 shrink-0 font-bold"
                        >
                          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((letter) => (
                            <option key={letter} value={letter}>
                              {letter}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveProblem(index)}
                          disabled={formProblems.length === 1}
                          className="text-destructive hover:bg-destructive/5 h-10 w-10 p-0 rounded-xl shrink-0"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateOpen(false)}
                    className="hover:bg-muted text-muted-foreground font-semibold rounded-xl h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/95 text-white font-bold h-11 px-6 rounded-xl transition-all shadow-lg shadow-primary/10 cursor-pointer"
                  >
                    {isPending ? "Creating Contest..." : "Launch Contest"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// TIMER COMPONENTS
// -------------------------------------------------------------

function CountdownTimer({ targetDate, status }: { targetDate: string; status: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return <div className="text-muted-foreground text-sm">Loading clock...</div>;
  }

  if (status === "completed") {
    return (
      <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 text-sm font-bold shadow-lg shadow-red-500/5">
        Contest Completed
      </Badge>
    );
  }

  return (
    <div className="flex gap-2 md:gap-3 text-center">
      <TimeCard value={timeLeft.days} label="days" />
      <TimeCard value={timeLeft.hours} label="hours" />
      <TimeCard value={timeLeft.minutes} label="mins" />
      <TimeCard value={timeLeft.seconds} label="secs" />
    </div>
  );
}

function TimeCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-muted/65 border border-border/70 rounded-xl flex items-center justify-center shadow-sm">
        <span className="font-mono text-lg md:text-xl font-bold text-foreground">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold mt-1">
        {label}
      </span>
    </div>
  );
}
