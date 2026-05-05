import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";
import StreakCard from "@/app/components/hero/StreakCard";
import LeaderboardCard from "@/app/components/hero/LeaderboardCard";
import RatingCard from "@/app/components/hero/RatingCard";
import ActivityCard from "@/app/components/hero/ActivityCard";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden"
      aria-label="Hero"
    >
      <div className="hero-anim-1 flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-semibold text-primary dark:text-accent tracking-wide uppercase">
          Codeforces Integration Live
        </span>
      </div>
      <h1 className="hero-anim-2 text-center font-extrabold text-[75px] md:text-[100px] lg:text-[150px] tracking-[-0.04em] leading-[0.85] bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground to-foreground/30 z-20 relative">
        <span className="block">HAPPY</span>
        <span className="block text-foreground/70">CODING</span>
      </h1>
      <p className="hero-anim-3 mt-8 text-base md:text-xl text-muted-foreground text-center max-w-xl leading-relaxed font-body font-light z-20 relative">
        Build daily streaks, earn points, and dominate the leaderboard — all
        powered by your Codeforces account.
      </p>
      <div className="hero-anim-4 flex flex-col sm:flex-row gap-4 mt-10 z-20 relative">
        <Link
          href="#cta"
          className="group relative flex items-center gap-3 rounded-full px-3 py-2 pr-8 overflow-hidden border border-border/50 bg-linear-to-b from-muted/20 via-muted/5 to-muted/20 backdrop-blur-xl hover:bg-primary/10 transition-all duration-300"
          aria-label="Join HappyCoding"
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          >
            <div
              className="absolute animate-spin-slow"
              style={{
                inset: "-100%",
                background:
                  "conic-gradient(from 0deg, transparent 0 300deg, #3B82F6 360deg)",
              }}
            />
          </div>

          <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
            <Icon name="BoltIcon" size={20} variant="solid" />
          </div>
          <span className="relative z-10 text-lg font-bold text-foreground tracking-tight">
            Join HappyCoding
          </span>
        </Link>

        <Link
          href="#features"
          className="flex items-center justify-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon
            name="PlayIcon"
            size={14}
            variant="solid"
            className="text-muted-foreground dark:text-accent"
          />
          See how it works
        </Link>
      </div>
      <div className="hero-anim-5 flex flex-wrap items-center justify-center gap-6 mt-12 z-20 relative">
        {[
          { value: "1,200+", label: "Active coders" },
          { value: "50K+", label: "Problems solved" },
          { value: "47 days", label: "Avg streak" },
        ]?.map((stat) => (
          <div key={stat?.label} className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground font-mono animate-count-glow">
              {stat?.value}
            </span>
            <span className="text-sm text-muted-foreground font-body">
              {stat?.label}
            </span>
          </div>
        ))}
      </div>
      <div className="hidden lg:block absolute top-[16%] left-[7%] animate-float-1">
        <StreakCard />
      </div>
      <div className="hidden lg:block absolute top-[18%] right-[7%] animate-float-2">
        <LeaderboardCard />
      </div>
      <div className="hidden lg:block absolute bottom-[10%] left-[9%] animate-float-3">
        <RatingCard />
      </div>
      <div className="hidden lg:block absolute bottom-[6%] right-[9%] animate-float-4">
        <ActivityCard />
      </div>
    </section>
  );
}
