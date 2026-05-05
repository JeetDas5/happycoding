import React from "react";
import Icon from "@/components/ui/AppIcon";
import Link from "next/link";

const steps = [
  {
    num: "01",
    icon: "UserPlusIcon" as const,
    title: "Register with email",
    description:
      "Create your HappyCoding account with email verification. Takes under 60 seconds — no credit card, no friction.",
    detail: "Email verification required to keep the community authentic.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    num: "02",
    icon: "LinkIcon" as const,
    title: "Connect your Codeforces handle",
    description:
      "Link your existing Codeforces account. We verify ownership with a quick challenge and then sync your full submission history.",
    detail: "Retroactive sync — your past problems count immediately.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    num: "03",
    icon: "RocketLaunchIcon" as const,
    title: "Solve, earn points, compete",
    description:
      "Every accepted submission earns points based on difficulty. Build your streak, climb the leaderboard, and join or create an org.",
    detail: "Daily goal: 1 problem minimum. No cap on how many you can solve.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative"
      aria-label="How HappyCoding works"
    >
      {/* Background watermark */}
      <div
        className="absolute -top-22 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center w-full"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent, currentColor 10%, currentColor 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, currentColor 10%, currentColor 70%, transparent)",
        }}
      >
        <span
          className="font-extrabold text-foreground/[0.025] tracking-tighter whitespace-nowrap"
          style={{ fontSize: "clamp(3rem, 11vw, 11rem)" }}
        >
          Get Started
        </span>
      </div>

      <div className="text-center mb-16 animate-on-scroll opacity-100 scroll-anim-1 relative z-10">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent mb-4">
          <span className="w-1 h-1 rounded-full bg-accent" />
          Setup in 2 minutes
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.05] mb-4">
          Connect once, compete forever
        </h2>
        <p className="text-base md:text-lg text-muted-foreground font-body font-light max-w-xl mx-auto">
          No new workflow. HappyCoding reads your Codeforces submissions
          automatically - you just keep solving like you always do.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`spotlight-card rounded-2xl p-7 border border-border bg-card animate-on-scroll opacity-100 flex flex-col gap-5 scroll-anim-${i + 2} ${
              i === 1 ? "md:mt-8" : i === 2 ? "md:mt-4" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center`}
              >
                <Icon
                  name={step.icon}
                  size={22}
                  variant="solid"
                  className={step.color}
                />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {step.num}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {step.description}
              </p>
            </div>

            <div
              className={`flex items-start gap-2 p-3 rounded-lg ${step.bg} border ${step.border}`}
            >
              <Icon
                name="InformationCircleIcon"
                size={14}
                className={`${step.color} shrink-0 mt-0.5`}
              />
              <span className={`text-xs font-body ${step.color}`}>
                {step.detail}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-muted border border-border items-center justify-center">
                <Icon
                  name="ArrowRightIcon"
                  size={12}
                  className="text-muted-foreground"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12 animate-on-scroll opacity-100 scroll-anim-5 relative z-10">
        <p className="text-sm text-muted-foreground font-body">
          Already on Codeforces?{" "}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:underline underline-offset-2 transition-colors"
          >
            Connect your account in 2 minutes →
          </Link>
        </p>
      </div>
    </section>
  );
}
