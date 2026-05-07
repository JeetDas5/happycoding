
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  LogOut,
  Trophy,
  Flame,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  handleStartCFVerification,
  handleVerifyCF,
  handleManualSync,
  handleCreateOrg,
  handleJoinOrg,
  handleLeaveOrg,
} from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ITEMS_PER_PAGE } from "@/constants";

interface CFWidgetProps {
  cfHandle: string | null | undefined;
  cfVerified: boolean | null | undefined;
  cfVerificationStartedAt: Date | null | undefined;
}

export function CFWidget({
  cfHandle,
  cfVerified,
  cfVerificationStartedAt,
}: CFWidgetProps) {
  const [handle, setHandle] = useState(cfHandle || "");
  const [step, setStep] = useState<"idle" | "started" | "done">(
    cfVerified ? "done" : cfVerificationStartedAt ? "started" : "idle"
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function startVerification() {
    startTransition(async () => {
      const res = await handleStartCFVerification(handle);
      if (res.error) {
        setMessage(res.error);
      } else {
        setStep("started");
        setMessage("Submit any problem on Codeforces, then click Verify.");
      }
    });
  }

  function verify() {
    startTransition(async () => {
      const res = await handleVerifyCF();
      if (res.error) {
        setMessage(res.error);
      } else if (res.success) {
        setStep("done");
        setMessage("Codeforces handle verified successfully!");
        router.refresh();
      } else {
        setMessage(
          "No valid submission found yet. Try solving a problem first."
        );
      }
    });
  }

  if (step === "done") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Codeforces Verified</p>
          <p className="text-xs opacity-80">
            Handle: <span className="font-mono font-bold">{cfHandle}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {step === "idle" && (
        <div className="flex gap-2">
          <Input
            placeholder="Your Codeforces handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="h-10 font-mono"
          />
          <Button
            onClick={startVerification}
            disabled={isPending || !handle.trim()}
            className="shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      )}
      {step === "started" && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
            <p className="font-medium text-primary mb-1">
              Step: Submit any problem
            </p>
            <p className="text-muted-foreground text-xs">
              Go to{" "}
              <Link
                href="https://codeforces.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary"
              >
                codeforces.com
              </Link>
              , submit any problem, then click Verify below.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={verify}
              disabled={isPending}
              className="flex-1 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Verify Submission
            </Button>
            <Button
              variant="outline"
              onClick={() => setStep("idle")}
              disabled={isPending}
              className="cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function sync() {
    startTransition(async () => {
      const res = await handleManualSync();
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Synced! Points and streak updated.");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={sync}
        disabled={isPending}
        variant="outline"
        size="sm"
        className="gap-2 cursor-pointer"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        Sync Progress
      </Button>
    </div>
  );
}

export function OrgWidget() {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    startTransition(async () => {
      const res =
        tab === "create"
          ? await handleCreateOrg(value)
          : await handleJoinOrg(value);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          tab === "create" ? "Organization created!" : "Joined organization!"
        );
        setValue("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex rounded-lg border p-1 gap-1 bg-muted/30">
        {(["create", "join"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setValue("");
            }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
              tab === t
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={tab === "create" ? "Organization name" : "Invite code"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-10 font-mono"
        />
        <Button
          onClick={submit}
          disabled={isPending || !value.trim()}
          className="shrink-0"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : tab === "create" ? (
            "Create"
          ) : (
            "Join"
          )}
        </Button>
      </div>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:text-primary transition-colors"
      title="Copy invite code"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

export function LeaveOrgButton({ orgId }: { orgId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function leave() {
    startTransition(async () => {
      const res = await handleLeaveOrg(orgId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Left organization successfully");
        router.refresh();
      }
      setIsOpen(false);
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <LogOut className="w-3 h-3" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will lose access to this
            organization&apos;s leaderboard and challenges.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              leave();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Leave Organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function LeaderboardWidget({
  globalLeaderboard,
  orgLeaderboards,
  userId,
}: {
  globalLeaderboard: LeaderBoardData[];
  orgLeaderboards: OrgLeaderBoardData[];
  userId: string;
}) {
  const [view, setView] = useState<"global" | string>("global");
  const [page, setPage] = useState(0);
  const itemsPerPage = ITEMS_PER_PAGE;

  const activeLeaderboard =
    view === "global"
      ? globalLeaderboard
      : orgLeaderboards.find((ol) => ol.orgId === view)?.leaderboard || [];

  const activeName =
    view === "global"
      ? "Global"
      : orgLeaderboards.find((ol) => ol.orgId === view)?.orgName || "Org";

  const totalPages = Math.ceil(activeLeaderboard.length / itemsPerPage);
  const paginatedData = activeLeaderboard.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  const handleNext = () => {
    if (page < totalPages - 1) {
      setDirection(1);
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setDirection(-1);
      setPage(page - 1);
    }
  };

  // Reset page when view changes
  const handleViewChange = (newView: string) => {
    setView(newView);
    setPage(0);
    setDirection(0);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : direction < 0 ? -20 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : direction < 0 ? 20 : 0,
      opacity: 0,
    }),
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            {activeName} Leaderboard
          </CardTitle>
          {orgLeaderboards.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-[10px] font-bold uppercase tracking-wider bg-muted/30 border"
                >
                  {activeName}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleViewChange("global")}>
                  Global
                </DropdownMenuItem>
                {orgLeaderboards.map((ol) => (
                  <DropdownMenuItem
                    key={ol.orgId}
                    onClick={() => handleViewChange(ol.orgId)}
                  >
                    {ol.orgName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden relative">
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${view}-${page}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {paginatedData.length > 0 ? (
                paginatedData.map((u: LeaderBoardData, idx: number) => {
                  const absoluteIdx = page * itemsPerPage + idx;
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center gap-3 px-4 py-3 border-b last:border-0 ${
                        u.id === userId ? "bg-primary/5" : ""
                      }`}
                    >
                      <span
                        className={`text-sm font-bold w-6 text-center ${
                          absoluteIdx === 0
                            ? "text-yellow-500"
                            : absoluteIdx === 1
                            ? "text-zinc-400"
                            : absoluteIdx === 2
                            ? "text-orange-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {absoluteIdx + 1}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            u.id === userId ? "text-primary" : ""
                          }`}
                        >
                          {u.name} {u.id === userId && "(you)"}
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
                  );
                })
              ) : (
                <p className="text-center text-sm text-muted-foreground py-10">
                  No data yet
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 cursor-pointer"
                disabled={page === 0}
                onClick={handlePrev}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 cursor-pointer"
                disabled={page === totalPages - 1}
                onClick={handleNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
