"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Loader2, RefreshCw, Trophy, Zap, Copy, Check } from "lucide-react";
import {
  handleStartCFVerification,
  handleVerifyCF,
  handleManualSync,
  handleCreateOrg,
  handleJoinOrg,
} from "./actions";
import { useRouter } from "next/navigation";

// ─── CF Verification Widget ──────────────────────────────────────────────────
interface CFWidgetProps {
  cfHandle: string | null | undefined;
  cfVerified: boolean | null | undefined;
  cfVerificationStartedAt: Date | null | undefined;
}

export function CFWidget({ cfHandle, cfVerified, cfVerificationStartedAt }: CFWidgetProps) {
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
      if ("error" in res && res.error) {
        setMessage(res.error);
      } else if (res.success) {
        setStep("done");
        setMessage("Codeforces handle verified successfully!");
        router.refresh();
      } else {
        setMessage("No valid submission found yet. Try solving a problem first.");
      }
    });
  }

  if (step === "done") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Codeforces Verified</p>
          <p className="text-xs opacity-80">Handle: <span className="font-mono font-bold">{cfHandle}</span></p>
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
          <Button onClick={startVerification} disabled={isPending || !handle.trim()} className="shrink-0">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
          </Button>
        </div>
      )}
      {step === "started" && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
            <p className="font-medium text-primary mb-1">Step: Submit any problem</p>
            <p className="text-muted-foreground text-xs">
              Go to <span className="font-mono text-primary">codeforces.com</span>, submit any problem, then click Verify below.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={verify} disabled={isPending} className="flex-1">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Verify Submission
            </Button>
            <Button variant="outline" onClick={() => setStep("idle")} disabled={isPending}>
              Reset
            </Button>
          </div>
        </div>
      )}
      {message && (
        <p className={`text-xs ${step === "done" ? "text-green-600" : "text-muted-foreground"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

// ─── Manual Sync Button ───────────────────────────────────────────────────────
export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const router = useRouter();

  function sync() {
    startTransition(async () => {
      setMsg("");
      const res = await handleManualSync();
      if (res.error) {
        setMsg(res.error);
      } else {
        setMsg("Synced! Points and streak updated.");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={sync} disabled={isPending} variant="outline" size="sm" className="gap-2">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Sync Progress
      </Button>
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}

// ─── Organization Actions Widget ──────────────────────────────────────────────
export function OrgWidget() {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    startTransition(async () => {
      setMsg(null);
      const res = tab === "create" ? await handleCreateOrg(value) : await handleJoinOrg(value);
      if ("error" in res && res.error) {
        setMsg({ type: "error", text: res.error });
      } else {
        setMsg({ type: "success", text: tab === "create" ? "Organization created!" : "Joined organization!" });
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
            onClick={() => { setTab(t); setValue(""); setMsg(null); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
              tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
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
        <Button onClick={submit} disabled={isPending || !value.trim()} className="shrink-0">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : tab === "create" ? "Create" : "Join"}
        </Button>
      </div>
      {msg && (
        <p className={`text-xs ${msg.type === "success" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
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
